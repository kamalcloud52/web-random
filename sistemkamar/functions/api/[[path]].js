const SESSION_COOKIE = 'kas_admin_session';
const SESSION_SECONDS = 8 * 60 * 60;
const encoder = new TextEncoder();

export async function onRequest(context) {
  const { request, env, params } = context;
  const routeValue = params.path || [];
  const route = Array.isArray(routeValue) ? routeValue.join('/') : String(routeValue);

  if (!env.APPS_SCRIPT_URL || !env.BACKEND_API_KEY) {
    return json({ ok: false, error: 'Cloudflare belum dikonfigurasi untuk Apps Script.' }, 503);
  }

  if (request.method === 'POST' && !isSameOrigin(request)) {
    return json({ ok: false, error: 'Permintaan lintas situs ditolak.' }, 403);
  }

  if (route === 'session' && request.method === 'GET') {
    const authenticated = await verifySession(request, env.SESSION_SECRET);
    return json({ authenticated });
  }

  if (request.method !== 'POST') return json({ ok: false, error: 'Metode tidak didukung.' }, 405);
  const body = await readJson(request);
  if (body instanceof Response) return body;

  if (route === 'login') {
    if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) return json({ ok: false, error: 'Secret login Cloudflare belum diatur.' }, 503);
    if (!constantTimeEqual(String(body.password || ''), env.ADMIN_PASSWORD)) {
      return json({ ok: false, error: 'Kata sandi admin salah.' }, 401);
    }
    const token = await createSession(env.SESSION_SECRET);
    return json({ ok: true }, 200, {
      'Set-Cookie': `${SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=${SESSION_SECONDS}`
    });
  }

  if (route === 'logout') {
    return json({ ok: true }, 200, {
      'Set-Cookie': `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0`
    });
  }

  const actionByRoute = {
    bootstrap: 'bootstrap',
    'transactions/save': 'saveTransaction',
    'transactions/delete': 'deleteTransaction',
    'members/save': 'saveMember',
    'members/archive': 'archiveMember'
  };
  const action = actionByRoute[route];
  if (!action) return json({ ok: false, error: 'Rute API tidak ditemukan.' }, 404);

  if (action !== 'bootstrap' && !(await verifySession(request, env.SESSION_SECRET))) {
    return json({ ok: false, error: 'Sesi admin berakhir. Silakan login kembali.' }, 401);
  }

  try {
    const upstream = await fetch(env.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: env.BACKEND_API_KEY, action, payload: body })
    });
    const result = await upstream.json();
    if (!upstream.ok || result.ok === false) {
      return json({ ok: false, error: result.error || 'Apps Script menolak permintaan.' }, 502);
    }
    return json(result);
  } catch (error) {
    return json({ ok: false, error: 'Tidak dapat menghubungi Apps Script.' }, 502);
  }
}

function isSameOrigin(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; }
  catch (error) { return false; }
}

async function readJson(request) {
  const length = Number(request.headers.get('Content-Length') || 0);
  if (length > 100000) return json({ ok: false, error: 'Ukuran permintaan terlalu besar.' }, 413);
  try { return await request.json(); }
  catch (error) { return json({ ok: false, error: 'Format permintaan tidak valid.' }, 400); }
}

async function createSession(secret) {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  const signature = await sign(expires, secret);
  return `${expires}.${signature}`;
}

async function verifySession(request, secret) {
  if (!secret) return false;
  const cookie = request.headers.get('Cookie') || '';
  const entry = cookie.split(';').map(value => value.trim()).find(value => value.startsWith(`${SESSION_COOKIE}=`));
  if (!entry) return false;
  const token = entry.slice(SESSION_COOKIE.length + 1);
  const [expires, signature, extra] = token.split('.');
  if (!expires || !signature || extra || Number(expires) <= Math.floor(Date.now() / 1000)) return false;
  const expected = await sign(expires, secret);
  return constantTimeEqual(signature, expected);
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return toBase64Url(new Uint8Array(signature));
}

function toBase64Url(bytes) {
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function constantTimeEqual(left, right) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
}

function json(value, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders }
  });
}
