/* ===========================================================
   CITTA. — Scroll & UI Animations
   GSAP + ScrollTrigger + Lenis smooth scroll
   =========================================================== */

(function () {
    if (typeof gsap === 'undefined') return;

    // ===== Lenis Smooth Scroll =====
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: false
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        }
    }

    // ===== Register ScrollTrigger =====
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    document.addEventListener('DOMContentLoaded', () => {
        // ===== LOADER =====
        const loader = document.querySelector('.loader');
        const loaderFill = document.querySelector('.loader-bar-fill');
        if (loader) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 18 + 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    if (loaderFill) loaderFill.style.width = '100%';
                    setTimeout(() => {
                        loader.classList.add('hidden');
                        playHeroIntro();
                    }, 400);
                } else {
                    if (loaderFill) loaderFill.style.width = progress + '%';
                }
            }, 150);
        } else {
            playHeroIntro();
        }

        // ===== HERO INTRO =====
        function playHeroIntro() {
            const tl = gsap.timeline();
            tl.to('.hero-tag', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
              .from('.hero h1 .word', {
                  yPercent: 110,
                  rotationZ: 8,
                  duration: 1.1,
                  stagger: 0.08,
                  ease: 'power4.out'
              }, '-=0.4')
              .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
              .to('.hero-cta', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
        }

        // ===== NAV SCROLL =====
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            const handler = () => {
                if (window.scrollY > 50) navbar.classList.add('scrolled');
                else navbar.classList.remove('scrolled');
            };
            window.addEventListener('scroll', handler);
            handler();
        }

        // ===== MOBILE MENU =====
        const menuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.querySelector('.nav-links');
        if (menuBtn && navLinks) {
            menuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-xmark');
                }
            });
        }

        // ===== SECTION REVEAL ON SCROLL =====
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.utils.toArray('[data-reveal]').forEach((el) => {
                gsap.from(el, {
                    y: 60,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                });
            });

            // Stagger reveal for cards
            gsap.utils.toArray('[data-stagger]').forEach((parent) => {
                const items = parent.querySelectorAll('[data-stagger-item]');
                gsap.from(items, {
                    y: 50,
                    opacity: 0,
                    duration: 0.9,
                    stagger: 0.12,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: parent,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                });
            });

            // Manifesto word lighting
            const manifesto = document.querySelector('.manifesto h2');
            if (manifesto) {
                const words = manifesto.querySelectorAll('.word');
                gsap.to(words, {
                    color: (i, el) => el.classList.contains('accent') ? '' : '#ffffff',
                    stagger: 0.05,
                    scrollTrigger: {
                        trigger: manifesto,
                        start: 'top 75%',
                        end: 'bottom 50%',
                        scrub: 1
                    },
                    onUpdate: function () {
                        const prog = this.progress();
                        words.forEach((w, i) => {
                            if (i / words.length <= prog) w.classList.add('lit');
                            else w.classList.remove('lit');
                        });
                    }
                });
            }

            // Stat counters
            gsap.utils.toArray('.stat-num[data-count]').forEach((el) => {
                const target = parseInt(el.dataset.count);
                const obj = { val: 0 };
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 85%',
                    onEnter: () => {
                        gsap.to(obj, {
                            val: target,
                            duration: 2,
                            ease: 'power2.out',
                            onUpdate: () => {
                                const suffix = el.dataset.suffix || '';
                                el.querySelector('.num-val').textContent = Math.floor(obj.val) + suffix;
                            }
                        });
                    }
                });
            });

            // Parallax on hero content
            gsap.to('.hero-content', {
                y: 150,
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }

        // ===== 3D TILT ON PRODUCT CARDS =====
        document.querySelectorAll('.product-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(card, {
                    rotationY: x * 12,
                    rotationX: -y * 12,
                    transformPerspective: 1000,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });

        // ===== CUSTOM CURSOR-ish glow on collection cards =====
        document.querySelectorAll('.collection-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,206,209,0.15) 0%, var(--c-deep) 50%)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.background = '';
            });
        });
    });
})();
