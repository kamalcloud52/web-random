/**
 * Profile Page Component
 */
import { getUser, logoutUser, isLoggedIn, showToast } from '../utils/helpers.js';

export function renderProfilePage(appContainer, onLogoutSuccess) {
  if (!appContainer) return;

  if (!isLoggedIn()) {
    // If guest accesses #/profil, redirect to login
    window.location.hash = '#/login';
    return;
  }

  const user = getUser() || { name: 'Anggota PIM', role: 'Anggota Utama', class: 'Kelas XI - PIM', memberNo: 'PIM-2026-001' };

  appContainer.innerHTML = `
    <div class="max-w-xl mx-auto py-6 sm:py-10 animate-fade-in">
      <div class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl flex flex-col items-center text-center">
        
        <!-- Large Avatar Icon -->
        <div class="w-24 h-24 rounded-full bg-emerald-700 text-amber-300 flex items-center justify-center font-bold text-4xl shadow-lg border-4 border-amber-200 mb-4">
          <i class="fa-solid fa-user-graduate"></i>
        </div>

        <h1 class="text-2xl font-bold text-slate-900 mb-1">${user.name}</h1>
        <span class="inline-block px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs mb-6">
          ${user.role}
        </span>

        <!-- Info List -->
        <div class="w-full bg-slate-50 rounded-xl p-5 border border-slate-200 text-left text-sm flex flex-col gap-3 mb-6">
          <div class="flex justify-between items-center py-1.5 border-b border-slate-200">
            <span class="text-slate-500 font-medium"><i class="fa-solid fa-hashtag text-emerald-600 w-5"></i> No. Anggota:</span>
            <span class="font-bold text-slate-800">${user.memberNo}</span>
          </div>

          <div class="flex justify-between items-center py-1.5 border-b border-slate-200">
            <span class="text-slate-500 font-medium"><i class="fa-solid fa-chalkboard-user text-emerald-600 w-5"></i> Kelas / Instansi:</span>
            <span class="font-bold text-slate-800">${user.class}</span>
          </div>

          <div class="flex justify-between items-center py-1.5 border-b border-slate-200">
            <span class="text-slate-500 font-medium"><i class="fa-solid fa-clock-rotate-left text-emerald-600 w-5"></i> Status Perpustakaan:</span>
            <span class="font-bold text-emerald-600"><i class="fa-solid fa-check-circle"></i> Bebas Pustaka</span>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex items-center justify-between gap-4 w-full">
          <a href="#/home" class="btn btn-secondary text-xs py-2.5 px-4 flex-1">
            <i class="fa-solid fa-arrow-left"></i> Beranda
          </a>

          <button id="page-logout-btn" class="btn btn-accent text-xs py-2.5 px-4 flex-1">
            <i class="fa-solid fa-right-from-bracket"></i> Keluar
          </button>
        </div>

      </div>
    </div>
  `;

  document.getElementById('page-logout-btn')?.addEventListener('click', () => {
    logoutUser();
    showToast('Anda telah keluar dari sistem.', 'info');
    if (typeof onLogoutSuccess === 'function') onLogoutSuccess();
    window.location.hash = '#/login';
  });
}
