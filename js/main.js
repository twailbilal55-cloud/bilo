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


    // === STICKY 3D LOGO - TRAVELS BETWEEN SECTIONS ===
    const stickyLogo = document.getElementById('stickyLogo');
    const stickyInner = document.getElementById('stickyLogoInner');
    const sections = document.querySelectorAll('.section');

    if (stickyLogo && stickyInner) {
        // Logo positions for each section (where it should be)
        // Format: { top%, left%, size(px) }
        const isMobile = () => window.innerWidth < 768;

        function getLogoTarget(scrollProgress) {
            // scrollProgress: 0 = top of page, 1 = bottom
            const numSections = sections.length;
            const sectionIndex = Math.floor(scrollProgress * numSections);
            const sectionProgress = (scrollProgress * numSections) - sectionIndex;

            // Alternate left positions for each section
            const positions = isMobile() 
                ? [
                    { top: 20, left: 50, size: 70 },  // hero: center top
                    { top: 15, left: 15, size: 50 },  // features: top left
                    { top: 15, left: 85, size: 50 },  // menu: top right
                    { top: 15, left: 15, size: 50 },  // about: top left
                    { top: 15, left: 85, size: 50 },  // gallery: top right
                    { top: 15, left: 15, size: 50 },  // order: top left
                    { top: 15, left: 85, size: 50 },  // contact: top right
                ]
                : [
                    { top: 40, left: 65, size: 160 },  // hero: right-center (big)
                    { top: 50, left: 8, size: 90 },    // features: left
                    { top: 50, left: 92, size: 90 },   // menu: right
                    { top: 50, left: 8, size: 90 },    // about: left
                    { top: 50, left: 92, size: 90 },   // gallery: right
                    { top: 50, left: 8, size: 90 },    // order: left
                    { top: 50, left: 92, size: 90 },   // contact: right
                ];

            const currentIdx = Math.min(sectionIndex, positions.length - 1);
            const nextIdx = Math.min(currentIdx + 1, positions.length - 1);
            const current = positions[currentIdx];
            const next = positions[nextIdx];

            // Interpolate between positions
            const t = sectionProgress;
            // Scale UP in middle of transition (peak at t=0.5)
            const scaleBump = Math.sin(t * Math.PI) * 0.4; // 0 → 0.4 → 0

            return {
                top: current.top + (next.top - current.top) * t,
                left: current.left + (next.left - current.left) * t,
                size: (current.size + (next.size - current.size) * t) * (1 + scaleBump),
                tiltX: Math.sin(t * Math.PI) * 12, // tilt during movement only
            };
        }

        let animFrame;
        let currentTop = 40, currentLeft = 65, currentSize = 160, currentTilt = 0;

        function updateLogo() {
            const scrollY = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.max(0, Math.min(1, scrollY / Math.max(docHeight, 1)));

            const target = getLogoTarget(progress);

            // Smooth interpolation (lerp)
            currentTop += (target.top - currentTop) * 0.08;
            currentLeft += (target.left - currentLeft) * 0.08;
            currentSize += (target.size - currentSize) * 0.08;
            currentTilt += (target.tiltX - currentTilt) * 0.1;

            stickyLogo.style.top = currentTop + '%';
            stickyLogo.style.left = currentLeft + '%';
            stickyLogo.style.width = currentSize + 'px';
            stickyLogo.style.height = currentSize + 'px';
            stickyLogo.style.transform = `translate(-50%, -50%)`;

            // Face always forward! Only tilt on X axis (nod), never flip Y
            stickyInner.style.transform = `rotateX(${currentTilt}deg) rotateZ(${currentTilt * 0.3}deg)`;

            animFrame = requestAnimationFrame(updateLogo);
        }

        updateLogo();

        // Touch: tap to bounce
        stickyLogo.style.pointerEvents = 'auto';
        let tapCount = 0;
        stickyLogo.addEventListener('pointerdown', () => {
            tapCount++;
            stickyInner.style.transition = 'transform .6s cubic-bezier(0.34,1.56,0.64,1)';
            stickyInner.style.transform = `rotateX(${tapCount % 2 === 0 ? -20 : 20}deg) scale(1.3)`;
            setTimeout(() => {
                stickyInner.style.transition = 'none';
            }, 700);
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
