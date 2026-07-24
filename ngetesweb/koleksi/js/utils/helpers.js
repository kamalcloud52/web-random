/**
 * Utility Helpers for Koleksi Buku Digital PIM
 */

// Debounce helper
export function debounce(fn, delay = 500) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// Animate Counter Up
export function animateCounter(element, targetValue, duration = 1000) {
  if (!element) return;
  const target = parseInt(targetValue, 10) || 0;
  if (target === 0) {
    element.textContent = '0';
    return;
  }
  
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quadratic
    const easeProgress = 1 - (1 - progress) * (1 - progress);
    const currentValue = Math.floor(easeProgress * target);
    
    element.textContent = currentValue.toLocaleString('id-ID');
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString('id-ID');
    }
  }

  requestAnimationFrame(update);
}

// Format Cover Image URL (supports Google Drive links and fallback placeholder)
export function formatCoverUrl(coverUrl, bookTitle = 'Buku') {
  if (!coverUrl || typeof coverUrl !== 'string' || coverUrl.trim() === '') {
    return generatePlaceholderCover(bookTitle);
  }

  const trimmed = coverUrl.trim();

  // Handle Google Drive links
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    let fileId = null;
    
    // Pattern 1: /file/d/FILE_ID/
    const matchD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (matchD && matchD[1]) {
      fileId = matchD[1];
    }
    
    // Pattern 2: id=FILE_ID
    if (!fileId) {
      const matchId = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (matchId && matchId[1]) {
        fileId = matchId[1];
      }
    }

    if (fileId) {
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`;
    }
  }

  // If already standard direct HTTP image URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image')) {
    return trimmed;
  }

  return generatePlaceholderCover(bookTitle);
}

// Generate SVG Data URI placeholder cover
function generatePlaceholderCover(title = 'Buku') {
  const cleanTitle = (title || 'Buku Digital').slice(0, 28);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">
    <rect width="100%" height="100%" fill="#047857"/>
    <rect x="10" y="10" width="280" height="380" fill="none" stroke="#fcd34d" stroke-width="2" rx="6"/>
    <circle cx="150" cy="140" r="45" fill="#065f46"/>
    <path d="M130 145 C140 135, 160 135, 170 145 L170 120 C160 110, 140 110, 130 120 Z" fill="#fcd34d"/>
    <text x="150" y="240" font-family="'Poppins', sans-serif" font-weight="600" font-size="16" fill="#ffffff" text-anchor="middle" width="240">${cleanTitle}</text>
    <text x="150" y="340" font-family="'Poppins', sans-serif" font-weight="500" font-size="12" fill="#fcd34d" text-anchor="middle">PERPUSTAKAAN PIM</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// Ripple Effect on Buttons
export function createRipple(event) {
  const button = event.currentTarget;
  if (!button) return;

  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.classList.add('ripple');

  const existingRipple = button.getElementsByClassName('ripple')[0];
  if (existingRipple) {
    existingRipple.remove();
  }

  button.appendChild(circle);
}

// Toast Notifications
export function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-msg ${type}`;
  
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-circle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon} text-emerald-400"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

/* User Auth Persistence */
const AUTH_KEY = 'pim_user_session';

export function getUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setUser(userObj) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(userObj));
  } catch (e) {
    console.error('Failed to save user session', e);
  }
}

export function logoutUser() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (e) {
    console.error('Failed to remove user session', e);
  }
}

export function isLoggedIn() {
  return getUser() !== null;
}

/* Bookmarks Persistence */
const BOOKMARKS_KEY = 'pim_bookmarked_ids';

export function getBookmarks() {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isBookmarked(bookId) {
  if (!bookId) return false;
  const list = getBookmarks();
  return list.includes(String(bookId));
}

export function toggleBookmark(bookId) {
  if (!bookId) return false;
  const strId = String(bookId);
  let list = getBookmarks();
  let bookmarked = false;

  if (list.includes(strId)) {
    list = list.filter(id => id !== strId);
    bookmarked = false;
  } else {
    list.push(strId);
    bookmarked = true;
  }

  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save bookmarks', e);
  }

  return bookmarked;
}
