/**
 * Home Page View Component (Digital Book Collection)
 */
import { fetchBooks } from '../api/books.js';
import { openDetailModal, openFilterModal } from '../components/modal.js';
import { debounce, animateCounter, formatCoverUrl, isBookmarked, createRipple, showToast } from '../utils/helpers.js';

export function renderHomePage(appContainer) {
  if (!appContainer) return;

  // Page State
  let state = {
    search: '',
    jenis: 'Semua',
    bahasa: 'Semua',
    page: 1,
    limit: 12,
    viewMode: 'grid', // 'grid' | 'list'
    loading: true,
    books: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
    allJenis: ['Buku', 'KTI', 'Kitab', 'Majalah', 'Modul', 'Skripsi', 'Tesis', 'Web'],
    allBahasa: ['Indonesia', 'Arab', 'Arab Pegon', 'Inggris'],
    initialLoadCompleted: false
  };

  // Initial Shell Layout Setup
  appContainer.innerHTML = `
    <div class="flex flex-col gap-6 animate-fade-in">
      
      <!-- Welcome Card Banner (Section B) -->
      <section class="welcome-card p-6 sm:p-8 animate-slide-up stagger-1">
        <div class="max-w-2xl relative z-10 flex flex-col gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-300 text-emerald-950 font-bold text-xs w-fit shadow-sm">
            <i class="fa-solid fa-sparkles"></i> Perpustakaan Digital PIM
          </span>
          <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Halo, Pembaca Hebat!</h1>
          <p class="text-emerald-100 text-sm sm:text-base leading-relaxed opacity-95">
            Selamat Datang di Perpustakaan Digital PIM. Temukan ribuan koleksi buku, kitab, modul, dan karya ilmiah digital secara gratis.
          </p>
        </div>
      </section>

      <!-- Stats Counters Section (Section C) -->
      <section class="grid grid-cols-2 gap-3 sm:gap-4 animate-slide-up stagger-2">
        <div class="stat-card flex items-center gap-3 sm:gap-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
            <i class="fa-solid fa-book-bookmark"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-slate-500 font-medium">Total Koleksi</span>
            <span id="stat-total-books" class="text-xl sm:text-2xl font-extrabold text-slate-800">0</span>
          </div>
        </div>

        <div class="stat-card flex items-center gap-3 sm:gap-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
            <i class="fa-solid fa-layer-group"></i>
          </div>
          <div class="flex flex-col">
            <span class="text-xs text-slate-500 font-medium">Kategori / Jenis</span>
            <span id="stat-total-jenis" class="text-xl sm:text-2xl font-extrabold text-slate-800">0</span>
          </div>
        </div>
      </section>

      <!-- Search & Filter Controls Section (Section D & E) -->
      <section class="flex flex-col md:flex-row items-center gap-3 animate-slide-up stagger-3">
        
        <!-- Search Input with Clear Button -->
        <div class="search-container flex-1">
          <i class="fa-solid fa-magnifying-glass search-icon-left"></i>
          <input 
            type="text" 
            id="search-input" 
            class="search-input" 
            placeholder="Cari judul, penulis, edisi, atau kata kunci..."
            value="${state.search}"
          />
          <button id="search-clear-btn" class="search-clear-btn ${state.search ? '' : 'hidden'}" aria-label="Bersihkan pencarian">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Filter Trigger Button & Filter Badges -->
        <div class="flex items-center gap-2 w-full md:w-auto">
          <button id="btn-open-filter" class="btn btn-primary text-xs py-2.5 px-4 flex-1 md:flex-none">
            <i class="fa-solid fa-filter"></i> Filter
            <span id="filter-active-count" class="bg-amber-300 text-emerald-950 px-1.5 py-0.2 rounded-full font-bold text-[10px] hidden">0</span>
          </button>

          <!-- Active Filter Badge Clear Button -->
          <button id="btn-clear-active-filter" class="btn btn-secondary text-xs py-2.5 px-3 hidden" title="Reset Filter">
            <i class="fa-solid fa-rotate-left"></i>
          </button>
        </div>

      </section>

      <!-- Display Controls Section (Section F: Limit & View Toggle) -->
      <section class="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 animate-slide-up stagger-4">
        
        <!-- Limit Dropdown -->
        <div class="flex items-center gap-2 text-xs font-medium text-slate-600">
          <span>Tampilkan:</span>
          <select id="limit-select" class="bg-white border border-slate-300 rounded-lg text-xs py-1.5 px-2.5 outline-none focus:border-emerald-600 font-poppins">
            <option value="12" ${state.limit == 12 ? 'selected' : ''}>12 per halaman</option>
            <option value="24" ${state.limit == 24 ? 'selected' : ''}>24 per halaman</option>
            <option value="48" ${state.limit == 48 ? 'selected' : ''}>48 per halaman</option>
            <option value="96" ${state.limit == 96 ? 'selected' : ''}>96 per halaman</option>
            <option value="Semua" ${state.limit === 'Semua' ? 'selected' : ''}>Semua Data</option>
          </select>
        </div>

        <!-- View Mode Toggle: Grid vs List -->
        <div class="flex items-center gap-1 bg-slate-200/70 p-1 rounded-lg">
          <button id="view-grid-btn" class="p-1.5 px-2.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${state.viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <i class="fa-solid fa-border-all"></i> Grid
          </button>
          <button id="view-list-btn" class="p-1.5 px-2.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${state.viewMode === 'list' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <i class="fa-solid fa-list-ul"></i> List
          </button>
        </div>

      </section>

      <!-- Main Books Collection Container -->
      <section id="books-content-area" class="min-h-[300px] flex flex-col justify-center">
        <!-- Dynamic Book Cards or Loading / Empty States -->
      </section>

      <!-- Pagination Section (Section I) -->
      <section id="pagination-container" class="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-600">
        <!-- Rendered dynamically -->
      </section>

    </div>
  `;

  // Attach Input & Control Listeners
  const searchInput = document.getElementById('search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const limitSelect = document.getElementById('limit-select');
  const viewGridBtn = document.getElementById('view-grid-btn');
  const viewListBtn = document.getElementById('view-list-btn');
  const openFilterBtn = document.getElementById('btn-open-filter');
  const clearActiveFilterBtn = document.getElementById('btn-clear-active-filter');

  // Debounced Search Handler (500ms)
  const handleSearch = debounce((val) => {
    state.search = val.trim();
    state.page = 1;
    loadCollectionData();
  }, 500);

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.classList.toggle('hidden', !val);
      }
      handleSearch(val);
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchClearBtn.classList.add('hidden');
      state.search = '';
      state.page = 1;
      loadCollectionData();
    });
  }

  // Limit Select Handler
  if (limitSelect) {
    limitSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      state.limit = val === 'Semua' ? 'Semua' : parseInt(val, 10);
      state.page = 1;
      loadCollectionData();
    });
  }

  // View Mode Handlers
  if (viewGridBtn) {
    viewGridBtn.addEventListener('click', () => {
      if (state.viewMode !== 'grid') {
        state.viewMode = 'grid';
        updateViewModeButtons();
        renderBooksList();
      }
    });
  }

  if (viewListBtn) {
    viewListBtn.addEventListener('click', () => {
      if (state.viewMode !== 'list') {
        state.viewMode = 'list';
        updateViewModeButtons();
        renderBooksList();
      }
    });
  }

  function updateViewModeButtons() {
    if (viewGridBtn && viewListBtn) {
      viewGridBtn.className = `p-1.5 px-2.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${state.viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`;
      viewListBtn.className = `p-1.5 px-2.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${state.viewMode === 'list' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`;
    }
  }

  // Filter Modal Trigger
  if (openFilterBtn) {
    openFilterBtn.addEventListener('click', () => {
      openFilterModal({
        currentJenis: state.jenis,
        currentBahasa: state.bahasa,
        allJenis: state.allJenis,
        allBahasa: state.allBahasa,
        onApplyFilter: (jenis, bahasa) => {
          state.jenis = jenis;
          state.bahasa = bahasa;
          state.page = 1;
          updateFilterBadges();
          loadCollectionData('Menerapkan filter...');
        },
        onResetFilter: () => {
          state.jenis = 'Semua';
          state.bahasa = 'Semua';
          state.page = 1;
          updateFilterBadges();
          loadCollectionData('Menerapkan filter...');
        }
      });
    });
  }

  if (clearActiveFilterBtn) {
    clearActiveFilterBtn.addEventListener('click', () => {
      state.jenis = 'Semua';
      state.bahasa = 'Semua';
      state.page = 1;
      updateFilterBadges();
      loadCollectionData();
    });
  }

  function updateFilterBadges() {
    let activeCount = 0;
    if (state.jenis !== 'Semua') activeCount++;
    if (state.bahasa !== 'Semua') activeCount++;

    const activeCountSpan = document.getElementById('filter-active-count');
    if (activeCountSpan) {
      if (activeCount > 0) {
        activeCountSpan.textContent = activeCount;
        activeCountSpan.classList.remove('hidden');
      } else {
        activeCountSpan.classList.add('hidden');
      }
    }

    if (clearActiveFilterBtn) {
      clearActiveFilterBtn.classList.toggle('hidden', activeCount === 0);
    }
  }

  // Core Data Fetcher Function
  async function loadCollectionData(loadingText = 'Memuat koleksi...') {
    state.loading = true;
    renderLoadingState(loadingText);

    try {
      const response = await fetchBooks({
        search: state.search,
        jenis: state.jenis,
        bahasa: state.bahasa,
        page: state.page,
        limit: state.limit
      });

      state.books = response.data || [];
      state.allJenis = response.allJenis || state.allJenis;
      state.allBahasa = response.allBahasa || state.allBahasa;
      state.total = response.total || state.books.length;
      state.totalPages = response.totalPages || 1;
      state.currentPage = response.currentPage || state.page;
      state.loading = false;

      // Update counters if initial
      const statTotalBooks = document.getElementById('stat-total-books');
      const statTotalJenis = document.getElementById('stat-total-jenis');
      if (statTotalBooks) animateCounter(statTotalBooks, state.total, 800);
      if (statTotalJenis) animateCounter(statTotalJenis, state.allJenis.length, 800);

      renderBooksList();
      renderPaginationControls();
    } catch (err) {
      console.error('Failed to load books:', err);
      state.loading = false;
      renderErrorState();
    }
  }

  // Render Loading Spinner State (Section O)
  function renderLoadingState(msg = 'Memuat koleksi...') {
    const contentArea = document.getElementById('books-content-area');
    if (!contentArea) return;

    contentArea.innerHTML = `
      <div class="py-16 flex flex-col items-center justify-center text-center gap-3">
        <div class="w-12 h-12 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin-custom"></div>
        <p class="text-sm font-semibold text-slate-600 animate-pulse">${msg}</p>
      </div>
    `;
    
    const paginationContainer = document.getElementById('pagination-container');
    if (paginationContainer) paginationContainer.innerHTML = '';
  }

  // Render Error State
  function renderErrorState() {
    const contentArea = document.getElementById('books-content-area');
    if (!contentArea) return;

    contentArea.innerHTML = `
      <div class="py-12 px-4 flex flex-col items-center justify-center text-center gap-3 bg-red-50/50 rounded-2xl border border-red-100">
        <i class="fa-solid fa-triangle-exclamation text-3xl text-red-500"></i>
        <h3 class="font-bold text-slate-800 text-base">Gagal Mengambil Data Koleksi</h3>
        <p class="text-xs text-slate-600 max-w-md">Terjadi kendala jaringan saat terhubung ke server perpustakaan. Silakan coba lagi.</p>
        <button id="retry-fetch-btn" class="btn btn-primary text-xs py-2 px-4 mt-2">
          <i class="fa-solid fa-rotate-right"></i> Coba Lagi
        </button>
      </div>
    `;

    document.getElementById('retry-fetch-btn')?.addEventListener('click', () => {
      loadCollectionData();
    });
  }

  // Render Books Cards Grid or List
  function renderBooksList() {
    const contentArea = document.getElementById('books-content-area');
    if (!contentArea) return;

    if (!state.books || state.books.length === 0) {
      // Empty State (Section O)
      contentArea.innerHTML = `
        <div class="py-16 px-4 flex flex-col items-center justify-center text-center gap-3 bg-white rounded-2xl border border-dashed border-slate-300 my-4">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-2xl">
            <i class="fa-solid fa-book-open text-slate-400"></i>
          </div>
          <h3 class="font-bold text-slate-800 text-base">Tidak ada koleksi ditemukan</h3>
          <p class="text-xs text-slate-500 max-w-sm">
            Coba ubah kata kunci pencarian atau sesuaikan opsi filter jenis dan bahasa.
          </p>
          ${state.search || state.jenis !== 'Semua' || state.bahasa !== 'Semua' ? `
            <button id="btn-reset-empty" class="btn btn-secondary text-xs py-2 px-4 mt-1">
              <i class="fa-solid fa-rotate-left"></i> Bersihkan Opsi Pencarian
            </button>
          ` : ''}
        </div>
      `;

      document.getElementById('btn-reset-empty')?.addEventListener('click', () => {
        state.search = '';
        state.jenis = 'Semua';
        state.bahasa = 'Semua';
        state.page = 1;
        if (searchInput) searchInput.value = '';
        if (searchClearBtn) searchClearBtn.classList.add('hidden');
        updateFilterBadges();
        loadCollectionData();
      });

      return;
    }

    if (state.viewMode === 'grid') {
      // GRID VIEW (Section G)
      contentArea.innerHTML = `
        <div class="books-grid">
          ${state.books.map(book => {
            const saved = isBookmarked(book.id);
            const coverSrc = formatCoverUrl(book.cover, book.judul || book.nama);
            
            return `
              <div class="book-card cursor-pointer" data-id="${book.id}">
                <div class="book-cover-wrap">
                  <img src="${coverSrc}" alt="${book.judul || 'Cover'}" class="book-cover-img" loading="lazy" onerror="this.onerror=null; this.src='${formatCoverUrl('', book.judul)}';" />
                  <span class="badge-jenis">${book.jenis || 'Buku'}</span>
                  ${saved ? '<span class="badge-bookmark" title="Tersimpan"><i class="fa-solid fa-star"></i></span>' : ''}
                </div>
                <div class="book-card-body">
                  <h3 class="book-title">${book.judul || book.nama || 'Tanpa Judul'}</h3>
                  <p class="book-author"><i class="fa-regular fa-user text-[10px]"></i> ${book.nama || book.penulis || 'Penulis'}</p>
                  <p class="book-edition">${book.edisi ? 'Edisi: ' + book.edisi : 'Bahasa: ' + (book.bahasa || 'Indonesia')}</p>
                  <button class="btn btn-outline-primary text-[11px] py-1.5 px-3 mt-3 w-full btn-detail-trigger" data-id="${book.id}">
                    <i class="fa-solid fa-circle-info"></i> Detail
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else {
      // LIST VIEW (Section H)
      contentArea.innerHTML = `
        <div class="books-list">
          ${state.books.map(book => {
            const saved = isBookmarked(book.id);
            const coverSrc = formatCoverUrl(book.cover, book.judul || book.nama);

            return `
              <div class="book-list-item cursor-pointer" data-id="${book.id}">
                <img src="${coverSrc}" alt="${book.judul || 'Cover'}" class="book-list-cover" loading="lazy" onerror="this.onerror=null; this.src='${formatCoverUrl('', book.judul)}';" />
                <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div class="flex items-center gap-1.5 mb-1">
                      <span class="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">${book.jenis || 'Buku'}</span>
                      ${saved ? '<i class="fa-solid fa-star text-amber-500 text-xs"></i>' : ''}
                    </div>
                    <h3 class="text-xs font-bold text-slate-800 truncate">${book.judul || book.nama || 'Tanpa Judul'}</h3>
                    <p class="text-[11px] text-slate-500 truncate">${book.nama || book.penulis || '-'}</p>
                  </div>
                  <div class="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                    <span class="text-[10px] text-slate-400">${book.edisi || book.bahasa || 'Indonesia'}</span>
                    <button class="btn btn-primary text-[10px] py-1 px-2.5 btn-detail-trigger" data-id="${book.id}">
                      Detail
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    // Attach card click handlers to open Detail Modal
    contentArea.querySelectorAll('.book-card, .book-list-item').forEach(card => {
      card.addEventListener('click', (e) => {
        const id = card.getAttribute('data-id');
        const found = state.books.find(b => String(b.id) === String(id));
        if (found) {
          openDetailModal(found, () => {
            renderBooksList(); // re-render badges if bookmark toggled
          });
        }
      });
    });
  }

  // Render Pagination Controls (Section I)
  function renderPaginationControls() {
    const container = document.getElementById('pagination-container');
    if (!container) return;

    if (state.total === 0 || state.limit === 'Semua') {
      container.innerHTML = `
        <span class="text-slate-500">Menampilkan total ${state.books.length} koleksi</span>
      `;
      return;
    }

    const isFirstPage = state.currentPage <= 1;
    const isLastPage = state.currentPage >= state.totalPages;

    container.innerHTML = `
      <span class="text-slate-600 font-semibold">
        Halaman <span class="text-emerald-700">${state.currentPage}</span> dari <span class="text-slate-800">${state.totalPages}</span> (${state.total} total)
      </span>

      <div class="flex items-center gap-1.5">
        <!-- Button Awal (First) -->
        <button id="btn-page-first" class="btn btn-secondary py-1.5 px-2.5 text-xs" ${isFirstPage ? 'disabled' : ''} title="Halaman Awal">
          <i class="fa-solid fa-angles-left"></i> <span class="hidden sm:inline">Awal</span>
        </button>

        <!-- Button Prev -->
        <button id="btn-page-prev" class="btn btn-secondary py-1.5 px-3 text-xs" ${isFirstPage ? 'disabled' : ''} title="Sebelumnya">
          <i class="fa-solid fa-chevron-left"></i> <span class="hidden sm:inline">Prev</span>
        </button>

        <!-- Button Next -->
        <button id="btn-page-next" class="btn btn-secondary py-1.5 px-3 text-xs" ${isLastPage ? 'disabled' : ''} title="Berikutnya">
          <span class="hidden sm:inline">Next</span> <i class="fa-solid fa-chevron-right"></i>
        </button>

        <!-- Button Akhir (Last) -->
        <button id="btn-page-last" class="btn btn-secondary py-1.5 px-2.5 text-xs" ${isLastPage ? 'disabled' : ''} title="Halaman Akhir">
          <span class="hidden sm:inline">Akhir</span> <i class="fa-solid fa-angles-right"></i>
        </button>
      </div>
    `;

    // Add ripple effect & click actions to pagination buttons
    const btnFirst = document.getElementById('btn-page-first');
    const btnPrev = document.getElementById('btn-page-prev');
    const btnNext = document.getElementById('btn-page-next');
    const btnLast = document.getElementById('btn-page-last');

    if (btnFirst) {
      btnFirst.addEventListener('click', (e) => {
        createRipple(e);
        if (state.currentPage > 1) {
          state.page = 1;
          loadCollectionData();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', (e) => {
        createRipple(e);
        if (state.currentPage > 1) {
          state.page = state.currentPage - 1;
          loadCollectionData();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', (e) => {
        createRipple(e);
        if (state.currentPage < state.totalPages) {
          state.page = state.currentPage + 1;
          loadCollectionData();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }

    if (btnLast) {
      btnLast.addEventListener('click', (e) => {
        createRipple(e);
        if (state.currentPage < state.totalPages) {
          state.page = state.totalPages;
          loadCollectionData();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    }
  }

  // Initial Data Load
  loadCollectionData();
}
