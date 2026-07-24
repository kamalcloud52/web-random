/**
 * Header Component
 */
import { getUser, isLoggedIn, createRipple } from '../utils/helpers.js';

export function renderHeader(onOpenProfile, onOpenLogin) {
  const container = document.getElementById('header-container');
  if (!container) return;

  const currentUser = getUser();
  const userName = currentUser ? (currentUser.name || 'Pengguna') : 'Tamu';
  const userRole = currentUser ? (currentUser.role || 'Anggota') : 'Pengunjung';

  container.innerHTML = `
    <nav class="header-glass text-white py-3 px-4 sm:px-6 lg:px-8 transition-all">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        
        <!-- Left: User Avatar & Name -->
        <button id="user-profile-btn" class="flex items-center gap-3 bg-white/10 hover:bg-white/20 active:bg-white/25 px-3 py-1.5 rounded-full transition-all text-left group cursor-pointer border border-white/10">
          <div class="w-8 h-8 rounded-full bg-amber-300 text-emerald-900 flex items-center justify-center font-semibold shadow-inner group-hover:scale-105 transition-transform">
            <i class="fa-solid ${isLoggedIn() ? 'fa-user' : 'fa-user-secret'} text-sm"></i>
          </div>
          <div class="flex flex-col pr-1">
            <span class="text-xs font-semibold leading-tight text-amber-200 group-hover:text-amber-100 flex items-center gap-1">
              ${userName}
              <i class="fa-solid fa-chevron-down text-[10px] opacity-70"></i>
            </span>
            <span class="text-[10px] text-emerald-100 opacity-80 leading-tight">${userRole}</span>
          </div>
        </button>

        <!-- Brand Title (Center - Desktop) -->
        <a href="#/home" class="hidden sm:flex items-center gap-2 text-white text-lg font-bold tracking-wide hover:opacity-90 transition-opacity">
          <img src="../icon.jpg" alt="Logo PIM" class="w-7 h-7 rounded-full bg-white p-0.5 object-cover shadow-sm" onerror="this.src='/icon.jpg'" />
          <span>Perpustakaan Digital PIM</span>
        </a>

        <!-- Desktop Navigation Menu -->
        <div class="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#/home" class="nav-link hover:text-amber-300 transition-colors py-1 flex items-center gap-1.5 active-nav">
            <i class="fa-solid fa-book-open text-xs"></i> Beranda
          </a>
          <a href="#/home" class="nav-link hover:text-amber-300 transition-colors py-1 flex items-center gap-1.5">
            <i class="fa-solid fa-layer-group text-xs"></i> Koleksi Buku
          </a>
          <button id="btn-media-pim" class="hover:text-amber-300 transition-colors py-1 flex items-center gap-1.5 bg-transparent border-0 text-white cursor-pointer font-medium font-poppins">
            <i class="fa-solid fa-photo-film text-xs"></i> Media PIM
          </button>
          <button id="btn-arsip-foto" class="hover:text-amber-300 transition-colors py-1 flex items-center gap-1.5 bg-transparent border-0 text-white cursor-pointer font-medium font-poppins">
            <i class="fa-solid fa-images text-xs"></i> Arsip Foto
          </button>
        </div>

        <!-- Right: Mobile Hamburger Icon -->
        <button id="mobile-menu-toggle" class="md:hidden p-2 rounded-lg text-white hover:bg-white/10 active:bg-white/20 transition-colors text-lg cursor-pointer border-0 bg-transparent" aria-label="Toggle Navigation Menu">
          <i class="fa-solid fa-bars"></i>
        </button>

      </div>
    </nav>

    <!-- Mobile Slide Drawer Menu -->
    <div id="mobile-drawer" class="fixed inset-0 z-50 hidden">
      <!-- Overlay Backdrop -->
      <div id="drawer-overlay" class="mobile-menu-overlay absolute inset-0 cursor-pointer"></div>
      
      <!-- Slide Panel -->
      <div class="mobile-menu-panel relative w-72 max-w-[80vw] h-full shadow-2xl flex flex-col p-6 text-slate-800 z-10">
        
        <!-- Drawer Header -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <img src="../icon.jpg" alt="PIM Logo" class="w-8 h-8 rounded-full border border-emerald-600" onerror="this.src='/icon.jpg'" />
            <span class="font-bold text-emerald-800 text-sm">PIM Digital Library</span>
          </div>
          <button id="drawer-close" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Drawer User Card -->
        <div class="my-5 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-emerald-700 text-amber-300 flex items-center justify-center font-bold text-lg">
            <i class="fa-solid ${isLoggedIn() ? 'fa-user' : 'fa-user-secret'}"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-bold text-slate-800">${userName}</span>
            <span class="text-[11px] text-emerald-700">${userRole}</span>
          </div>
        </div>

        <!-- Mobile Navigation Links with Staggered Animation -->
        <div class="flex flex-col gap-2 my-2 text-sm">
          <a href="#/home" class="mobile-nav-item flex items-center gap-3 p-2.5 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-all stagger-1">
            <i class="fa-solid fa-house w-5 text-emerald-600"></i> Beranda
          </a>
          <a href="#/home" class="mobile-nav-item flex items-center gap-3 p-2.5 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-all stagger-2">
            <i class="fa-solid fa-book w-5 text-emerald-600"></i> Koleksi Buku
          </a>
          <button id="mobile-btn-media" class="mobile-nav-item flex items-center gap-3 p-2.5 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-all stagger-3 bg-transparent border-0 text-left w-full font-poppins">
            <i class="fa-solid fa-photo-film w-5 text-emerald-600"></i> Media PIM
          </button>
          <button id="mobile-btn-arsip" class="mobile-nav-item flex items-center gap-3 p-2.5 rounded-lg text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-all stagger-4 bg-transparent border-0 text-left w-full font-poppins">
            <i class="fa-solid fa-images w-5 text-emerald-600"></i> Arsip Foto
          </button>
        </div>

        <!-- Bottom Actions -->
        <div class="mt-auto pt-4 border-t border-slate-200 flex flex-col gap-2">
          ${isLoggedIn() ? `
            <button id="drawer-profil-btn" class="w-full btn btn-primary py-2 text-xs">
              <i class="fa-solid fa-id-card"></i> Lihat Profil Saya
            </button>
          ` : `
            <a href="#/login" class="w-full btn btn-primary py-2 text-xs">
              <i class="fa-solid fa-right-to-bracket"></i> Masuk / Akun
            </a>
          `}
        </div>

      </div>
    </div>
  `;

  // Attach Header Event Listeners
  const userProfileBtn = document.getElementById('user-profile-btn');
  if (userProfileBtn) {
    userProfileBtn.addEventListener('click', (e) => {
      createRipple(e);
      if (isLoggedIn()) {
        if (typeof onOpenProfile === 'function') onOpenProfile();
      } else {
        window.location.hash = '#/login';
      }
    });
  }

  // Drawer Toggle Logic
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const drawerClose = document.getElementById('drawer-close');

  const openDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.remove('hidden');
  };

  const closeDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.add('hidden');
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

  // Close drawer on link click
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  mobileNavItems.forEach(item => {
    item.addEventListener('click', closeDrawer);
  });

  const drawerProfilBtn = document.getElementById('drawer-profil-btn');
  if (drawerProfilBtn) {
    drawerProfilBtn.addEventListener('click', () => {
      closeDrawer();
      if (typeof onOpenProfile === 'function') onOpenProfile();
    });
  }

  // Media PIM / Arsip Foto informational toasts
  const toastMedia = () => import('../utils/helpers.js').then(m => m.showToast('Fitur Media PIM dapat diakses langsung melalui galeri digital.', 'info'));
  const toastArsip = () => import('../utils/helpers.js').then(m => m.showToast('Arsip Foto Perpustakaan PIM diperbarui secara berkala.', 'info'));

  document.getElementById('btn-media-pim')?.addEventListener('click', toastMedia);
  document.getElementById('btn-arsip-foto')?.addEventListener('click', toastArsip);
  document.getElementById('mobile-btn-media')?.addEventListener('click', () => { closeDrawer(); toastMedia(); });
  document.getElementById('mobile-btn-arsip')?.addEventListener('click', () => { closeDrawer(); toastArsip(); });
}
