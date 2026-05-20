/* ============================================
   TARBOUCH COOK - Main JavaScript
   3D Effects, Carousel, Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ========== LOADER ==========
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2200);
    }

    // ========== NAVBAR ==========
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks?.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navLinks?.classList.remove('open');
        });
    });

    // ========== 3D CAROUSEL ==========
    const carousel = document.getElementById('heroCarousel');
    if (carousel) {
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.prev');
        const nextBtn = carousel.querySelector('.next');
        let activeIndex = 0;
        let isAnimating = false;
        const totalItems = items.length;

        function updateCarousel() {
            items.forEach((item, i) => {
                item.removeAttribute('data-role');
                
                if (i === activeIndex) {
                    item.setAttribute('data-role', 'center');
                } else if (i === (activeIndex + totalItems - 1) % totalItems) {
                    item.setAttribute('data-role', 'left');
                } else if (i === (activeIndex + 1) % totalItems) {
                    item.setAttribute('data-role', 'right');
                } else {
                    item.setAttribute('data-role', 'back');
                }
            });
        }

        function navigate(direction) {
            if (isAnimating) return;
            isAnimating = true;

            if (direction === 'next') {
                activeIndex = (activeIndex + 1) % totalItems;
            } else {
                activeIndex = (activeIndex + totalItems - 1) % totalItems;
            }

            updateCarousel();
            setTimeout(() => { isAnimating = false; }, 650);
        }

        prevBtn?.addEventListener('click', () => navigate('prev'));
        nextBtn?.addEventListener('click', () => navigate('next'));

        // Auto-rotate
        let autoRotate = setInterval(() => navigate('next'), 4000);
        
        carousel.addEventListener('mouseenter', () => clearInterval(autoRotate));
        carousel.addEventListener('mouseleave', () => {
            autoRotate = setInterval(() => navigate('next'), 4000);
        });

        // Initialize
        updateCarousel();
    }

    // ========== 3D TILT EFFECT ==========
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ========== SCROLL REVEAL ==========
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .feature-card, .dish-card, .menu-card, .gallery-item, .stat-card');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // ========== PARALLAX ON SCROLL ==========
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Ghost text parallax
        const ghostText = document.querySelector('.hero-ghost-text');
        if (ghostText) {
            ghostText.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px))`;
        }

        // Hero content parallax
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
        }
    });

    // ========== SMOOTH SECTION TRANSITIONS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========== MENU TABS (if on menu page) ==========
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCards = document.querySelectorAll('.menu-card');
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.getAttribute('data-category');
            
            menuCards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
        });
    });

    // ========== ORDER SYSTEM ==========
    const orderBtns = document.querySelectorAll('.menu-card-add, .add-to-order');
    
    orderBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Add bounce animation
            this.style.transform = 'scale(1.3) rotate(180deg)';
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0)';
            }, 300);
            
            // Show notification
            showNotification('تمت الإضافة إلى الطلب! 🛒');
        });
    });

    // ========== NOTIFICATION SYSTEM ==========
    function showNotification(message) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: var(--dark);
            color: white;
            padding: 14px 28px;
            border-radius: 50px;
            font-size: 0.9rem;
            font-family: var(--font-body);
            z-index: 9999;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }

    // Make it globally available
    window.showNotification = showNotification;

    // ========== GALLERY LIGHTBOX ==========
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (!img) return;
            
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.style.cssText = `
                position: fixed;
                inset: 0;
                z-index: 10000;
                background: rgba(0,0,0,0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                cursor: pointer;
            `;
            
            const lbImg = document.createElement('img');
            lbImg.src = img.src;
            lbImg.style.cssText = `
                max-width: 90vw;
                max-height: 85vh;
                object-fit: contain;
                border-radius: 12px;
                transform: scale(0.9);
                transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            `;
            
            lightbox.appendChild(lbImg);
            document.body.appendChild(lightbox);
            
            setTimeout(() => {
                lightbox.style.opacity = '1';
                lbImg.style.transform = 'scale(1)';
            }, 10);
            
            lightbox.addEventListener('click', () => {
                lightbox.style.opacity = '0';
                lbImg.style.transform = 'scale(0.9)';
                setTimeout(() => lightbox.remove(), 300);
            });
        });
    });
});
