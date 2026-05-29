/* ===========================================================
   CITTA. — Three.js 3D Scenes
   Hero: floating 3D anchor + particle starfield + ocean shader
   Story: rotating geometric cluster
   Product: 3D rotating product card
   =========================================================== */

(function () {
    if (typeof THREE === 'undefined') return;

    // ===== HERO SCENE =====
    function initHeroScene() {
        const canvas = document.getElementById('three-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.05);

        const camera = new THREE.PerspectiveCamera(
            55,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 8);

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        // ===== Lighting =====
        const ambient = new THREE.AmbientLight(0x222244, 0.6);
        scene.add(ambient);

        const cyanLight = new THREE.PointLight(0x00CED1, 8, 50);
        cyanLight.position.set(-5, 3, 4);
        scene.add(cyanLight);

        const limeLight = new THREE.PointLight(0x32CD32, 6, 50);
        limeLight.position.set(5, -2, 4);
        scene.add(limeLight);

        const whiteLight = new THREE.DirectionalLight(0xffffff, 0.8);
        whiteLight.position.set(0, 5, 5);
        scene.add(whiteLight);

        // ===== ANCHOR (procedurally built) =====
        const anchorGroup = new THREE.Group();

        const metalMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.95,
            roughness: 0.15,
            envMapIntensity: 1.2
        });

        // Top ring
        const ringGeo = new THREE.TorusGeometry(0.45, 0.09, 16, 48);
        const topRing = new THREE.Mesh(ringGeo, metalMat);
        topRing.position.y = 1.7;
        anchorGroup.add(topRing);

        // Vertical shaft
        const shaftGeo = new THREE.CylinderGeometry(0.11, 0.11, 2.6, 24);
        const shaft = new THREE.Mesh(shaftGeo, metalMat);
        shaft.position.y = 0.3;
        anchorGroup.add(shaft);

        // Cross-bar (stock)
        const stockGeo = new THREE.BoxGeometry(2, 0.18, 0.18);
        const stock = new THREE.Mesh(stockGeo, metalMat);
        stock.position.y = 1.3;
        anchorGroup.add(stock);

        // Bottom curve (arms) — using torus segment
        const armGeo = new THREE.TorusGeometry(0.95, 0.13, 16, 48, Math.PI);
        const arm = new THREE.Mesh(armGeo, metalMat);
        arm.position.y = -1.0;
        arm.rotation.z = Math.PI;
        anchorGroup.add(arm);

        // Flukes (pointed tips) — cones
        const flukeGeo = new THREE.ConeGeometry(0.22, 0.5, 16);
        const flukeL = new THREE.Mesh(flukeGeo, metalMat);
        flukeL.position.set(-0.95, -0.78, 0);
        flukeL.rotation.z = -Math.PI / 4;
        anchorGroup.add(flukeL);

        const flukeR = new THREE.Mesh(flukeGeo, metalMat);
        flukeR.position.set(0.95, -0.78, 0);
        flukeR.rotation.z = Math.PI / 4;
        anchorGroup.add(flukeR);

        // Tip (bottom point)
        const tipGeo = new THREE.ConeGeometry(0.14, 0.35, 16);
        const tip = new THREE.Mesh(tipGeo, metalMat);
        tip.position.y = -1.15;
        tip.rotation.x = Math.PI;
        anchorGroup.add(tip);

        anchorGroup.scale.set(0.85, 0.85, 0.85);
        anchorGroup.position.set(0, 0, 0);
        scene.add(anchorGroup);

        // ===== Glowing ring around anchor (brand ring) =====
        const ringOuterGeo = new THREE.TorusGeometry(2.4, 0.04, 16, 100);
        const ringOuterMat = new THREE.MeshBasicMaterial({
            color: 0x00CED1,
            transparent: true,
            opacity: 0.6
        });
        const outerRing = new THREE.Mesh(ringOuterGeo, ringOuterMat);
        outerRing.rotation.x = Math.PI / 3;
        scene.add(outerRing);

        const ringOuter2Geo = new THREE.TorusGeometry(2.7, 0.02, 16, 100);
        const ringOuter2Mat = new THREE.MeshBasicMaterial({
            color: 0x32CD32,
            transparent: true,
            opacity: 0.5
        });
        const outerRing2 = new THREE.Mesh(ringOuter2Geo, ringOuter2Mat);
        outerRing2.rotation.x = -Math.PI / 4;
        outerRing2.rotation.y = Math.PI / 6;
        scene.add(outerRing2);

        // ===== PARTICLE STARFIELD =====
        const particleCount = 1500;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const cyan = new THREE.Color(0x00CED1);
        const lime = new THREE.Color(0x32CD32);
        const white = new THREE.Color(0xffffff);

        for (let i = 0; i < particleCount; i++) {
            const radius = 6 + Math.random() * 30;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi) - 5;

            const c = Math.random();
            const color = c < 0.4 ? cyan : c < 0.7 ? lime : white;
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 0.05 + 0.01;
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const particleMat = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            depthWrite: false
        });

        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // ===== OCEAN-LIKE SHADER PLANE (bottom) =====
        const oceanGeo = new THREE.PlaneGeometry(60, 60, 80, 80);
        const oceanMat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColorA: { value: new THREE.Color(0x000a14) },
                uColorB: { value: new THREE.Color(0x00CED1) }
            },
            vertexShader: `
                uniform float uTime;
                varying vec2 vUv;
                varying float vElevation;

                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    float elev = sin(pos.x * 0.5 + uTime * 0.6) * 0.3
                               + sin(pos.y * 0.7 + uTime * 0.4) * 0.25
                               + sin((pos.x + pos.y) * 0.3 + uTime * 0.3) * 0.15;
                    pos.z += elev;
                    vElevation = elev;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 uColorA;
                uniform vec3 uColorB;
                varying vec2 vUv;
                varying float vElevation;

                void main() {
                    float mixStrength = (vElevation + 0.6) * 0.5;
                    vec3 color = mix(uColorA, uColorB, mixStrength);
                    float fade = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
                    gl_FragColor = vec4(color, fade * 0.5);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        const ocean = new THREE.Mesh(oceanGeo, oceanMat);
        ocean.rotation.x = -Math.PI / 2.2;
        ocean.position.y = -6;
        scene.add(ocean);

        // ===== Mouse parallax =====
        const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
        window.addEventListener('mousemove', (e) => {
            mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        // ===== Scroll-driven camera =====
        let scrollY = 0;
        window.addEventListener('scroll', () => { scrollY = window.scrollY; });

        // ===== Resize =====
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // ===== Animate =====
        const clock = new THREE.Clock();
        function animate() {
            const t = clock.getElapsedTime();

            // smooth mouse
            mouse.x += (mouse.tx - mouse.x) * 0.05;
            mouse.y += (mouse.ty - mouse.y) * 0.05;

            // anchor float + rotate
            anchorGroup.rotation.y = t * 0.4 + mouse.x * 0.3;
            anchorGroup.rotation.x = Math.sin(t * 0.5) * 0.1 + mouse.y * 0.15;
            anchorGroup.position.y = Math.sin(t * 0.8) * 0.2;

            // rings counter-rotate
            outerRing.rotation.z = t * 0.3;
            outerRing.rotation.x = Math.PI / 3 + Math.sin(t * 0.4) * 0.2;
            outerRing2.rotation.z = -t * 0.4;
            outerRing2.rotation.y = Math.PI / 6 + Math.cos(t * 0.3) * 0.15;

            // particles slow rotation
            particles.rotation.y = t * 0.02;
            particles.rotation.x = mouse.y * 0.1;

            // ocean shader
            oceanMat.uniforms.uTime.value = t;

            // camera scroll dolly
            const scrollProgress = Math.min(scrollY / window.innerHeight, 1);
            camera.position.z = 8 + scrollProgress * 4;
            camera.position.y = -scrollProgress * 2;

            // light positions sway
            cyanLight.position.x = Math.sin(t * 0.6) * 5;
            limeLight.position.x = Math.cos(t * 0.6) * 5;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ===== STORY SCENE — 3D logo cluster =====
    function initStoryScene() {
        const canvas = document.getElementById('story-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });
        const size = canvas.parentElement.clientWidth;
        renderer.setSize(size, size);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        scene.add(new THREE.AmbientLight(0x404060, 0.5));
        const p1 = new THREE.PointLight(0x00CED1, 5, 20); p1.position.set(-3, 2, 3); scene.add(p1);
        const p2 = new THREE.PointLight(0x32CD32, 4, 20); p2.position.set(3, -2, 3); scene.add(p2);

        // Wireframe icosahedron
        const ico = new THREE.IcosahedronGeometry(1.5, 1);
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0x00CED1,
            wireframe: true,
            transparent: true,
            opacity: 0.5
        });
        const icoMesh = new THREE.Mesh(ico, wireMat);
        scene.add(icoMesh);

        // Inner glowing core
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x00CED1,
            emissiveIntensity: 0.3
        });
        const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 0), coreMat);
        scene.add(core);

        // Orbiting rings
        const ring1 = new THREE.Mesh(
            new THREE.TorusGeometry(2, 0.02, 16, 100),
            new THREE.MeshBasicMaterial({ color: 0x32CD32, transparent: true, opacity: 0.7 })
        );
        scene.add(ring1);

        const ring2 = new THREE.Mesh(
            new THREE.TorusGeometry(2.3, 0.015, 16, 100),
            new THREE.MeshBasicMaterial({ color: 0x00CED1, transparent: true, opacity: 0.6 })
        );
        scene.add(ring2);

        // Resize
        const ro = new ResizeObserver(() => {
            const s = canvas.parentElement.clientWidth;
            renderer.setSize(s, s);
            camera.aspect = 1;
            camera.updateProjectionMatrix();
        });
        ro.observe(canvas.parentElement);

        const clock = new THREE.Clock();
        function loop() {
            const t = clock.getElapsedTime();
            icoMesh.rotation.x = t * 0.3;
            icoMesh.rotation.y = t * 0.4;
            core.rotation.y = -t * 0.6;
            core.rotation.x = t * 0.4;
            ring1.rotation.x = t * 0.5;
            ring1.rotation.y = t * 0.3;
            ring2.rotation.x = -t * 0.4;
            ring2.rotation.z = t * 0.3;
            renderer.render(scene, camera);
            requestAnimationFrame(loop);
        }
        loop();
    }

    // ===== PRODUCT 3D VIEWER =====
    function initProductViewer() {
        const canvas = document.getElementById('product-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0, 6);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        const size = canvas.parentElement.clientWidth;
        renderer.setSize(size, size);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        scene.add(new THREE.AmbientLight(0x404060, 0.7));
        const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(3, 4, 5); scene.add(key);
        const fill = new THREE.PointLight(0x00CED1, 3, 20); fill.position.set(-3, 0, 3); scene.add(fill);
        const rim = new THREE.PointLight(0x32CD32, 2, 20); rim.position.set(2, -3, -3); scene.add(rim);

        // T-shirt-ish silhouette (procedural box stack)
        const group = new THREE.Group();

        const fabric = new THREE.MeshStandardMaterial({
            color: 0x111114,
            metalness: 0.2,
            roughness: 0.7,
            emissive: 0x000000
        });

        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 0.4), fabric);
        body.position.y = -0.3;
        group.add(body);

        // Sleeves
        const sleeveL = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.4), fabric);
        sleeveL.position.set(-1.6, 0.6, 0);
        sleeveL.rotation.z = Math.PI / 8;
        group.add(sleeveL);

        const sleeveR = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.4), fabric);
        sleeveR.position.set(1.6, 0.6, 0);
        sleeveR.rotation.z = -Math.PI / 8;
        group.add(sleeveR);

        // Neckline (small ring)
        const neck = new THREE.Mesh(
            new THREE.TorusGeometry(0.35, 0.06, 12, 32),
            new THREE.MeshStandardMaterial({ color: 0x222226, metalness: 0.2, roughness: 0.6 })
        );
        neck.position.set(0, 1.0, 0.2);
        neck.rotation.x = Math.PI / 2;
        group.add(neck);

        // Brand badge (cyan circle on chest)
        const badge = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.18, 0.05, 32),
            new THREE.MeshStandardMaterial({
                color: 0x00CED1,
                emissive: 0x00CED1,
                emissiveIntensity: 0.4,
                metalness: 0.5,
                roughness: 0.3
            })
        );
        badge.position.set(0.5, 0.3, 0.22);
        badge.rotation.x = Math.PI / 2;
        group.add(badge);

        scene.add(group);

        // Backdrop circle
        const backdrop = new THREE.Mesh(
            new THREE.CircleGeometry(3.5, 64),
            new THREE.MeshBasicMaterial({ color: 0x050507 })
        );
        backdrop.position.z = -2;
        scene.add(backdrop);

        const ringGlow = new THREE.Mesh(
            new THREE.TorusGeometry(3, 0.02, 16, 100),
            new THREE.MeshBasicMaterial({ color: 0x00CED1, transparent: true, opacity: 0.4 })
        );
        scene.add(ringGlow);

        // Drag to rotate
        let isDragging = false, prevX = 0, prevY = 0;
        let rotY = 0, rotX = 0, targetRotY = 0, targetRotX = 0;

        const onDown = (e) => {
            isDragging = true;
            prevX = (e.touches ? e.touches[0].clientX : e.clientX);
            prevY = (e.touches ? e.touches[0].clientY : e.clientY);
        };
        const onMove = (e) => {
            if (!isDragging) return;
            const x = (e.touches ? e.touches[0].clientX : e.clientX);
            const y = (e.touches ? e.touches[0].clientY : e.clientY);
            targetRotY += (x - prevX) * 0.01;
            targetRotX += (y - prevY) * 0.01;
            targetRotX = Math.max(-1, Math.min(1, targetRotX));
            prevX = x; prevY = y;
        };
        const onUp = () => { isDragging = false; };

        canvas.addEventListener('mousedown', onDown);
        canvas.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        canvas.addEventListener('touchstart', onDown);
        canvas.addEventListener('touchmove', onMove);
        window.addEventListener('touchend', onUp);

        const ro = new ResizeObserver(() => {
            const s = canvas.parentElement.clientWidth;
            renderer.setSize(s, s);
        });
        ro.observe(canvas.parentElement);

        const clock = new THREE.Clock();
        function loop() {
            const t = clock.getElapsedTime();
            if (!isDragging) {
                targetRotY += 0.005;
            }
            rotY += (targetRotY - rotY) * 0.08;
            rotX += (targetRotX - rotX) * 0.08;
            group.rotation.y = rotY;
            group.rotation.x = rotX;
            group.position.y = Math.sin(t * 0.8) * 0.08 - 0.3;

            ringGlow.rotation.z = t * 0.3;
            ringGlow.rotation.x = Math.sin(t * 0.5) * 0.5;

            renderer.render(scene, camera);
            requestAnimationFrame(loop);
        }
        loop();
    }

    // Init when DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        initHeroScene();
        initStoryScene();
        initProductViewer();
    });
})();
