/**
 * Register Page Component
 */
import { showToast, createRipple } from '../utils/helpers.js';

export function renderRegisterPage(appContainer) {
  if (!appContainer) return;

  appContainer.innerHTML = `
    <div class="max-w-md mx-auto py-6 sm:py-10 animate-fade-in">
      
      <!-- Register Card -->
      <div id="register-card-box" class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        <!-- Top Green Accent Line -->
        <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 to-emerald-800"></div>

        <!-- Header -->
        <div class="flex flex-col items-center text-center mb-6">
          <img src="../icon.jpg" alt="Logo PIM" class="w-16 h-16 rounded-full border-2 border-amber-300 shadow-md mb-2 object-cover" onerror="this.src='/icon.jpg'" />
          <h1 class="text-xl font-bold text-slate-800">Pendaftaran Anggota PIM</h1>
          <p class="text-xs text-slate-500 mt-1">Buat akun untuk menikmati koleksi digital terlengkap</p>
        </div>

        <!-- Error Alert -->
        <div id="register-error-alert" class="hidden mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-shake">
          <i class="fa-solid fa-circle-exclamation text-red-500 text-sm"></i>
          <span id="register-error-text">Mohon lengkapi seluruh field dengan benar.</span>
        </div>

        <!-- Register Form -->
        <form id="register-form" novalidate class="flex flex-col gap-3.5">
          
          <!-- Nama Lengkap -->
          <div class="form-group mb-0">
            <label for="reg-fullname" class="form-label">
              <i class="fa-solid fa-user text-emerald-600"></i> Nama Lengkap <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="reg-fullname" 
              class="form-input" 
              placeholder="Masukkan nama lengkap..." 
              required
            />
          </div>

          <!-- Email / No. Anggota -->
          <div class="form-group mb-0">
            <label for="reg-identifier" class="form-label">
              <i class="fa-solid fa-id-card text-emerald-600"></i> Email / No. Anggota <span class="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              id="reg-identifier" 
              class="form-input" 
              placeholder="Contoh: santri@pim.ac.id atau PIM-2026-005" 
              required
            />
          </div>

          <!-- Password Field with Toggle -->
          <div class="form-group mb-0">
            <label for="reg-password" class="form-label">
              <i class="fa-solid fa-lock text-emerald-600"></i> Password <span class="text-red-500">*</span>
            </label>
            <div class="password-input-wrap">
              <input 
                type="password" 
                id="reg-password" 
                class="form-input pr-10" 
                placeholder="Minimal 4 karakter..." 
                required
              />
              <button type="button" id="toggle-reg-pwd1" class="password-toggle-btn" aria-label="Lihat Password">
                <i class="fa-solid fa-eye" id="eye-icon-pwd1"></i>
              </button>
            </div>
          </div>

          <!-- Confirm Password Field with Toggle -->
          <div class="form-group mb-0">
            <label for="reg-confirm-password" class="form-label">
              <i class="fa-solid fa-key text-emerald-600"></i> Konfirmasi Password <span class="text-red-500">*</span>
            </label>
            <div class="password-input-wrap">
              <input 
                type="password" 
                id="reg-confirm-password" 
                class="form-input pr-10" 
                placeholder="Ulangi password..." 
                required
              />
              <button type="button" id="toggle-reg-pwd2" class="password-toggle-btn" aria-label="Lihat Konfirmasi Password">
                <i class="fa-solid fa-eye" id="eye-icon-pwd2"></i>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" id="reg-submit-btn" class="btn btn-primary py-3 text-sm font-bold w-full mt-2">
            <i class="fa-solid fa-user-plus"></i> Daftar Akun Baru
          </button>

        </form>

        <!-- Divider -->
        <div class="relative my-5 text-center">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200"></div></div>
          <span class="relative bg-white px-3 text-[11px] text-slate-400 font-medium uppercase">Atau</span>
        </div>

        <!-- Footer Links -->
        <div class="flex flex-col gap-2 text-center text-xs">
          <p class="text-slate-600">
            Sudah memiliki akun? 
            <a href="#/login" class="font-bold text-emerald-700 hover:underline">Masuk Sekarang</a>
          </p>

          <a href="#/home" class="text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 py-1">
            <i class="fa-solid fa-arrow-left"></i> Kembali ke Koleksi Buku
          </a>
        </div>

      </div>

    </div>
  `;

  // Attach Password Toggles
  setupEyeToggle('reg-password', 'toggle-reg-pwd1', 'eye-icon-pwd1');
  setupEyeToggle('reg-confirm-password', 'toggle-reg-pwd2', 'eye-icon-pwd2');

  function setupEyeToggle(inputId, btnId, eyeId) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    const eye = document.getElementById(eyeId);

    if (input && btn && eye) {
      btn.addEventListener('click', () => {
        const isPwd = input.type === 'password';
        input.type = isPwd ? 'text' : 'password';
        eye.className = isPwd ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
      });
    }
  }

  // Form Validation & Registration
  const regForm = document.getElementById('register-form');
  const errorAlert = document.getElementById('register-error-alert');
  const errorText = document.getElementById('register-error-text');
  const cardBox = document.getElementById('register-card-box');

  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      createRipple(e);

      const fullname = document.getElementById('reg-fullname')?.value.trim();
      const identifier = document.getElementById('reg-identifier')?.value.trim();
      const password = document.getElementById('reg-password')?.value;
      const confirmPassword = document.getElementById('reg-confirm-password')?.value;

      // Validation
      if (!fullname || fullname.length < 3) {
        showError('Nama lengkap wajib diisi minimal 3 karakter.');
        return;
      }

      if (!identifier) {
        showError('Email atau No. Anggota wajib diisi.');
        return;
      }

      if (!password || password.length < 4) {
        showError('Password wajib diisi minimal 4 karakter.');
        return;
      }

      if (password !== confirmPassword) {
        showError('Konfirmasi password tidak cocok dengan password.');
        return;
      }

      if (errorAlert) errorAlert.classList.add('hidden');

      // Success Simulation
      showToast('Pendaftaran berhasil! Mengarahkan ke halaman masuk...', 'success', 2500);

      setTimeout(() => {
        window.location.hash = '#/login';
      }, 1200);
    });
  }

  function showError(msg) {
    if (errorAlert && errorText) {
      errorText.textContent = msg;
      errorAlert.classList.remove('hidden');
      if (cardBox) {
        cardBox.classList.remove('animate-shake');
        void cardBox.offsetWidth;
        cardBox.classList.add('animate-shake');
      }
    }
  }
}
