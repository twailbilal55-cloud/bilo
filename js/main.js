/* ============================================
   TARBOUCH COOK - Premium Single Page JS
   Logo: center → travels left, scales up mid-travel, 
   scales down on arrival, face ALWAYS forward
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

    // === LOADER ===
    setTimeout(() => document.getElementById('loader')?.classList.add('hidden'), 2000);

    // === NAVBAR ===
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    window.addEventListener('scroll', () => navbar?.classList.toggle('scrolled', window.scrollY > 50));
    navToggle?.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks?.classList.toggle('open');
    });
    navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        navToggle?.classList.remove('active');
        navLinks?.classList.remove('open');
    }));

    // === PARTICLES ===
    const particles = document.getElementById('heroParticles');
    if (particles) {
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.width = p.style.height = (Math.random() * 3 + 1.5) + 'px';
            p.style.animationDuration = (Math.random() * 5 + 5) + 's';
            p.style.animationDelay = (Math.random() * 4) + 's';
            particles.appendChild(p);
        }
    }


    // === STICKY 3D LOGO ===
    // Behavior: starts LEFT side, scrolls to RIGHT side (one move only), then STOPS there
    const stickyLogo = document.getElementById('stickyLogo');
    const stickyInner = document.getElementById('stickyLogoInner');

    if (stickyLogo && stickyInner) {
        const isMobile = () => window.innerWidth < 768;

        // Only ONE transition: left → right, during first scroll (hero → features)
        // After that, logo stays fixed on the right
        let cTop, cLeft, cSize, cRotateY = 0, cRotateX = 0;

        // Starting position (LEFT side)
        function getStart() {
            return isMobile()
                ? { top: 20, left: 25, size: 80 }
                : { top: 40, left: 18, size: 180 };
        }
        // End position (RIGHT side) - stays here forever after
        function getEnd() {
            return isMobile()
                ? { top: 15, left: 82, size: 55 }
                : { top: 50, left: 90, size: 110 };
        }

        const start = getStart();
        cTop = start.top;
        cLeft = start.left;
        cSize = start.size;

        function updateLogo() {
            const scrollY = window.pageYOffset;
            const heroH = window.innerHeight; // first section height
            // progress: 0 at top, 1 when hero is fully scrolled past
            const progress = Math.max(0, Math.min(1, scrollY / heroH));

            const s = getStart();
            const e = getEnd();

            // Interpolate from start to end
            const t = progress;
            const targetTop = s.top + (e.top - s.top) * t;
            const targetLeft = s.left + (e.left - s.left) * t;

            // Size: grows BIG in middle, shrinks at end
            const baseSize = s.size + (e.size - s.size) * t;
            const growBump = Math.sin(t * Math.PI) * 0.5; // 50% bigger mid-travel
            const targetSize = baseSize * (1 + growBump);

            // 3D flip: one full 360° rotation during the move
            const targetRotateY = t * 360;
            const targetRotateX = Math.sin(t * Math.PI) * 20;

            // Smooth lerp
            cTop += (targetTop - cTop) * 0.06;
            cLeft += (targetLeft - cLeft) * 0.06;
            cSize += (targetSize - cSize) * 0.08;
            cRotateY += (targetRotateY - cRotateY) * 0.05;
            cRotateX += (targetRotateX - cRotateX) * 0.07;

            // Apply position
            stickyLogo.style.top = cTop + '%';
            stickyLogo.style.left = cLeft + '%';
            stickyLogo.style.width = cSize + 'px';
            stickyLogo.style.height = cSize + 'px';
            stickyLogo.style.transform = 'translate(-50%, -50%)';

            // 3D rotation
            stickyInner.style.transform = `rotateY(${cRotateY}deg) rotateX(${cRotateX}deg)`;

            requestAnimationFrame(updateLogo);
        }

        updateLogo();

        // Tap to bounce
        stickyLogo.style.pointerEvents = 'auto';
        let taps = 0;
        stickyLogo.addEventListener('pointerdown', () => {
            taps++;
            stickyInner.style.transition = 'transform .7s cubic-bezier(0.34,1.56,0.64,1)';
            stickyInner.style.transform = `rotateY(${taps * 360}deg) rotateX(15deg) scale(1.3)`;
            setTimeout(() => { stickyInner.style.transition = 'none'; }, 800);
        });
    }


    // === MENU TABS ===
    const tabs = document.querySelectorAll('.tab');
    const cards = document.querySelectorAll('.m-card');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.dataset.cat;
            cards.forEach((c, i) => {
                const show = cat === 'all' || c.dataset.cat === cat;
                c.style.display = show ? 'block' : 'none';
                if (show) {
                    c.style.opacity = '0';
                    c.style.transform = 'translateY(16px)';
                    setTimeout(() => { c.style.transition = 'all .35s ease'; c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, i * 40);
                }
            });
        });
    });

    // === SCROLL REVEAL ===
    const revealEls = document.querySelectorAll('.f-card, .m-card, .g-item, .stat, .c-card, .o-item');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; }, i * 50);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    revealEls.forEach(el => { el.style.opacity='0'; el.style.transform='translateY(20px)'; el.style.transition='all .5s var(--ease)'; obs.observe(el); });

    // === ACTIVE NAV ===
    const navItems = document.querySelectorAll('.nav-links a');
    const secObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navItems.forEach(a => a.classList.remove('active'));
                document.querySelector(`.nav-links a[href="#${e.target.id}"]`)?.classList.add('active');
            }
        });
    }, { threshold: 0.3 });
    sections.forEach(s => secObs.observe(s));
});

// === ORDER FUNCTIONS ===
function changeQty(btn, d) {
    const item = btn.closest('.o-item');
    const s = item.querySelector('.o-qty span');
    let q = Math.max(0, parseInt(s.textContent) + d);
    s.textContent = q;
    btn.style.transform = 'scale(1.4)';
    setTimeout(() => btn.style.transform = '', 150);
    updateOrder();
}
function updateOrder() {
    const items = document.querySelectorAll('.o-item');
    const list = document.getElementById('summaryList');
    const total = document.getElementById('totalPrice');
    let sum = 0, html = '';
    items.forEach(item => {
        const q = parseInt(item.querySelector('.o-qty span').textContent);
        if (q > 0) { const n=item.dataset.name, p=parseInt(item.dataset.price)*q; sum+=p; html+=`<div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:.8rem;color:#ccc"><span>${n} x${q}</span><span style="color:var(--gold)">${p.toLocaleString()} د.ج</span></div>`; }
    });
    list.innerHTML = html || '<p class="empty">اختر منتجاً</p>';
    total.textContent = sum.toLocaleString() + ' د.ج';
}
function sendWhatsApp() {
    const items = document.querySelectorAll('.o-item');
    const name=document.getElementById('oName').value, phone=document.getElementById('oPhone').value, addr=document.getElementById('oAddr').value;
    let msg='🛒 *طلب جديد - طربوش كوك*\n\n', total=0, has=false;
    items.forEach(item => { const q=parseInt(item.querySelector('.o-qty span').textContent); if(q>0){has=true;const n=item.dataset.name,p=parseInt(item.dataset.price)*q;total+=p;msg+=`• ${n} x${q} = ${p.toLocaleString()} د.ج\n`;} });
    if(!has){alert('اختر منتج!');return;} if(!name||!phone){alert('أدخل اسمك ورقمك!');return;}
    msg+=`\n💰 *المجموع: ${total.toLocaleString()} د.ج*\n\n👤 ${name}\n📍 ${addr||'-'}\n📞 ${phone}`;
    window.open('https://wa.me/213563753977?text='+encodeURIComponent(msg),'_blank');
}
