/**
 * Modal Manager Component
 */
import { formatCoverUrl, isBookmarked, toggleBookmark, getUser, logoutUser, showToast, createRipple } from '../utils/helpers.js';

const modalContainer = () => document.getElementById('modal-container');

export function closeModal() {
  const container = modalContainer();
  if (container) {
    container.innerHTML = '';
  }
}

/**
 * Open Book Detail Modal
 */
export function openDetailModal(book, onBookmarkChange) {
  const container = modalContainer();
  if (!container || !book) return;

  const bookmarked = isBookmarked(book.id);
  const coverSrc = formatCoverUrl(book.cover, book.judul || book.nama);
  const pdfUrl = book.fileBerkas || '#';

  container.innerHTML = `
    <div class="modal-overlay" id="detail-modal-overlay">
      <div class="modal-content animate-scale-up" role="dialog" aria-modal="true">
        
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="flex items-center gap-2">
            <span class="badge-jenis text-xs py-0.5 px-2 bg-emerald-700 text-white font-semibold rounded-full">
              ${book.jenis || 'Buku'}
            </span>
            <h3 class="text-sm font-bold text-slate-800 line-clamp-1">${book.judul || book.nama || 'Detail Koleksi'}</h3>
          </div>
          <button id="modal-close-x" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer border-0 bg-transparent" aria-label="Tutup Detail">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <div class="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
            
            <!-- Cover Image (55% width mobile, max 180px, aspect 3/4) -->
            <div class="w-[55%] sm:w-44 flex-shrink-0 aspect-[3/4] max-w-[180px] rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100 flex items-center justify-center relative">
              <img src="${coverSrc}" alt="${book.judul || 'Cover'}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='${formatCoverUrl('', book.judul)}';" />
            </div>

            <!-- Book Info Details -->
            <div class="flex-1 flex flex-col gap-2.5 w-full text-slate-700 text-sm">
              <h2 class="text-base font-bold text-slate-900 leading-snug">${book.judul || 'Tanpa Judul'}</h2>
              
              <div class="flex flex-col gap-1.5 text-xs">
                <div class="flex items-baseline gap-2">
                  <span class="w-20 font-semibold text-slate-500 flex-shrink-0"><i class="fa-solid fa-user-pen text-emerald-600 w-4"></i> Penulis:</span>
                  <span class="font-medium text-slate-800">${book.nama || book.penulis || '-'}</span>
                </div>

                <div class="flex items-baseline gap-2">
                  <span class="w-20 font-semibold text-slate-500 flex-shrink-0"><i class="fa-solid fa-layer-group text-emerald-600 w-4"></i> Jenis:</span>
                  <span class="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-[11px]">${book.jenis || '-'}</span>
                </div>

                <div class="flex items-baseline gap-2">
                  <span class="w-20 font-semibold text-slate-500 flex-shrink-0"><i class="fa-solid fa-bookmark text-emerald-600 w-4"></i> Edisi:</span>
                  <span class="text-slate-700">${book.edisi || '-'}</span>
                </div>

                <div class="flex items-baseline gap-2">
                  <span class="w-20 font-semibold text-slate-500 flex-shrink-0"><i class="fa-solid fa-language text-emerald-600 w-4"></i> Bahasa:</span>
                  <span class="text-slate-700">${book.bahasa || 'Indonesia'}</span>
                </div>

                ${book.kataKunci ? `
                  <div class="mt-1 pt-2 border-t border-slate-100">
                    <span class="font-semibold text-slate-500 block mb-1 text-[11px]"><i class="fa-solid fa-tags text-emerald-600 w-4"></i> Kata Kunci:</span>
                    <div class="flex flex-wrap gap-1">
                      ${book.kataKunci.split(',').map(tag => `<span class="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">${tag.trim()}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>

            </div>

          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button id="modal-simpan-btn" class="btn ${bookmarked ? 'btn-accent' : 'btn-secondary'} text-xs py-2 px-3">
            <i class="fa-solid ${bookmarked ? 'fa-star' : 'fa-star-half-stroke'}"></i>
            <span>${bookmarked ? 'Tersimpan' : 'Simpan'}</span>
          </button>
          
          <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" id="modal-baca-btn" class="btn btn-primary text-xs py-2 px-4">
            <i class="fa-solid fa-book-open"></i> Baca Berkas
          </a>
        </div>

      </div>
    </div>
  `;

  // Overlay Close
  document.getElementById('detail-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'detail-modal-overlay') closeModal();
  });
  document.getElementById('modal-close-x').addEventListener('click', closeModal);

  // Bookmark button handler
  const simpanBtn = document.getElementById('modal-simpan-btn');
  if (simpanBtn) {
    simpanBtn.addEventListener('click', (e) => {
      createRipple(e);
      const isNowSaved = toggleBookmark(book.id);
      
      if (isNowSaved) {
        simpanBtn.className = 'btn btn-accent text-xs py-2 px-3';
        simpanBtn.innerHTML = '<i class="fa-solid fa-star"></i> <span>Tersimpan</span>';
        showToast('Buku berhasil disimpan ke favorit!', 'success');
      } else {
        simpanBtn.className = 'btn btn-secondary text-xs py-2 px-3';
        simpanBtn.innerHTML = '<i class="fa-regular fa-star"></i> <span>Simpan</span>';
        showToast('Buku dihapus dari favorit', 'info');
      }

      if (typeof onBookmarkChange === 'function') {
        onBookmarkChange(book.id, isNowSaved);
      }
    });
  }
}

/**
 * Open Filter Modal
 */
export function openFilterModal({
  currentJenis = 'Semua',
  currentBahasa = 'Semua',
  allJenis = [],
  allBahasa = [],
  onApplyFilter,
  onResetFilter
}) {
  const container = modalContainer();
  if (!container) return;

  const defaultJenisList = ['Semua', 'Buku', 'KTI', 'Kitab', 'Majalah', 'Modul', 'Skripsi', 'Tesis', 'Web'];
  const defaultBahasaList = ['Semua', 'Indonesia', 'Arab', 'Arab Pegon', 'Inggris'];

  // Merge lists while removing duplicates
  const jenisOptions = Array.from(new Set(['Semua', ...allJenis, ...defaultJenisList]));
  const bahasaOptions = Array.from(new Set(['Semua', ...allBahasa, ...defaultBahasaList]));

  let tempJenis = currentJenis;
  let tempBahasa = currentBahasa;

  container.innerHTML = `
    <div class="modal-overlay" id="filter-modal-overlay">
      <div class="modal-content animate-scale-up" role="dialog" aria-modal="true">
        
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <i class="fa-solid fa-filter text-amber-500"></i> Filter Koleksi
          </div>
          <button id="filter-close-x" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors border-0 bg-transparent cursor-pointer">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body flex flex-col gap-5">
          
          <!-- Jenis / Kategori Section -->
          <div>
            <label class="form-label font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <i class="fa-solid fa-layer-group text-emerald-600"></i> Jenis / Kategori
            </label>
            <div class="flex flex-wrap gap-2" id="jenis-chips-wrap">
              ${jenisOptions.map(option => `
                <button type="button" class="chip ${option === tempJenis ? 'active' : ''}" data-jenis="${option}">
                  ${option}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Bahasa Section -->
          <div class="pt-3 border-t border-slate-100">
            <label class="form-label font-bold text-slate-800 mb-2 flex items-center gap-1.5">
              <i class="fa-solid fa-globe text-emerald-600"></i> Bahasa
            </label>
            <div class="flex flex-wrap gap-2" id="bahasa-chips-wrap">
              ${bahasaOptions.map(option => `
                <button type="button" class="chip ${option === tempBahasa ? 'active' : ''}" data-bahasa="${option}">
                  ${option}
                </button>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="modal-footer justify-between">
          <button id="filter-reset-btn" class="btn btn-secondary text-xs">
            <i id="reset-icon" class="fa-solid fa-arrows-rotate"></i> Reset Filter
          </button>
          
          <button id="filter-apply-btn" class="btn btn-primary text-xs">
            <i class="fa-solid fa-check"></i> Terapkan Filter
          </button>
        </div>

      </div>
    </div>
  `;

  // Overlay close
  document.getElementById('filter-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'filter-modal-overlay') closeModal();
  });
  document.getElementById('filter-close-x').addEventListener('click', closeModal);

  // Chip click delegation for Jenis
  const jenisChipsWrap = document.getElementById('jenis-chips-wrap');
  if (jenisChipsWrap) {
    jenisChipsWrap.addEventListener('click', (e) => {
      const target = e.target.closest('.chip');
      if (!target) return;
      tempJenis = target.getAttribute('data-jenis');
      jenisChipsWrap.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      target.classList.add('active');
    });
  }

  // Chip click delegation for Bahasa
  const bahasaChipsWrap = document.getElementById('bahasa-chips-wrap');
  if (bahasaChipsWrap) {
    bahasaChipsWrap.addEventListener('click', (e) => {
      const target = e.target.closest('.chip');
      if (!target) return;
      tempBahasa = target.getAttribute('data-bahasa');
      bahasaChipsWrap.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      target.classList.add('active');
    });
  }

  // Reset button with spinning icon animation
  const resetBtn = document.getElementById('filter-reset-btn');
  const resetIcon = document.getElementById('reset-icon');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (resetIcon) resetIcon.classList.add('fa-spin');
      tempJenis = 'Semua';
      tempBahasa = 'Semua';

      jenisChipsWrap.querySelectorAll('.chip').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-jenis') === 'Semua');
      });
      bahasaChipsWrap.querySelectorAll('.chip').forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-bahasa') === 'Semua');
      });

      setTimeout(() => {
        if (resetIcon) resetIcon.classList.remove('fa-spin');
        if (typeof onResetFilter === 'function') onResetFilter();
        closeModal();
      }, 350);
    });
  }

  // Apply button
  const applyBtn = document.getElementById('filter-apply-btn');
  if (applyBtn) {
    applyBtn.addEventListener('click', (e) => {
      createRipple(e);
      if (typeof onApplyFilter === 'function') {
        onApplyFilter(tempJenis, tempBahasa);
      }
      closeModal();
    });
  }
}

/**
 * Open Profile Modal
 */
export function openProfileModal(onLogout) {
  const container = modalContainer();
  if (!container) return;

  const user = getUser() || { name: 'Tamu', role: 'Anggota', class: 'Kelas X - PIM', memberNo: 'PIM-2026-000' };

  container.innerHTML = `
    <div class="modal-overlay" id="profile-modal-overlay">
      <div class="modal-content animate-scale-up" role="dialog" aria-modal="true">
        
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <i class="fa-solid fa-id-card text-emerald-600"></i> Profil Anggota
          </div>
          <button id="profile-close-x" class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors border-0 bg-transparent cursor-pointer">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body flex flex-col items-center py-6 text-center">
          
          <!-- Large Avatar Icon -->
          <div class="w-20 h-20 rounded-full bg-emerald-700 text-amber-300 flex items-center justify-center font-bold text-3xl shadow-lg border-4 border-amber-200 mb-4">
            <i class="fa-solid fa-user-graduate"></i>
          </div>

          <h2 class="text-lg font-bold text-slate-900 mb-1">${user.name || 'Nama Anggota'}</h2>
          <span class="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs mb-5">
            ${user.role || 'Anggota Utama'}
          </span>

          <div class="w-full bg-slate-50 rounded-xl p-4 border border-slate-200 text-left text-xs flex flex-col gap-2.5">
            <div class="flex justify-between items-center py-1 border-b border-slate-200">
              <span class="text-slate-500 font-medium"><i class="fa-solid fa-hashtag text-emerald-600 w-4"></i> No. Anggota:</span>
              <span class="font-bold text-slate-800">${user.memberNo || 'PIM-2026-001'}</span>
            </div>

            <div class="flex justify-between items-center py-1 border-b border-slate-200">
              <span class="text-slate-500 font-medium"><i class="fa-solid fa-chalkboard-user text-emerald-600 w-4"></i> Kelas / Instansi:</span>
              <span class="font-bold text-slate-800">${user.class || 'Kelas XI - PIM'}</span>
            </div>

            <div class="flex justify-between items-center py-1">
              <span class="text-slate-500 font-medium"><i class="fa-solid fa-circle-check text-emerald-600 w-4"></i> Status Akun:</span>
              <span class="font-bold text-emerald-600">Aktif & Terverifikasi</span>
            </div>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="modal-footer justify-between">
          <button id="profile-close-btn" class="btn btn-secondary text-xs">
            Tutup
          </button>
          
          <button id="profile-logout-btn" class="btn btn-accent text-xs">
            <i class="fa-solid fa-right-from-bracket"></i> Keluar
          </button>
        </div>

      </div>
    </div>
  `;

  // Close handlers
  document.getElementById('profile-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'profile-modal-overlay') closeModal();
  });
  document.getElementById('profile-close-x').addEventListener('click', closeModal);
  document.getElementById('profile-close-btn').addEventListener('click', closeModal);

  // Logout button
  document.getElementById('profile-logout-btn').addEventListener('click', () => {
    logoutUser();
    showToast('Anda telah keluar dari akun', 'info');
    closeModal();
    if (typeof onLogout === 'function') onLogout();
  });
}
