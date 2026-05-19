// ===== Three.js 3D Background =====
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('bg3d');
        if (!this.canvas || typeof THREE === 'undefined') return;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
        this.particles = null;
        this.geometricShapes = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        this.init();
    }
    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 30;
        this.createParticles();
        this.createGeometricShapes();
        this.createLights();
        this.addEventListeners();
        this.animate();
    }
    createParticles() {
        const count = 2000;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const cols = new Float32Array(count * 3);
        const gold = new THREE.Color(0xD4AF37);
        const green = new THREE.Color(0x4CAF50);
        const white = new THREE.Color(0xFFFFFF);
        for (let i = 0; i < count; i++) {
            pos[i*3] = (Math.random()-0.5)*120;
            pos[i*3+1] = (Math.random()-0.5)*120;
            pos[i*3+2] = (Math.random()-0.5)*60;
            const r = Math.random();
            const c = r < 0.4 ? gold : r < 0.7 ? green : white;
            cols[i*3] = c.r; cols[i*3+1] = c.g; cols[i*3+2] = c.b;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
        const mat = new THREE.PointsMaterial({ size: 0.12, vertexColors: true, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending });
        this.particles = new THREE.Points(geo, mat);
        this.scene.add(this.particles);
    }
    createGeometricShapes() {
        for (let i = 0; i < 10; i++) {
            const geo = new THREE.OctahedronGeometry(Math.random()*2+0.5, 0);
            const mat = new THREE.MeshPhongMaterial({ color: i%2===0 ? 0xD4AF37 : 0x1B5E20, transparent: true, opacity: 0.25, wireframe: true });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set((Math.random()-0.5)*50, (Math.random()-0.5)*50, (Math.random()-0.5)*25);
            mesh.userData = { rs: { x: Math.random()*0.015, y: Math.random()*0.02, z: Math.random()*0.01 }, fs: Math.random()*0.4+0.2, fo: Math.random()*Math.PI*2 };
            this.geometricShapes.push(mesh);
            this.scene.add(mesh);
        }
        for (let i = 0; i < 4; i++) {
            const geo = new THREE.TorusKnotGeometry(1.2, 0.35, 64, 8);
            const mat = new THREE.MeshPhongMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.12, wireframe: true });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set((Math.random()-0.5)*60, (Math.random()-0.5)*60, -15-Math.random()*10);
            mesh.userData = { rs: { x: Math.random()*0.004, y: Math.random()*0.006, z: Math.random()*0.003 }, fs: Math.random()*0.25, fo: Math.random()*Math.PI*2 };
            this.geometricShapes.push(mesh);
            this.scene.add(mesh);
        }
    }
    createLights() {
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const p1 = new THREE.PointLight(0xD4AF37, 1.2, 60); p1.position.set(15, 15, 15); this.scene.add(p1);
        const p2 = new THREE.PointLight(0x4CAF50, 0.9, 60); p2.position.set(-15, -15, 10); this.scene.add(p2);
    }
    addEventListeners() {
        window.addEventListener('mousemove', e => { this.mouse.x = (e.clientX/window.innerWidth)*2-1; this.mouse.y = -(e.clientY/window.innerHeight)*2+1; });
        window.addEventListener('resize', () => { this.camera.aspect = window.innerWidth/window.innerHeight; this.camera.updateProjectionMatrix(); this.renderer.setSize(window.innerWidth, window.innerHeight); });
    }
    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.008;
        if (this.particles) {
            this.particles.rotation.x += 0.0002; this.particles.rotation.y += 0.0004;
            this.particles.rotation.x += this.mouse.y * 0.0002;
            this.particles.rotation.y += this.mouse.x * 0.0002;
        }
        this.geometricShapes.forEach(s => {
            s.rotation.x += s.userData.rs.x; s.rotation.y += s.userData.rs.y; s.rotation.z += s.userData.rs.z;
            s.position.y += Math.sin(this.time * s.userData.fs + s.userData.fo) * 0.015;
        });
        this.camera.position.x += (this.mouse.x*3 - this.camera.position.x)*0.015;
        this.camera.position.y += (this.mouse.y*3 - this.camera.position.y)*0.015;
        this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);
    }
}

// ===== GSAP Cinematic Scroll Animations =====
class GSAPAnimations {
    constructor() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);
        this.initHeroAnimations();
        this.initSectionAnimations();
        this.initProductAnimations();
        this.initFeatureAnimations();
        this.initFooterAnimations();
        this.initParallaxSections();
        this.initNavbarAnimation();
    }

    initHeroAnimations() {
        const heroContent = document.querySelector('.hero-content');
        if (!heroContent) return;

        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.from('.hero-content h1', { y: 100, opacity: 0, duration: 1.2, delay: 1.8 })
          .from('.hero-content p', { y: 60, opacity: 0, duration: 1 }, '-=0.6')
          .from('.hero .btn', { y: 40, opacity: 0, scale: 0.8, duration: 0.8 }, '-=0.5')
          .from('.scroll-indicator', { y: 30, opacity: 0, duration: 0.6 }, '-=0.3');
    }

    initSectionAnimations() {
        // Categories cinematic entrance
        gsap.from('.categories .section-title', {
            scrollTrigger: { trigger: '.categories', start: 'top 80%', toggleActions: 'play none none reverse' },
            y: 80, opacity: 0, duration: 1, ease: 'power3.out'
        });

        gsap.from('.category-card', {
            scrollTrigger: { trigger: '.categories-grid', start: 'top 75%', toggleActions: 'play none none reverse' },
            y: 100, opacity: 0, rotateY: 15, scale: 0.8, duration: 0.8, stagger: { amount: 0.6, from: 'start' }, ease: 'back.out(1.7)'
        });
    }

    initProductAnimations() {
        // Products section title
        gsap.from('.products .section-title', {
            scrollTrigger: { trigger: '.products', start: 'top 80%', toggleActions: 'play none none reverse' },
            y: 80, opacity: 0, duration: 1, ease: 'power3.out'
        });

        // Product cards - cinematic stagger with 3D rotation
        ScrollTrigger.batch('.product-card', {
            onEnter: batch => gsap.from(batch, {
                y: 120, opacity: 0, rotateX: -15, scale: 0.85, duration: 1,
                stagger: 0.15, ease: 'power3.out', clearProps: 'all'
            }),
            start: 'top 85%'
        });
    }

    initFeatureAnimations() {
        gsap.from('.feature-card', {
            scrollTrigger: { trigger: '.features-grid', start: 'top 75%', toggleActions: 'play none none reverse' },
            y: 80, opacity: 0, rotateY: -10, scale: 0.9, duration: 0.9,
            stagger: { amount: 0.8, from: 'center' }, ease: 'elastic.out(1, 0.8)'
        });

        // Icon ring pulse animation
        gsap.from('.feature-icon-wrapper', {
            scrollTrigger: { trigger: '.features-grid', start: 'top 70%' },
            scale: 0, rotation: 180, duration: 1, stagger: 0.2, ease: 'back.out(2)'
        });
    }

    initFooterAnimations() {
        gsap.from('.footer-col', {
            scrollTrigger: { trigger: '.footer', start: 'top 85%', toggleActions: 'play none none reverse' },
            y: 60, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out'
        });

        gsap.from('.social-links a', {
            scrollTrigger: { trigger: '.social-links', start: 'top 90%' },
            scale: 0, rotation: 360, duration: 0.6, stagger: 0.1, ease: 'back.out(3)'
        });
    }

    initParallaxSections() {
        // Parallax background movement on sections
        gsap.to('.categories', {
            scrollTrigger: { trigger: '.categories', start: 'top bottom', end: 'bottom top', scrub: 1 },
            backgroundPositionY: '50%'
        });

        // Category icons floating parallax
        document.querySelectorAll('.category-icon').forEach((icon, i) => {
            gsap.to(icon, {
                scrollTrigger: { trigger: icon, start: 'top bottom', end: 'bottom top', scrub: 1 },
                y: -30 * (i % 2 === 0 ? 1 : -1), rotation: 10 * (i % 2 === 0 ? 1 : -1)
            });
        });
    }

    initNavbarAnimation() {
        // Navbar shrink on scroll
        ScrollTrigger.create({
            start: 'top -80',
            end: 99999,
            toggleClass: { className: 'navbar--scrolled', targets: '.navbar' }
        });
    }
}

// ===== Vanilla Tilt 3D Cards =====
class VanillaTiltInit {
    constructor() {
        if (typeof VanillaTilt === 'undefined') return;
        this.initCategoryCards();
        this.initProductCards();
        this.initFeatureCards();
    }

    initCategoryCards() {
        VanillaTilt.init(document.querySelectorAll('.category-card'), {
            max: 20, speed: 400, glare: true, 'max-glare': 0.3,
            perspective: 1000, scale: 1.05, gyroscope: true
        });
    }

    initProductCards() {
        // Will be called after products render
        setTimeout(() => {
            VanillaTilt.init(document.querySelectorAll('.product-card'), {
                max: 12, speed: 300, glare: true, 'max-glare': 0.2,
                perspective: 1200, scale: 1.03, gyroscope: true
            });
        }, 500);
    }

    initFeatureCards() {
        VanillaTilt.init(document.querySelectorAll('.feature-card'), {
            max: 15, speed: 400, glare: true, 'max-glare': 0.25,
            perspective: 1000, scale: 1.04, gyroscope: true
        });
    }
}

// ===== Custom Cursor =====
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.follower = document.querySelector('.cursor-follower');
        if (!this.cursor || !this.follower) return;
        this.pos = { x: 0, y: 0 };
        this.followerPos = { x: 0, y: 0 };
        this.init();
    }
    init() {
        document.addEventListener('mousemove', e => {
            this.pos.x = e.clientX; this.pos.y = e.clientY;
            this.cursor.style.left = this.pos.x + 'px';
            this.cursor.style.top = this.pos.y + 'px';
        });
        this.animateFollower();
        document.querySelectorAll('a, button, .category-card, .product-card, .feature-card').forEach(el => {
            el.addEventListener('mouseenter', () => { this.cursor.classList.add('cursor-hover'); this.follower.classList.add('follower-hover'); });
            el.addEventListener('mouseleave', () => { this.cursor.classList.remove('cursor-hover'); this.follower.classList.remove('follower-hover'); });
        });
    }
    animateFollower() {
        this.followerPos.x += (this.pos.x - this.followerPos.x) * 0.08;
        this.followerPos.y += (this.pos.y - this.followerPos.y) * 0.08;
        this.follower.style.left = this.followerPos.x + 'px';
        this.follower.style.top = this.followerPos.y + 'px';
        requestAnimationFrame(() => this.animateFollower());
    }
}

// ===== Loading Screen =====
class LoadingScreen {
    constructor() {
        this.screen = document.getElementById('loadingScreen');
        if (!this.screen) return;
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(this.screen, { opacity: 0, duration: 0.8, ease: 'power2.inOut', onComplete: () => this.screen.remove() });
                } else {
                    this.screen.classList.add('loaded');
                    setTimeout(() => this.screen.remove(), 1000);
                }
            }, 1500);
        });
    }
}

// ===== Magnetic Buttons with GSAP =====
class MagneticButton {
    constructor(element) {
        this.el = element;
        this.el.addEventListener('mousemove', e => {
            const rect = this.el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width/2;
            const y = e.clientY - rect.top - rect.height/2;
            if (typeof gsap !== 'undefined') {
                gsap.to(this.el, { x: x*0.3, y: y*0.3, duration: 0.3, ease: 'power2.out' });
            }
        });
        this.el.addEventListener('mouseleave', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(this.el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
            }
        });
    }
}

// ===== Text Reveal Animation =====
class TextReveal {
    constructor() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        document.querySelectorAll('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: { trigger: title, start: 'top 85%' },
                clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'power4.inOut'
            });
        });
    }
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    new LoadingScreen();
    new ParticleBackground();
    new GSAPAnimations();
    new VanillaTiltInit();
    if (window.innerWidth > 768) new CustomCursor();
    document.querySelectorAll('.btn-glow').forEach(el => new MagneticButton(el));
});
