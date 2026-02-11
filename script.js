/* ==========================================================================
   Wellington Auto Pros — Template Scripts
   Designed by WingfieldGemini
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Custom Cursor ---------- */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effect on interactive elements
        document.querySelectorAll('a, button, input, select, textarea, .service-card, .review-card').forEach(el => {
            el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
        });
    }

    /* ---------- Navigation Scroll Effect ---------- */
    const nav = document.getElementById('nav');
    const banner = document.querySelector('.emergency-banner');

    function handleNavScroll() {
        if (window.scrollY > 60) {
            nav.classList.add('scrolled');
            banner.style.transform = 'translateY(-100%)';
            banner.style.position = 'fixed';
            banner.style.top = '0';
            banner.style.left = '0';
            banner.style.right = '0';
            banner.style.zIndex = '1001';
            banner.style.transition = 'transform 0.3s ease';
        } else {
            nav.classList.remove('scrolled');
            banner.style.transform = '';
            banner.style.position = '';
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    // Active nav link tracking
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });

    /* ---------- Mobile Menu ---------- */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta, .mobile-cta-book');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    /* ---------- Hero Particles ---------- */
    const particlesContainer = document.getElementById('heroParticles');
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = 60 + Math.random() * 40 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = 6 + Math.random() * 6 + 's';
        particle.style.width = 1 + Math.random() * 3 + 'px';
        particle.style.height = particle.style.width;
        particlesContainer.appendChild(particle);
    }

    /* ---------- Hero Text Reveal ---------- */
    setTimeout(() => {
        document.querySelectorAll('.reveal-line').forEach((line, i) => {
            setTimeout(() => line.classList.add('revealed'), i * 200);
        });
    }, 300);

    /* ---------- Scroll Reveal (Intersection Observer) ---------- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ---------- Counter Animation ---------- */
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseFloat(el.dataset.target);
                const isDecimal = el.dataset.decimal === 'true';
                const duration = 2000;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = eased * target;

                    if (isDecimal) {
                        el.textContent = current.toFixed(1);
                    } else {
                        el.textContent = Math.floor(current).toLocaleString();
                    }

                    if (progress < 1) requestAnimationFrame(update);
                }

                requestAnimationFrame(update);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

    /* ---------- Reviews Carousel ---------- */
    const track = document.getElementById('reviewsTrack');
    const cards = track.querySelectorAll('.review-card');
    const dotsContainer = document.getElementById('reviewsDots');
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    let currentSlide = 0;
    let autoPlayInterval;

    // Create dots
    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        resetAutoPlay();
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % cards.length);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + cards.length) % cards.length);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(nextSlide, 5000);
    }
    resetAutoPlay();

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : prevSlide();
        }
    }, { passive: true });

    /* ---------- Form Handling ---------- */
    const form = document.getElementById('bookingForm');

    // Make inputs work with floating labels: add placeholder=" " if missing
    form.querySelectorAll('input, textarea').forEach(input => {
        if (!input.placeholder) input.placeholder = ' ';
    });

    form.addEventListener('submit', e => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<span>Sending...</span>';
        btn.disabled = true;

        // Simulate submission
        setTimeout(() => {
            btn.innerHTML = '<span>✓ Request Sent!</span>';
            btn.style.background = '#22C55E';

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3000);
        }, 1500);
    });

    /* ---------- Smooth Scroll for All Anchor Links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ---------- Parallax on Hero ---------- */
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const hero = document.querySelector('.hero-content');
        if (scrollY < window.innerHeight) {
            hero.style.transform = `translateY(${scrollY * 0.15}px)`;
            hero.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
        }
    }, { passive: true });

});
