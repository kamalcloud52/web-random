/**
 * Login Page Component
 */
import { setUser, showToast, createRipple } from '../utils/helpers.js';

export function renderLoginPage(appContainer, onLoginSuccess) {
  if (!appContainer) return;

  appContainer.innerHTML = `
    <div class="max-w-md mx-auto py-6 sm:py-10 animate-fade-in">
      
      <!-- Login Card -->
      <div id="login-card-box" class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        <!-- Top Green Accent Line -->
        <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 to-emerald-800"></div>

        <!-- Logo PIM Header -->
        <div class="flex flex-col items-center text-center mb-6">
          <img src="../icon.jpg" alt="Logo PIM" class="w-20 h-20 rounded-full border-4 border-amber-300 shadow-md mb-3 object-cover" onerror="this.src='/icon.jpg'" />
          <h1 class="text-xl font-bold text-slate-800">Masuk Perpustakaan PIM</h1>
          <p class="text-xs text-slate-500 mt-1">Masukkan Email/No. Anggota dan Password untuk akses penuh</p>
        </div>

        <!-- Error Message Banner -->
        <div id="login-error-alert" class="hidden mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-shake">
          <i class="fa-solid fa-circle-exclamation text-red-500 text-sm"></i>
          <span id="login-error-text">Email/No. Anggota dan password wajib diisi.</span>
        </div>

        <!-- Login Form -->
        <form id="login-form" novalidate class="flex flex-col gap-4">
          
          <!-- Field: Email / No. Anggota -->
          <div class="form-group mb-0">
            <label for="login-identifier" class="form-label">
              <i class="fa-solid fa-id-card text-emerald-600"></i> Email / No. Anggota <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="login-identifier" 
              class="form-input" 
              placeholder="Contoh: admin atau PIM-2026-001" 
              autocomplete="username"
              required
            />
          </div>

          <!-- Field: Password with Eye Toggle -->
          <div class="form-group mb-0">
            <label for="login-password" class="form-label">
              <i class="fa-solid fa-lock text-emerald-600"></i> Password <span class="text-red-500">*</span>
            </label>
            <div class="password-input-wrap">
              <input 
                type="password" 
                id="login-password" 
                class="form-input pr-10" 
                placeholder="Masukkan password..." 
                autocomplete="current-password"
                required
              />
              <button type="button" id="toggle-pwd-btn" class="password-toggle-btn" aria-label="Lihat Password">
                <i class="fa-solid fa-eye" id="pwd-eye-icon"></i>
              </button>
            </div>
          </div>

          <!-- Password Info / Demo credentials hint -->
          <div class="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-100 text-[11px] text-emerald-800 flex items-center justify-between">
            <span><i class="fa-solid fa-lightbulb text-amber-500"></i> Demo Login: <strong>admin</strong> / <strong>1234</strong></span>
            <button type="button" id="btn-forgot-pwd" class="text-emerald-700 hover:underline font-semibold bg-transparent border-0 cursor-pointer">
              Lupa password?
            </button>
          </div>

          <!-- Submit Button -->
          <button type="submit" id="login-submit-btn" class="btn btn-primary py-3 text-sm font-bold w-full mt-2">
            <i class="fa-solid fa-right-to-bracket"></i> Masuk Sekarang
          </button>

        </form>

        <!-- Divider -->
        <div class="relative my-6 text-center">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200"></div></div>
          <span class="relative bg-white px-3 text-[11px] text-slate-400 font-medium uppercase">Atau</span>
        </div>

        <!-- Footer Links (Section M) -->
        <div class="flex flex-col gap-2.5 text-center text-xs">
          <p class="text-slate-600">
            Belum memiliki akun? 
            <a href="#/register" class="font-bold text-emerald-700 hover:underline">Daftar Akun Baru</a>
          </p>

          <a href="#/home" class="text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 py-1">
            <i class="fa-solid fa-arrow-left"></i> Kembali ke Koleksi Buku
          </a>
        </div>

      </div>

    </div>
  `;

  // Attach Password Toggle
  const pwdInput = document.getElementById('login-password');
  const toggleBtn = document.getElementById('toggle-pwd-btn');
  const eyeIcon = document.getElementById('pwd-eye-icon');

  if (toggleBtn && pwdInput && eyeIcon) {
    toggleBtn.addEventListener('click', () => {
      const isPwd = pwdInput.type === 'password';
      pwdInput.type = isPwd ? 'text' : 'password';
      eyeIcon.className = isPwd ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
    });
  }

  // Forgot password handler
  document.getElementById('btn-forgot-pwd')?.addEventListener('click', () => {
    showToast('Silakan hubungi pustakawan PIM untuk mereset password Anda.', 'info', 4000);
  });

  // Form Submit & Validation Logic
  const loginForm = document.getElementById('login-form');
  const errorAlert = document.getElementById('login-error-alert');
  const errorText = document.getElementById('login-error-text');
  const cardBox = document.getElementById('login-card-box');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      createRipple(e);

      const identifier = document.getElementById('login-identifier')?.value.trim();
      const password = document.getElementById('login-password')?.value;

      // Validation
      if (!identifier) {
        showError('Silakan masukkan Email atau No. Anggota.');
        return;
      }

      if (!password || password.length < 4) {
        showError('Password wajib diisi minimal 4 karakter.');
        return;
      }

      // Hide error
      if (errorAlert) errorAlert.classList.add('hidden');

      // Simulation check: admin / 1234 or any valid input
      let userData = null;
      if (identifier.toLowerCase() === 'admin') {
        userData = {
          name: 'Administrator PIM',
          role: 'Administrator',
          class: 'Pengelola Perpustakaan',
          memberNo: 'PIM-2026-ADM'
        };
      } else {
        userData = {
          name: identifier.includes('@') ? identifier.split('@')[0] : identifier,
          role: 'Anggota Utama',
          class: 'Kelas XI - PIM',
          memberNo: identifier.startsWith('PIM-') ? identifier : `PIM-2026-${Math.floor(100 + Math.random() * 900)}`
        };
      }

      // Save user session
      setUser(userData);
      showToast(`Selamat datang, ${userData.name}!`, 'success');

      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess();
      }

      window.location.hash = '#/home';
    });
  }

  function showError(msg) {
    if (errorAlert && errorText) {
      errorText.textContent = msg;
      errorAlert.classList.remove('hidden');
      if (cardBox) {
        cardBox.classList.remove('animate-shake');
        void cardBox.offsetWidth; // trigger reflow
        cardBox.classList.add('animate-shake');
      }
    }
  }
}
