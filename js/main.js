/* ============================================
   TARBOUCH COOK - Single Page JS
   Sticky 3D Logo + All Interactions
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

    // === LOADER ===
    setTimeout(() => document.getElementById('loader')?.classList.add('hidden'), 2000);

    // === NAVBAR ===
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 50);
    });

    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks?.classList.toggle('open');
    });

    navLinks?.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navLinks?.classList.remove('open');
        });
    });

    // === PARTICLES ===
    const particles = document.getElementById('heroParticles');
    if (particles) {
        for (let i = 0; i < 25; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (Math.random() * 5 + 4) + 's';
            p.style.animationDelay = (Math.random() * 4) + 's';
            p.style.width = p.style.height = (Math.random() * 3 + 2) + 'px';
            particles.appendChild(p);
        }
    }

    // === STICKY 3D LOGO - FOLLOWS SCROLL ===
    const stickyLogo = document.getElementById('stickyLogo');
    const stickyInner = document.getElementById('stickyLogoInner');
    const sections = document.querySelectorAll('.section');
    let lastScrollY = 0;
    let ticking = false;

    function updateLogoOnScroll() {
        const scrollY = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = scrollY / docHeight; // 0 to 1

        // 3D rotation based on scroll progress
        const rotateY = scrollProgress * 720; // 2 full rotations across page
        const rotateX = Math.sin(scrollProgress * Math.PI * 4) * 15;

        // Determine scroll direction for flip
        const direction = scrollY > lastScrollY ? 1 : -1;
        const speed = Math.abs(scrollY - lastScrollY);
        const extraFlip = Math.min(speed * 0.5, 20) * direction;

        if (stickyInner) {
            stickyInner.style.animation = 'none';
            stickyInner.style.transform = `
                rotateY(${rotateY + extraFlip}deg) 
                rotateX(${rotateX}deg) 
                scale(${1 + Math.sin(scrollProgress * Math.PI) * 0.1})
            `;
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateLogoOnScroll);
            ticking = true;
        }
    });

    // === LOGO MOUSE INTERACTION ===
    document.addEventListener('mousemove', (e) => {
        if (!stickyLogo || window.innerWidth < 768) return;
        const rect = stickyLogo.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = (e.clientX - centerX) / window.innerWidth;
        const distY = (e.clientY - centerY) / window.innerHeight;

        // Subtle extra tilt based on mouse proximity
        const extraRX = distY * -10;
        const extraRY = distX * 10;

        if (stickyInner && Math.abs(e.clientX - centerX) < 300) {
            const current = stickyInner.style.transform || '';
            // Only add mouse effect, don't override scroll
            stickyInner.style.transform = current.replace(/translateZ\([^)]*\)/, '') + ` translateZ(${Math.abs(distX) * 20}px)`;
        }
    });

    // === TOUCH - Logo flips on touch ===
    let touchCount = 0;
    stickyLogo?.addEventListener('pointerdown', () => {
        touchCount++;
        if (stickyInner) {
            stickyInner.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            stickyInner.style.transform = `rotateY(${touchCount * 360}deg) rotateX(10deg) scale(1.2)`;
            setTimeout(() => {
                stickyInner.style.transition = 'transform 0.15s ease-out';
            }, 900);
        }
    });

    // When scroll stops, restore idle animation
    let scrollTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            if (stickyInner) {
                stickyInner.style.animation = 'logoIdle 5s ease-in-out infinite';
                stickyInner.style.transform = '';
            }
        }, 1500);
    });

    // === MENU TABS ===
    const tabs = document.querySelectorAll('.tab');
    const cards = document.querySelectorAll('.m-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.dataset.cat;
            cards.forEach(c => {
                const show = cat === 'all' || c.dataset.cat === cat;
                c.style.display = show ? 'block' : 'none';
                if (show) {
                    c.style.opacity = '0';
                    c.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        c.style.transition = 'all .4s ease';
                        c.style.opacity = '1';
                        c.style.transform = 'translateY(0)';
                    }, 50);
                }
            });
        });
    });

    // === SCROLL REVEAL ===
    const revealEls = document.querySelectorAll('.f-card, .m-card, .g-item, .stat, .c-card, .o-item');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 60);
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'all .5s cubic-bezier(0.4,0,0.2,1)';
        revealObs.observe(el);
    });

    // === ACTIVE NAV LINK ON SCROLL ===
    const navItems = document.querySelectorAll('.nav-links a');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navItems.forEach(a => a.classList.remove('active'));
                const id = entry.target.id;
                const link = document.querySelector(`.nav-links a[href="#${id}"]`);
                link?.classList.add('active');
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(s => sectionObserver.observe(s));
});

// === ORDER SYSTEM ===
function changeQty(btn, delta) {
    const item = btn.closest('.o-item');
    const span = item.querySelector('.o-qty span');
    let qty = parseInt(span.textContent) + delta;
    if (qty < 0) qty = 0;
    span.textContent = qty;
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => btn.style.transform = '', 150);
    updateOrder();
}

function updateOrder() {
    const items = document.querySelectorAll('.o-item');
    const list = document.getElementById('summaryList');
    const total = document.getElementById('totalPrice');
    let sum = 0, html = '';

    items.forEach(item => {
        const qty = parseInt(item.querySelector('.o-qty span').textContent);
        if (qty > 0) {
            const name = item.dataset.name;
            const price = parseInt(item.dataset.price) * qty;
            sum += price;
            html += `<div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:.85rem"><span>${name} x${qty}</span><span>${price.toLocaleString()} د.ج</span></div>`;
        }
    });

    list.innerHTML = html || '<p class="empty">اختر منتجاً</p>';
    total.textContent = sum.toLocaleString() + ' د.ج';
}

function sendWhatsApp() {
    const items = document.querySelectorAll('.o-item');
    const name = document.getElementById('oName').value;
    const phone = document.getElementById('oPhone').value;
    const addr = document.getElementById('oAddr').value;
    let msg = '🛒 *طلب جديد - طربوش كوك*\n\n';
    let total = 0, hasItems = false;

    items.forEach(item => {
        const qty = parseInt(item.querySelector('.o-qty span').textContent);
        if (qty > 0) {
            hasItems = true;
            const n = item.dataset.name;
            const p = parseInt(item.dataset.price) * qty;
            total += p;
            msg += `• ${n} x${qty} = ${p.toLocaleString()} د.ج\n`;
        }
    });

    if (!hasItems) { alert('اختر منتج واحد على الأقل!'); return; }
    if (!name || !phone) { alert('أدخل اسمك ورقم هاتفك!'); return; }

    msg += `\n💰 *المجموع: ${total.toLocaleString()} د.ج*\n\n👤 ${name}\n📍 ${addr || '-'}\n📞 ${phone}`;
    window.open('https://wa.me/213563753977?text=' + encodeURIComponent(msg), '_blank');
}
