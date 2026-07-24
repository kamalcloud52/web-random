/**
 * API Service for Digital Library Books
 */

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbxGxMfe48R_pfZx0bpNSgG1gvegbsTmaiZ7ydnceEhpU24BihZqLOO_1YJAhebpgGsu/exec';

/**
 * Fetch books collection with filtering and pagination
 * @param {Object} params - Query parameters
 * @param {string} params.search - Search keyword
 * @param {string} params.jenis - Category filter
 * @param {string} params.bahasa - Language filter
 * @param {number} params.page - Current page number
 * @param {string|number} params.limit - Items per page
 */
export async function fetchBooks({
  search = '',
  jenis = 'Semua',
  bahasa = 'Semua',
  page = 1,
  limit = 12
} = {}) {
  try {
    const url = new URL(API_BASE_URL);

    if (search && search.trim() !== '') {
      url.searchParams.append('search', search.trim());
    }
    if (jenis && jenis !== 'Semua') {
      url.searchParams.append('jenis', jenis);
    }
    if (bahasa && bahasa !== 'Semua') {
      url.searchParams.append('bahasa', bahasa);
    }
    
    url.searchParams.append('page', page);
    url.searchParams.append('limit', limit);

    const response = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const json = await response.json();
    
    // Ensure shape compliance
    return {
      data: Array.isArray(json.data) ? json.data : [],
      allJenis: Array.isArray(json.allJenis) && json.allJenis.length > 0 ? json.allJenis : ['Buku', 'KTI', 'Kitab', 'Majalah', 'Modul', 'Skripsi', 'Tesis', 'Web'],
      allBahasa: Array.isArray(json.allBahasa) && json.allBahasa.length > 0 ? json.allBahasa : ['Indonesia', 'Arab', 'Arab Pegon', 'Inggris'],
      totalPages: typeof json.totalPages === 'number' ? json.totalPages : 1,
      currentPage: typeof json.currentPage === 'number' ? json.currentPage : page,
      total: typeof json.total === 'number' ? json.total : (Array.isArray(json.data) ? json.data.length : 0)
    };
  } catch (error) {
    console.warn('API Fetch failed or CORS issue, providing fallback/filtered simulation if needed:', error);
    // If live API request fails or offline, return graceful fallback or error state
    throw error;
  }
}
