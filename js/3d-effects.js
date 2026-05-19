// ===== Three.js 3D Background =====
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('bg3d');
        if (!this.canvas) return;
        
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
        const particleCount = 1500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const goldColor = new THREE.Color(0xD4AF37);
        const greenColor = new THREE.Color(0x4CAF50);
        const whiteColor = new THREE.Color(0xFFFFFF);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

            const colorChoice = Math.random();
            let color;
            if (colorChoice < 0.4) color = goldColor;
            else if (colorChoice < 0.7) color = greenColor;
            else color = whiteColor;

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createGeometricShapes() {
        // Floating golden diamonds
        for (let i = 0; i < 8; i++) {
            const geometry = new THREE.OctahedronGeometry(Math.random() * 1.5 + 0.5, 0);
            const material = new THREE.MeshPhongMaterial({
                color: i % 2 === 0 ? 0xD4AF37 : 0x1B5E20,
                transparent: true,
                opacity: 0.3,
                wireframe: true
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 20
            );
            mesh.userData = {
                rotationSpeed: { x: Math.random() * 0.02, y: Math.random() * 0.02, z: Math.random() * 0.01 },
                floatSpeed: Math.random() * 0.5 + 0.2,
                floatOffset: Math.random() * Math.PI * 2
            };
            this.geometricShapes.push(mesh);
            this.scene.add(mesh);
        }

        // Add torus knots
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 64, 8);
            const material = new THREE.MeshPhongMaterial({
                color: 0xD4AF37,
                transparent: true,
                opacity: 0.15,
                wireframe: true
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                -10 - Math.random() * 10
            );
            mesh.userData = {
                rotationSpeed: { x: Math.random() * 0.005, y: Math.random() * 0.008, z: Math.random() * 0.003 },
                floatSpeed: Math.random() * 0.3,
                floatOffset: Math.random() * Math.PI * 2
            };
            this.geometricShapes.push(mesh);
            this.scene.add(mesh);
        }
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0xD4AF37, 1, 50);
        pointLight1.position.set(10, 10, 10);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x4CAF50, 0.8, 50);
        pointLight2.position.set(-10, -10, 10);
        this.scene.add(pointLight2);
    }

    addEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.01;

        // Rotate particles
        if (this.particles) {
            this.particles.rotation.x += 0.0003;
            this.particles.rotation.y += 0.0005;
            
            // Mouse interaction
            this.particles.rotation.x += this.mouse.y * 0.0003;
            this.particles.rotation.y += this.mouse.x * 0.0003;
        }

        // Animate geometric shapes
        this.geometricShapes.forEach(shape => {
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.rotation.z += shape.userData.rotationSpeed.z;
            shape.position.y += Math.sin(this.time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.02;
        });

        // Camera subtle movement
        this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.02;
        this.camera.position.y += (this.mouse.y * 2 - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }
}

// ===== 3D Card Tilt Effect =====
class Card3D {
    constructor(element) {
        this.element = element;
        this.maxTilt = 15;
        this.perspective = 1000;
        this.scale = 1.05;
        
        this.element.style.transform = `perspective(${this.perspective}px)`;
        this.addEventListeners();
    }

    addEventListeners() {
        this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.element.addEventListener('mouseleave', () => this.onMouseLeave());
        this.element.addEventListener('mouseenter', () => this.onMouseEnter());
    }

    onMouseMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -this.maxTilt;
        const rotateY = ((x - centerX) / centerX) * this.maxTilt;

        this.element.style.transform = `
            perspective(${this.perspective}px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            scale3d(${this.scale}, ${this.scale}, ${this.scale})
        `;

        // Move glow
        const glow = this.element.querySelector('.card-glow');
        if (glow) {
            glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212, 175, 55, 0.3), transparent 60%)`;
        }
    }

    onMouseLeave() {
        this.element.style.transform = `perspective(${this.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        this.element.style.transition = 'transform 0.5s ease';
        
        const glow = this.element.querySelector('.card-glow');
        if (glow) glow.style.background = 'none';
    }

    onMouseEnter() {
        this.element.style.transition = 'none';
    }
}

// ===== Parallax Effect =====
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.onScroll());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onScroll() {
        const scrollY = window.pageYOffset;
        this.elements.forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }

    onMouseMove(e) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        this.elements.forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            el.style.transform += ` translate(${x * 10 * speed}px, ${y * 10 * speed}px)`;
        });
    }
}

// ===== Scroll Reveal Animation =====
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.card-3d, .product-card, .reveal-text');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        this.elements.forEach(el => {
            el.classList.add('scroll-hidden');
            observer.observe(el);
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
        document.addEventListener('mousemove', (e) => {
            this.pos.x = e.clientX;
            this.pos.y = e.clientY;
            this.cursor.style.left = this.pos.x + 'px';
            this.cursor.style.top = this.pos.y + 'px';
        });

        this.animateFollower();

        // Scale on hover
        document.querySelectorAll('a, button, .card-3d, .product-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('cursor-hover');
                this.follower.classList.add('follower-hover');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('cursor-hover');
                this.follower.classList.remove('follower-hover');
            });
        });
    }

    animateFollower() {
        this.followerPos.x += (this.pos.x - this.followerPos.x) * 0.1;
        this.followerPos.y += (this.pos.y - this.followerPos.y) * 0.1;
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
                this.screen.classList.add('loaded');
                document.body.classList.add('page-loaded');
                setTimeout(() => this.screen.remove(), 1000);
            }, 1500);
        });
    }
}

// ===== Magnetic Buttons =====
class MagneticButton {
    constructor(element) {
        this.element = element;
        this.strength = 30;
        this.init();
    }

    init() {
        this.element.addEventListener('mousemove', (e) => {
            const rect = this.element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.element.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        this.element.addEventListener('mouseleave', () => {
            this.element.style.transform = 'translate(0, 0)';
            this.element.style.transition = 'transform 0.5s ease';
        });

        this.element.addEventListener('mouseenter', () => {
            this.element.style.transition = 'none';
        });
    }
}

// ===== Text Scramble Effect =====
class TextScramble {
    constructor(element) {
        this.element = element;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.originalText = element.textContent;
    }

    animate() {
        const length = this.originalText.length;
        let iteration = 0;
        
        const interval = setInterval(() => {
            this.element.textContent = this.originalText
                .split('')
                .map((char, index) => {
                    if (index < iteration) return this.originalText[index];
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                })
                .join('');
            
            iteration += 1/3;
            if (iteration >= length) clearInterval(interval);
        }, 30);
    }
}

// ===== Initialize All Effects =====
document.addEventListener('DOMContentLoaded', () => {
    // Loading Screen
    new LoadingScreen();

    // 3D Background
    new ParticleBackground();

    // 3D Cards
    document.querySelectorAll('[data-tilt]').forEach(el => new Card3D(el));

    // Parallax
    new ParallaxEffect();

    // Scroll Reveal
    new ScrollReveal();

    // Custom Cursor (only on desktop)
    if (window.innerWidth > 768) {
        new CustomCursor();
    }

    // Magnetic Buttons
    document.querySelectorAll('.btn-glow').forEach(el => new MagneticButton(el));

    // Text Scramble on hover for section titles
    document.querySelectorAll('.section-title').forEach(el => {
        const scramble = new TextScramble(el);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    scramble.animate();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(el);
    });
});
