(function() {
    // ========== REVEAL ON SCROLL ==========
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (!entry.target.classList.contains('reveal-stagger')) {
                    revealObserver.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // ========== MOBILE MENU TOGGLE ==========
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const bar1 = document.getElementById('bar1');
    const bar2 = document.getElementById('bar2');
    const bar3 = document.getElementById('bar3');
    let menuOpen = false;

    function toggleMenu(open) {
        menuOpen = open;
        if (open) {
            mobileMenu.classList.add('open');
            bar1.style.transform = 'rotate(45deg) translateY(-2px)';
            bar2.style.opacity = '0';
            bar3.style.transform = 'rotate(-45deg) translateY(2px)';
            bar3.style.width = '24px';
        } else {
            mobileMenu.classList.remove('open');
            bar1.style.transform = 'rotate(0) translateY(0)';
            bar2.style.opacity = '1';
            bar3.style.transform = 'rotate(0) translateY(0)';
            bar3.style.width = '20px';
        }
    }

    hamburger.addEventListener('click', () => {
        toggleMenu(!menuOpen);
    });

    // Tutup menu saat link diklik
    mobileMenu.querySelectorAll('a, button').forEach(item => {
        item.addEventListener('click', () => {
            toggleMenu(false);
        });
    });

    // ========== SMOOTH SCROLL FOR BUTTONS ==========
    function scrollToSection(selector) {
        const target = document.querySelector(selector);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // "Get Started" buttons (navbar & mobile)
    document.getElementById('btnGetStarted1').addEventListener('click', () => scrollToSection('#contact'));
    document.getElementById('btnGetStarted2').addEventListener('click', () => scrollToSection('#contact'));

    // Hero buttons
    document.getElementById('btnSeeWork').addEventListener('click', () => scrollToSection('#portfolio'));
    document.getElementById('btnLearnMore').addEventListener('click', () => scrollToSection('#services'));

    // "Learn More" di service cards sudah pakai <a href="#portfolio">, jadi otomatis smooth

    // ========== SUBSCRIBE FORM ==========
    const subscribeForm = document.getElementById('subscribeForm');
    const emailInput = document.getElementById('emailInput');
    const subscribeMessage = document.getElementById('subscribeMessage');

    subscribeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            // Tampilkan error sederhana
            emailInput.style.borderColor = '#ef4444';
            emailInput.focus();
            subscribeMessage.textContent = '❌ Please enter a valid email.';
            subscribeMessage.classList.remove('hidden', 'text-green-600');
            subscribeMessage.classList.add('text-red-500');
            return;
        }

        // Sukses
        emailInput.style.borderColor = '#d1d5db';
        subscribeMessage.textContent = '✅ Thanks for subscribing!';
        subscribeMessage.classList.remove('hidden', 'text-red-500');
        subscribeMessage.classList.add('text-green-600');
        emailInput.value = '';

        // Sembunyikan pesan setelah beberapa detik
        setTimeout(() => {
            subscribeMessage.classList.add('hidden');
        }, 4000);
    });

    // Reset border color saat user mengetik ulang
    emailInput.addEventListener('input', () => {
        emailInput.style.borderColor = '#d1d5db';
    });

    // ========== BACK TO TOP ==========
    const backToTop = document.getElementById('backToTop');

    function toggleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Initial check
    toggleBackToTop();

    // ========== SMOOTH SCROLL UNTUK SEMUA ANCHOR ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();
