/**
 * Footer Component
 */

export function renderFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;

  container.innerHTML = `
    <footer class="bg-slate-900 text-slate-300 py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-800 transition-colors">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <!-- Left: Logo & Copyright -->
        <div class="flex items-center gap-3">
          <img src="../icon.jpg" alt="Logo PIM" class="w-9 h-9 rounded-full bg-emerald-700 p-0.5 object-cover shadow-sm" onerror="this.src='/icon.jpg'" />
          <div class="flex flex-col">
            <span class="font-bold text-white text-sm tracking-wide">Perpustakaan Digital PIM</span>
            <span class="text-xs text-slate-400">© ${new Date().getFullYear()} Perpustakaan PIM. Hak Cipta Dilindungi.</span>
          </div>
        </div>

        <!-- Center / Right: Social Media Links -->
        <div class="flex items-center gap-4 text-lg">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-700 text-slate-300 hover:text-amber-300 flex items-center justify-center transition-all duration-200" title="Facebook PIM" aria-label="Facebook">
            <i class="fa-brands fa-facebook-f text-sm"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-700 text-slate-300 hover:text-amber-300 flex items-center justify-center transition-all duration-200" title="Instagram PIM" aria-label="Instagram">
            <i class="fa-brands fa-instagram text-sm"></i>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-700 text-slate-300 hover:text-amber-300 flex items-center justify-center transition-all duration-200" title="YouTube PIM" aria-label="YouTube">
            <i class="fa-brands fa-youtube text-sm"></i>
          </a>
        </div>

      </div>
    </footer>
  `;
}
