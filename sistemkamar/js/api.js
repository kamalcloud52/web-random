/* Same-origin Pages API gateway; local file previews keep using demo data. */
window.KAS_CONFIG = window.KAS_CONFIG || {};

window.KasApi = (() => {
    const hasGoogleRunner = typeof google !== 'undefined' && google.script && google.script.run;
    const host = window.location.hostname;
    const isLocalPreview = window.location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1';
    const requestedMode = new URLSearchParams(window.location.search).get('backend');
    const mode = window.KAS_CONFIG.mode || requestedMode || (hasGoogleRunner ? 'apps-script' : (isLocalPreview ? 'demo' : 'cloudflare'));

    function googleCall(functionName, ...args) {
        return new Promise((resolve, reject) => {
            google.script.run
                .withSuccessHandler(resolve)
                .withFailureHandler(error => reject(new Error(error && error.message ? error.message : 'Permintaan ke server gagal.')))
                [functionName](...args);
        });
    }

    async function pagesCall(path, payload, method = 'POST') {
        const response = await fetch(`/api/${path}`, {
            method,
            credentials: 'same-origin',
            headers: method === 'GET' ? {} : { 'Content-Type': 'application/json' },
            body: method === 'GET' ? undefined : JSON.stringify(payload || {})
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.ok === false) throw new Error(result.error || 'Permintaan ke server gagal.');
        return result;
    }

    const usePages = () => mode === 'cloudflare';
    const useGoogleRunner = () => mode === 'apps-script' && hasGoogleRunner;
    const call = (name, path, ...args) => usePages()
        ? pagesCall(path, args[0])
        : googleCall(name, ...args);

    return {
        mode,
        isLive: () => mode !== 'demo',
        usesBackend: () => mode !== 'demo',
        getSession: () => usePages() ? pagesCall('session', null, 'GET') : googleCall('apiGetSession'),
        login: password => pagesCall('login', { password }),
        logout: () => usePages() ? pagesCall('logout', {}) : Promise.resolve({ ok: true }),
        getBootstrap: () => call('apiGetBootstrap', 'bootstrap'),
        saveTransaction: transaction => call('apiSaveTransaction', 'transactions/save', transaction),
        deleteTransaction: id => call('apiDeleteTransaction', 'transactions/delete', { id }),
        saveMember: member => call('apiSaveMember', 'members/save', member),
        archiveMember: id => call('apiArchiveMember', 'members/archive', { id })
    };
})();
