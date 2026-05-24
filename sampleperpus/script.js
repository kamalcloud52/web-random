(function() {
    // ==================== NAVBAR ====================
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });

    document.querySelectorAll('.nav-mobile li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(4,120,87,0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)';
        } else {
            navbar.style.background = 'rgba(4,120,87,0.95)';
            navbar.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
        }
    });

    // ==================== SLIDER ====================
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let current = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            showSlide(parseInt(dot.dataset.slide));
            resetInterval();
        });
    });

    let interval = setInterval(() => showSlide(current + 1), 5000);
    function resetInterval() {
        clearInterval(interval);
        interval = setInterval(() => showSlide(current + 1), 5000);
    }

    // ==================== ANIMASI SCROLL ====================
    const fadeEls = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    fadeEls.forEach(el => observer.observe(el));

    // ==================== FETCH GOOGLE DOCS ====================
    async function fetchDoc(docId) {
        try {
            const res = await fetch(`https://docs.google.com/document/d/${docId}/export?format=txt`);
            if (!res.ok) throw new Error('Gagal');
            return (await res.text()).trim();
        } catch (e) { return null; }
    }

    function truncate(text, max = 300) {
        if (!text) return '';
        return text.length > max ? text.substring(0, max) + '...' : text;
    }

    function setupSection(loadId, contentId, previewId, fullId, toggleId, retryId, docId) {
        const loadEl = document.getElementById(loadId);
        const contentEl = document.getElementById(contentId);
        const previewEl = document.getElementById(previewId);
        const fullEl = document.getElementById(fullId);
        const toggleBtn = document.getElementById(toggleId);
        const retryBtn = document.getElementById(retryId);
        if (!loadEl || !contentEl) return;
        let fullText = '', expanded = false;

        function render(text) {
            fullText = text;
            previewEl.textContent = truncate(text);
            fullEl.textContent = text;
            loadEl.classList.add('hidden');
            contentEl.classList.remove('hidden');
            if (retryBtn) retryBtn.classList.add('hidden');
            expanded = false;
            previewEl.classList.remove('hidden');
            fullEl.classList.add('hidden');
            fullEl.style.maxHeight = '0';
            fullEl.style.opacity = '0';
            toggleBtn.innerHTML = 'Selengkapnya <i class="fa-solid fa-arrow-right" style="font-size:0.65rem;"></i>';
        }

        function error() {
            loadEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Gagal memuat konten.';
            if (retryBtn) retryBtn.classList.remove('hidden');
        }

        async function load() {
            loadEl.classList.remove('hidden');
            contentEl.classList.add('hidden');
            if (retryBtn) retryBtn.classList.add('hidden');
            loadEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memuat...';
            const text = await fetchDoc(docId);
            text ? render(text) : error();
        }

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!fullText) return;
            expanded = !expanded;
            if (expanded) {
                // Buka
                previewEl.classList.add('hidden');
                fullEl.classList.remove('hidden');
                // Force reflow
                fullEl.offsetHeight;
                fullEl.style.maxHeight = fullEl.scrollHeight + 'px';
                fullEl.style.opacity = '1';
                toggleBtn.innerHTML = '<i class="fa-solid fa-arrow-left" style="font-size:0.65rem;"></i> Lebih sedikit';
            } else {
                // Tutup
                fullEl.style.maxHeight = '0';
                fullEl.style.opacity = '0';
                setTimeout(() => {
                    fullEl.classList.add('hidden');
                    previewEl.classList.remove('hidden');
                }, 450);
                toggleBtn.innerHTML = 'Selengkapnya <i class="fa-solid fa-arrow-right" style="font-size:0.65rem;"></i>';
            }
        });

        if (retryBtn) {
            retryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                load();
            });
        }

        load();
    }

    setupSection('history-loading', 'history-content', 'history-preview', 'history-full', 'history-toggle', 'history-retry', '13UyQuZSiXz8rP7_pKo-DdEczlEup5_Fq');
    setupSection('vision-loading', 'vision-content', 'vision-preview', 'vision-full', 'vision-toggle', 'vision-retry', '1iNowBiT40UulG-ihF5hiaCK0P1xK6B3lDSCFiDT83lQ');

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = document.getElementById('navbar').offsetHeight;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });
})();
