(function() {
    // ========== REVEAL ON SCROLL ==========
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (!entry.target.classList.contains('reveal-stagger')) observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => observer.observe(el));

    // ========== MOBILE MENU ==========
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const bars = [document.getElementById('bar1'), document.getElementById('bar2'), document.getElementById('bar3')];
    let menuOpen = false;
    hamburger.addEventListener('click', () => {
        menuOpen = !menuOpen;
        mobileMenu.classList.toggle('open', menuOpen);
        bars[0].style.transform = menuOpen ? 'rotate(45deg) translateY(-2px)' : '';
        bars[1].style.opacity = menuOpen ? '0' : '1';
        bars[2].style.transform = menuOpen ? 'rotate(-45deg) translateY(2px)' : '';
        bars[2].style.width = menuOpen ? '24px' : '20px';
    });
    mobileMenu.querySelectorAll('a, button').forEach(item => item.addEventListener('click', () => {
        menuOpen = false;
        mobileMenu.classList.remove('open');
        bars[0].style.transform = ''; bars[1].style.opacity = '1'; bars[2].style.transform = ''; bars[2].style.width = '20px';
    }));

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });
    document.getElementById('btnGetStarted1').addEventListener('click', () => document.querySelector('#contact').scrollIntoView({behavior:'smooth'}));
    document.getElementById('btnGetStarted2').addEventListener('click', () => document.querySelector('#contact').scrollIntoView({behavior:'smooth'}));
    document.getElementById('btnSeeWork').addEventListener('click', () => document.querySelector('#portfolio').scrollIntoView({behavior:'smooth'}));
    document.getElementById('btnLearnMore').addEventListener('click', () => document.querySelector('#services').scrollIntoView({behavior:'smooth'}));

    // ========== SUBSCRIBE ==========
    const form = document.getElementById('subscribeForm');
    const emailInput = document.getElementById('emailInput');
    const msg = document.getElementById('subscribeMessage');
    form.addEventListener('submit', e => {
        e.preventDefault();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            emailInput.style.borderColor = '#ff4d4d';
            msg.textContent = '❌ Invalid email'; msg.classList.remove('hidden'); msg.classList.add('text-red-400');
        } else {
            emailInput.style.borderColor = '#00f2fe';
            msg.textContent = '✅ Subscribed!'; msg.classList.remove('hidden'); msg.classList.add('text-cyan-400');
            emailInput.value = '';
            setTimeout(() => msg.classList.add('hidden'), 4000);
        }
    });

    // ========== BACK TO TOP ==========
    const backBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backBtn.classList.toggle('show', window.scrollY > 600);
    });
    backBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

    // ========== PARALLAX HERO ==========
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroCard = document.getElementById('heroCard');
        if (heroCard) {
            heroCard.style.transform = `translateY(${scrolled * 0.15}px)`;
        }
    });

    // ========== 3D TILT EFFECT ==========
    const card = document.querySelector('.hero-3d');
    if (card) {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width/2;
            const centerY = rect.height/2;
            const rotateX = ((y - centerY) / centerY) * 8;
            const rotateY = ((x - centerX) / centerX) * 8;
            card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }
})();
