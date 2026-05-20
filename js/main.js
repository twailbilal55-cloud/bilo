/* ============================================
   TARBOUCH COOK - Main JavaScript
   3D Effects, Logo Interaction, Animations
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

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks?.classList.toggle('open');
    });

    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navLinks?.classList.remove('open');
        });
    });

    // ========== 3D LOGO INTERACTION ==========
    const heroLogo3D = document.getElementById('heroLogo3D');
    const logo3DInner = document.getElementById('logo3DInner');
    const hero = document.getElementById('hero');

    if (heroLogo3D && logo3DInner) {
        let isHovering = false;
        let currentRotateX = 0;
        let currentRotateY = 0;
        let targetRotateX = 0;
        let targetRotateY = 0;
        let scrollRotation = 0;

        // Mouse move - 3D tilt effect
        hero?.addEventListener('mousemove', (e) => {
            isHovering = true;
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            targetRotateX = (y - 0.5) * -30; // -15 to +15 deg
            targetRotateY = (x - 0.5) * 30;  // -15 to +15 deg
        });

        // Mouse leave - spin back animation
        hero?.addEventListener('mouseleave', () => {
            isHovering = false;
            targetRotateX = 0;
            targetRotateY = 0;
            
            // Do a full 360 spin when leaving
            logo3DInner.style.transition = 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            logo3DInner.style.transform = `
                perspective(1200px) 
                rotateY(360deg) 
                rotateX(0deg) 
                translateY(0px) 
                scale(1)
            `;
            
            setTimeout(() => {
                logo3DInner.style.transition = 'transform 0.08s ease-out';
                logo3DInner.style.transform = `
                    perspective(1200px) 
                    rotateY(0deg) 
                    rotateX(0deg) 
                    translateY(0px) 
                    scale(1)
                `;
                // Restore idle animation
                logo3DInner.style.animation = 'logoIdleFloat 6s ease-in-out infinite';
            }, 1300);
        });

        // Smooth animation frame for mouse tracking
        function animateLogo() {
            if (isHovering) {
                currentRotateX += (targetRotateX - currentRotateX) * 0.08;
                currentRotateY += (targetRotateY - currentRotateY) * 0.08;
                
                // Stop idle animation when interacting
                logo3DInner.style.animation = 'none';
                logo3DInner.style.transition = 'none';
                logo3DInner.style.transform = `
                    perspective(1200px) 
                    rotateX(${currentRotateX}deg) 
                    rotateY(${currentRotateY}deg) 
                    translateY(${currentRotateX * 0.3}px) 
                    scale(${1 + Math.abs(currentRotateX + currentRotateY) * 0.002})
                `;
            }
            requestAnimationFrame(animateLogo);
        }
        animateLogo();

        // ===== SCROLL - Logo rotates on scroll =====
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = hero?.offsetHeight || window.innerHeight;
            
            if (scrolled < heroHeight) {
                const scrollProgress = scrolled / heroHeight;
                
                // Logo rotates as you scroll
                const scrollRotateY = scrollProgress * 180;
                const scrollScale = 1 - scrollProgress * 0.4;
                const scrollOpacity = 1 - scrollProgress * 0.8;
                const scrollTranslateY = scrollProgress * -80;
                
                if (!isHovering) {
                    logo3DInner.style.animation = 'none';
                    logo3DInner.style.transition = 'transform 0.3s ease-out';
                    logo3DInner.style.transform = `
                        perspective(1200px) 
                        rotateY(${scrollRotateY}deg) 
                        rotateX(${scrollProgress * 20}deg) 
                        translateY(${scrollTranslateY}px) 
                        scale(${scrollScale})
                    `;
                }
                
                heroLogo3D.style.opacity = scrollOpacity;
            }
        });

        // ===== TOUCH SUPPORT (Mobile) =====
        let touchStartX = 0;
        let touchStartY = 0;
        let isTouching = false;

        hero?.addEventListener('touchstart', (e) => {
            isTouching = true;
            isHovering = true;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            logo3DInner.style.animation = 'none';
        }, { passive: true });

        hero?.addEventListener('touchmove', (e) => {
            if (!isTouching) return;
            
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = (touchX - touchStartX) / window.innerWidth;
            const deltaY = (touchY - touchStartY) / window.innerHeight;
            
            targetRotateY = deltaX * 60;
            targetRotateX = deltaY * -40;
        }, { passive: true });

        hero?.addEventListener('touchend', () => {
            isTouching = false;
            isHovering = false;
            
            // Spin back on touch release
            logo3DInner.style.transition = 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)';
            logo3DInner.style.transform = `
                perspective(1200px) 
                rotateY(360deg) 
                rotateX(0deg) 
                scale(1)
            `;
            
            setTimeout(() => {
                logo3DInner.style.transition = 'transform 0.1s ease-out';
                logo3DInner.style.transform = 'perspective(1200px) rotateY(0) rotateX(0) scale(1)';
                logo3DInner.style.animation = 'logoIdleFloat 6s ease-in-out infinite';
            }, 1100);
        }, { passive: true });
    }

    // ========== GOLDEN PARTICLES ==========
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 6 + 5) + 's';
            particle.style.animationDelay = (Math.random() * 5) + 's';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            particlesContainer.appendChild(particle);
        }
    }

    // ========== 3D TILT EFFECT (Cards) ==========
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

        // Touch support for mobile tilt
        el.addEventListener('touchmove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
        }, { passive: true });

        el.addEventListener('touchend', () => {
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

    // ========== PARALLAX ==========
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        const ghostText = document.querySelector('.hero-ghost-text');
        if (ghostText) {
            ghostText.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.3}px))`;
        }

        const heroContent = document.querySelector('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
        }
    });

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========== MENU TABS ==========
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

    // ========== ORDER BUTTONS ==========
    const orderBtns = document.querySelectorAll('.menu-card-add, .add-to-order');
    
    orderBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1.3) rotate(180deg)';
            setTimeout(() => {
                this.style.transform = 'scale(1) rotate(0)';
            }, 300);
            showNotification('تمت الإضافة إلى الطلب! 🛒');
        });
    });

    // ========== NOTIFICATION ==========
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
