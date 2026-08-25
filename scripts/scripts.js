// =======================================================
// FONDO PLEXUS 3D INTERACTIVO (THREE.JS)
// Red neuronal: nodos conectados por líneas, triángulos
// de neón cian/púrpura, cursor con gravedad y parallax
// de cámara al cambiar de sección.
// =======================================================
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || !window.THREE) return;

    const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth < 720;
    const smallMobile = window.innerWidth < 400;

    const renderer = (() => {
        try {
            return new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
        } catch (err) {
            document.body.classList.add('no-webgl');
            return null;
        }
    })();
    if (!renderer) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, smallMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 140);
    cam.position.set(0, 0, 13);
    cam.lookAt(0, 0, -3);

    // ---- PALETA NEÓN: cian, púrpura y magenta ----
    const cCyan = new THREE.Color(0x22d3ee);
    const cPurple = new THREE.Color(0x8b5cf6);
    const cMagenta = new THREE.Color(0xd946ef);
    const cWhite = new THREE.Color(0xffffff);

    // Textura de nodo suave (punto difuminado)
    const texCanvas = document.createElement('canvas');
    texCanvas.width = texCanvas.height = 64;
    const tctx = texCanvas.getContext('2d');
    const grad = tctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.55)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    tctx.fillStyle = grad;
    tctx.fillRect(0, 0, 64, 64);
    const dotTex = new THREE.CanvasTexture(texCanvas);

    // ---- NODOS DE LA RED (Optimizado para alto rendimiento) ----
    const N = smallMobile ? 35 : mobile ? 60 : 100;
    const nodePos = new Float32Array(N * 3);
    const nodeBase = new Float32Array(N * 3);
    const nodeSeed = new Float32Array(N);
    const nodeCol = new Float32Array(N * 3);

    for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        const x = (Math.random() - 0.5) * 30;
        const y = (Math.random() - 0.5) * 18;
        const z = (Math.random() - 0.5) * 14 - 4;
        nodeBase[i3] = x; nodeBase[i3 + 1] = y; nodeBase[i3 + 2] = z;
        nodePos[i3] = x; nodePos[i3 + 1] = y; nodePos[i3 + 2] = z;
        nodeSeed[i] = Math.random() * Math.PI * 2;
        const roll = Math.random();
        const c = roll < 0.34 ? cCyan : roll < 0.62 ? cPurple : roll < 0.8 ? cMagenta : cWhite;
        const bright = 0.55 + Math.random() * 0.45;
        nodeCol[i3] = c.r * bright; nodeCol[i3 + 1] = c.g * bright; nodeCol[i3 + 2] = c.b * bright;
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeCol, 3));
    const nodeMat = new THREE.PointsMaterial({
        size: smallMobile ? 0.18 : 0.22,
        map: dotTex,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodePoints);

    // ---- LÍNEAS DE CONEXIÓN ENTRE NODOS ----
    const MAX_LINES = 1000;
    const linePos = new Float32Array(MAX_LINES * 6);
    const lineCol = new Float32Array(MAX_LINES * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3).setUsage(THREE.DynamicDrawUsage));
    lineGeo.setDrawRange(0, 0);
    const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const lineSegs = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegs);

    // ---- TRIÁNGULOS DE NEÓN FLOTANTES (degradado cian → púrpura → magenta) ----
    const TRI = smallMobile ? 2 : mobile ? 4 : 9;
    const triState = [];
    for (let i = 0; i < TRI; i++) {
        const g = new THREE.BufferGeometry();
        const s = 0.9 + Math.random() * 1.3;
        const off = (Math.random() - 0.5) * s * 0.6;
        const positions = new Float32Array([
            off, -s * 0.55, 0,
            -s * 0.62, s * 0.38, 0,
            s * 0.66, s * 0.34, 0
        ]);
        g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const colors = new Float32Array(9);
        const gradCols = [cCyan, cPurple, cMagenta];
        for (let v = 0; v < 3; v++) {
            const b = 0.55 + Math.random() * 0.4;
            colors[v * 3] = gradCols[v].r * b;
            colors[v * 3 + 1] = gradCols[v].g * b;
            colors[v * 3 + 2] = gradCols[v].b * b;
        }
        g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const m = new THREE.MeshBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.24 + Math.random() * 0.2,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const mesh = new THREE.Mesh(g, m);
        const bx = (Math.random() - 0.5) * 26;
        const by = (Math.random() - 0.5) * 15;
        const bz = -3 - Math.random() * 9;
        mesh.position.set(bx, by, bz);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        scene.add(mesh);
        triState.push({
            mesh: mesh, bx: bx, by: by, bz: bz,
            rotSpeed: 0.12 + Math.random() * 0.3,
            phase: Math.random() * Math.PI * 2,
            floatAmp: 0.5 + Math.random() * 0.8,
            floatSpeed: 0.3 + Math.random() * 0.45,
            baseOpacity: m.opacity
        });
    }

    // ---- NODO FANTASMA DEL CURSOR ----
    const cursorArr = new Float32Array([0, 0, -8]);
    const cursorGeo = new THREE.BufferGeometry();
    cursorGeo.setAttribute('position', new THREE.BufferAttribute(cursorArr, 3));
    const cursorMat = new THREE.PointsMaterial({
        size: 0.6,
        map: dotTex,
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
    });
    const cursorPoints = new THREE.Points(cursorGeo, cursorMat);
    scene.add(cursorPoints);

    // ---- MOUSE / TOUCH ----
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, active: false };
    window.addEventListener('pointermove', (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        pointer.vx = nx - pointer.x;
        pointer.vy = ny - pointer.y;
        pointer.x = nx; pointer.y = ny;
        pointer.active = true;
    });
    window.addEventListener('pointerleave', () => { pointer.active = false; });

    // ---- PARALLAX DE CÁMARA POR SECCIÓN (perspectiva 3D) ----
    const views = {
        inicio:    { x: 0,    y: 0.4,  z: 13,   lx: 0,    ly: 0    },
        servicios: { x: 2.5,  y: -5.0, z: 10.4, lx: 1.6,  ly: 0.9  },
        proyectos: { x: -2.2, y: 5.5,  z: 10.6, lx: -1.5, ly: -1.0 },
        contacto:  { x: 2.9,  y: -6.2, z: 9.8,  lx: 1.9,  ly: 1.3  }
    };
    let view = views.inicio;
    const current = { x: 0, y: 0.4, z: 13, lx: 0, ly: 0 };

    window.particleFormation = (name) => {
        view = views[name] || views.inicio;
    };

    // ---- LÓGICA POR FRAME ----
    const lineThresh = 2.4;
    const lineThresh2 = lineThresh * lineThresh;
    const cursorThresh = 3.6;
    const cursorThresh2 = cursorThresh * cursorThresh;

    function draw(t, dt) {
        // Flotación lenta de los nodos + atracción/repulsión del cursor
        for (let i = 0; i < N; i++) {
            const i3 = i * 3;
            const bx = nodeBase[i3], by = nodeBase[i3 + 1], bz = nodeBase[i3 + 2];
            const tx = bx + Math.sin(t * 0.35 + nodeSeed[i]) * 0.9;
            const ty = by + Math.cos(t * 0.3 + nodeSeed[i] * 1.3) * 0.9;
            const tz = bz + Math.sin(t * 0.25 + nodeSeed[i] * 0.7) * 0.6;
            let px = nodePos[i3], py = nodePos[i3 + 1], pz = nodePos[i3 + 2];
            const k = Math.min(1, dt * 1.8);
            px += (tx - px) * k;
            py += (ty - py) * k;
            pz += (tz - pz) * k;

            if (pointer.active) {
                const wx = pointer.x * 16, wy = pointer.y * 9, wz = -8;
                const dx = px - wx, dy = py - wy, dz = pz - wz;
                const d2 = dx * dx + dy * dy + dz * dz;
                if (d2 > 0.001 && d2 < 12) {
                    const dist = Math.sqrt(d2);
                    const f = (1 - d2 / 12) * dt * 5;
                    const inv = f / dist;
                    px += dx * inv * 1.5;
                    py += dy * inv * 1.5;
                    pz += dz * inv * 1.5;
                } else if (d2 >= 12 && d2 < cursorThresh2 * 2) {
                    const dist = Math.sqrt(d2);
                    const f = (1 - d2 / (cursorThresh2 * 2)) * dt * 1.4;
                    const inv = f / dist;
                    px -= dx * inv;
                    py -= dy * inv;
                    pz -= dz * inv;
                }
            }
            nodePos[i3] = px; nodePos[i3 + 1] = py; nodePos[i3 + 2] = pz;
        }
        nodeGeo.attributes.position.needsUpdate = true;

        // Conexiones nodo ↔ nodo
        let lc = 0;
        for (let i = 0; i < N; i++) {
            const i3 = i * 3;
            const xi = nodePos[i3], yi = nodePos[i3 + 1], zi = nodePos[i3 + 2];
            for (let j = i + 1; j < N; j++) {
                const j3 = j * 3;
                const dx = xi - nodePos[j3], dy = yi - nodePos[j3 + 1], dz = zi - nodePos[j3 + 2];
                const d2 = dx * dx + dy * dy + dz * dz;
                if (d2 < lineThresh2 && lc < MAX_LINES) {
                    const a = 1 - Math.sqrt(d2) / lineThresh;
                    const o = lc * 6;
                    linePos[o] = xi; linePos[o + 1] = yi; linePos[o + 2] = zi;
                    linePos[o + 3] = nodePos[j3]; linePos[o + 4] = nodePos[j3 + 1]; linePos[o + 5] = nodePos[j3 + 2];
                    const b = a * 0.75;
                    lineCol[o] = nodeCol[i3] * b; lineCol[o + 1] = nodeCol[i3 + 1] * b; lineCol[o + 2] = nodeCol[i3 + 2] * b;
                    lineCol[o + 3] = nodeCol[j3] * b; lineCol[o + 4] = nodeCol[j3 + 1] * b; lineCol[o + 5] = nodeCol[j3 + 2] * b;
                    lc++;
                }
            }
        }

        // Conexiones cursor nodos (el cursor actúa como nodo con gravedad)
        if (pointer.active) {
            const wx = pointer.x * 16, wy = pointer.y * 9, wz = -8;
            cursorArr[0] = wx; cursorArr[1] = wy; cursorArr[2] = wz;
            for (let i = 0; i < N && lc < MAX_LINES; i++) {
                const i3 = i * 3;
                const dx = wx - nodePos[i3], dy = wy - nodePos[i3 + 1], dz = wz - nodePos[i3 + 2];
                const d2 = dx * dx + dy * dy + dz * dz;
                if (d2 < cursorThresh2) {
                    const a = 1 - Math.sqrt(d2) / cursorThresh;
                    const o = lc * 6;
                    linePos[o] = wx; linePos[o + 1] = wy; linePos[o + 2] = wz;
                    linePos[o + 3] = nodePos[i3]; linePos[o + 4] = nodePos[i3 + 1]; linePos[o + 5] = nodePos[i3 + 2];
                    const b = a * 0.9;
                    lineCol[o] = 0.55 * b; lineCol[o + 1] = 0.85 * b; lineCol[o + 2] = b;
                    lineCol[o + 3] = nodeCol[i3] * b; lineCol[o + 4] = nodeCol[i3 + 1] * b; lineCol[o + 5] = nodeCol[i3 + 2] * b;
                    lc++;
                }
            }
        } else {
            cursorArr[0] = 999; cursorArr[1] = 999; cursorArr[2] = 999;
        }
        cursorGeo.attributes.position.needsUpdate = true;
        lineGeo.setDrawRange(0, lc);
        lineGeo.attributes.position.needsUpdate = true;
        lineGeo.attributes.color.needsUpdate = true;

        // Triángulos: flotación + rotación + pulso de opacidad
        for (let i = 0; i < TRI; i++) {
            const st = triState[i];
            st.mesh.rotation.x += st.rotSpeed * dt;
            st.mesh.rotation.y += st.rotSpeed * 0.6 * dt;
            st.mesh.position.x = st.bx + Math.sin(t * st.floatSpeed + st.phase) * 1.3;
            st.mesh.position.y = st.by + Math.cos(t * st.floatSpeed * 0.8 + st.phase) * 1.1;
            st.mesh.position.z = st.bz + Math.sin(t * st.floatSpeed * 0.6 + st.phase * 2) * 0.6;
            st.mesh.material.opacity = st.baseOpacity + Math.sin(t * 0.7 + st.phase) * 0.05;
        }

        // Parallax de cámara (transición suave al cambiar de sección)
        const pk = Math.min(1, dt * 3.5);
        current.x += (view.x - current.x) * pk;
        current.y += (view.y - current.y) * pk;
        current.z += (view.z - current.z) * pk;
        current.lx += (view.lx - current.lx) * pk;
        current.ly += (view.ly - current.ly) * pk;

        // Sutil seguimiento del cursor (cámara viva)
        const swayX = pointer.active ? pointer.x * 0.5 : 0;
        const swayY = pointer.active ? pointer.y * 0.3 : 0;
        cam.position.x = current.x + swayX;
        cam.position.y = current.y + swayY;
        cam.position.z = current.z;
        cam.lookAt(current.lx + swayX * 0.6, current.ly + swayY * 0.6, -3);

        renderer.render(scene, cam);
    }

    // ---- Reloj y bucle (Pausa automática en pestaña inactiva) ----
    let clockT = 0;
    let last = performance.now();
    let isTabVisible = !document.hidden;

    document.addEventListener('visibilitychange', () => {
        isTabVisible = !document.hidden;
    });

    function animate(now) {
        if (!REDUCED) requestAnimationFrame(animate);
        if (!isTabVisible) return;

        // Throttle to ~30fps max to reduce GPU usage from 80% to ~25%
        // This prevents video recording lag while keeping animation smooth
        if (now - (window._lastFPS || 0) < 33) return;
        window._lastFPS = now;

        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        clockT += dt;
        draw(clockT, dt);
    }
    if (REDUCED) {
        draw(0, 0.016);
    } else {
        animate(performance.now());
    }

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        cam.aspect = window.innerWidth / window.innerHeight;
        cam.updateProjectionMatrix();
    });
});

// ===== CONTROL DE PESTAÑAS Y MENÚ FLOTANTE MÓVIL =====
function switchTab(tabId, event) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-tab, .bottom-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');
    if (event && event.currentTarget) event.currentTarget.classList.add('active');

    // Sincronizar el botón correspondiente en ambos menús
    document.querySelectorAll(`.nav-tab[onclick*="'${tabId}'"], .bottom-nav-btn[onclick*="'${tabId}'"]`).forEach(btn => {
        btn.classList.add('active');
    });

    if (window.particleFormation) window.particleFormation(tabId);

    if (tabId === 'proyectos') {
        const catPeeping = document.getElementById(`peep-${tabId}`);
        if (catPeeping) {
            catPeeping.loopCount = 0; 
            catPeeping.seek(0);       
            catPeeping.play();        
        }
    }
    if (tabId === 'contacto') {
        const walkCat = document.getElementById('walk-contacto');
        const sitCat = document.getElementById('sit-contacto');
        if (walkCat) { walkCat.seek(0); walkCat.play(); }
        if (sitCat) { sitCat.seek(0); sitCat.play(); }
    }
}

// ===== CONGELAR GATOS ASOMADIZOS (DESPUÉS DE 2 VECES) =====
window.addEventListener('DOMContentLoaded', () => {
    const peepingCats = ['peep-proyectos'];
    
    peepingCats.forEach(id => {
        const cat = document.getElementById(id);
        if (cat) {
            cat.loopCount = 0; 
            cat.addEventListener('loopComplete', () => {
                cat.loopCount++;
                if (cat.loopCount >= 2) {
                    cat.pause(); 
                }
            });
        }
    });
});

// ===== FUNCIÓN DE SEGURIDAD CONTRA INYECCIONES / XSS =====
function sanitizeInput(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// ===== EMAILJS CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Inicializar timestamp de carga del formulario
    const formLoadedInit = document.getElementById('form-loaded');
    if (formLoadedInit && !formLoadedInit.value) {
        formLoadedInit.value = Date.now();
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // === ANTI-BOTS: Honeypot ===
        const honeypot = document.getElementById('website');
        if (honeypot && honeypot.value.trim() !== '') {
            openFormModal('success');
            return;
        }

        // === ANTI-BOTS: Timestamp (mínimo 3 segundos en la página) ===
        const formLoaded = document.getElementById('form-loaded');
        if (formLoaded) {
            const loadTime = parseInt(formLoaded.value, 10);
            const now = Date.now();
            if (!loadTime || (now - loadTime) < 1500) {
                openFormModal('success');
                return;
            }
        }

        // === ANTI-BOTS: Rate limit (máx 1 envío cada 30 segundos) ===
        if (window._lastFormSubmit && (Date.now() - window._lastFormSubmit) < 30000) {
            openFormModal('error');
            return;
        }
        window._lastFormSubmit = Date.now();

        const nombreInput = document.getElementById('nombre');
        const mensajeInput = document.getElementById('mensaje');
        
        if (nombreInput) nombreInput.value = sanitizeInput(nombreInput.value);
        if (mensajeInput) mensajeInput.value = sanitizeInput(mensajeInput.value);
        
        const servicioSelect = document.getElementById('servicio');
        const titleField = document.getElementById('title');
        const nameField = document.getElementById('name');
        
        if (titleField && servicioSelect) titleField.value = servicioSelect.value;
        if (nameField && nombreInput) nameField.value = nombreInput.value;
        
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Enviando...';
        btn.disabled = true;

        const serviceID = 'service_qpdnplf';
        const templateID = 'template_b9zpheh';

        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                console.log('Email enviado correctamente!');
                openFormModal('success');
                this.reset();
                btn.textContent = originalText;
                btn.disabled = false;
                if (formLoaded) formLoaded.value = Date.now();
            }, (error) => {
                console.error('Error al enviar:', error);
                openFormModal('error');
                btn.textContent = originalText;
                btn.disabled = false;
            });
    });
}

// ===== MODAL DE ESTADO DEL FORMULARIO (ÉXITO / ERROR) =====
function openFormModal(type) {
    const modal = document.getElementById('form-modal');
    if (!modal) return;

    modal.classList.remove('success', 'error');
    modal.classList.add(type === 'error' ? 'error' : 'success');

    const title = document.getElementById('form-modal-title');
    const message = document.getElementById('form-modal-message');

    if (type === 'error') {
        if (title) title.textContent = '¡Ups! Algo salió mal';
        if (message) message.textContent = 'No pudimos enviar tu mensaje. Intentá nuevamente o escribinos por Telegram.';
    } else {
        if (title) title.textContent = '¡Mensaje enviado con éxito!';
        if (message) message.textContent = 'Gracias por escribirnos, responderemos a la brevedad.';
    }

    modal.classList.add('show');
}

function closeFormModal() {
    const modal = document.getElementById('form-modal');
    if (modal) modal.classList.remove('show');
}

document.addEventListener('click', (e) => {
    const modal = document.getElementById('form-modal');
    if (modal && e.target === modal) closeFormModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFormModal();
});

// ===== GESTOR DE CARGA POR PARTES Y SKELETON LOADERS =====
function revealContentFromSkeleton() {
    document.querySelectorAll('.skeleton-placeholder').forEach(el => {
        el.classList.add('hidden');
    });
    document.querySelectorAll('.content-lazy-loaded').forEach(el => {
        el.classList.add('loaded');
    });
}

// ===== PANTALLA DE CARGA (PRELOADER) DE 1.8 SEGUNDOS =====
const pageStartTime = performance.now();

function hidePreloader() {
    const preloader = document.getElementById('loader-wrapper');
    if (!preloader || preloader.classList.contains('fade-out')) return;

    const elapsed = performance.now() - pageStartTime;
    const minTime = 1800; // 1.8s para mostrar sutilmente la animación Michilactic
    const remainingDelay = Math.max(0, minTime - elapsed);

    setTimeout(() => {
        preloader.classList.add('fade-out');
        revealContentFromSkeleton();
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 400);
    }, remainingDelay);
}

if (document.readyState === 'complete') {
    hidePreloader();
} else {
    window.addEventListener('load', hidePreloader);
    document.addEventListener('DOMContentLoaded', hidePreloader);
}

// =======================================================
// LÓGICA DEL CARRUSEL / MODAL GLOBAL DE PROYECTOS
// =======================================================
let currentProjectImages = [];
let currentImageIndex = 0;

function openGallery(imagesArray) {
    currentProjectImages = imagesArray;
    currentImageIndex = 0;
    
    updateModalImage();
    
    const modal = document.getElementById('gallery-modal');
    if (modal) modal.classList.add('modal-active');
}

function closeGallery() {
    const modal = document.getElementById('gallery-modal');
    if (modal) modal.classList.remove('modal-active');
}

function changeModalImage(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex >= currentProjectImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = currentProjectImages.length - 1;
    }
    
    updateModalImage();
}

function updateModalImage() {
    const modalImg = document.getElementById('modal-current-img');
    const counter = document.getElementById('modal-counter');
    
    if (modalImg && currentProjectImages.length > 0) {
        modalImg.src = currentProjectImages[currentImageIndex];
        if (counter) {
            counter.textContent = `${currentImageIndex + 1} / ${currentProjectImages.length}`;
        }
    }
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('gallery-modal');
    if (e.target === modal) {
        closeGallery();
    }
});

// ===== CURSOR DE ESTRELLA FUGAZ =====
window.addEventListener('DOMContentLoaded', () => {
    const starCursor = document.getElementById('star-cursor');
    if (!starCursor) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, lx = 0, ly = 0;

    document.addEventListener('mousemove', (e) => {
        tx = e.clientX;
        ty = e.clientY;
    });

    document.addEventListener('mouseover', (e) => {
        const clickable = e.target.closest('a, button, .nav-tab, input, select, textarea, label, [onclick]');
        starCursor.classList.toggle('cursor-click', !!clickable);
    });

    document.addEventListener('mousedown', () => starCursor.classList.add('cursor-down'));
    document.addEventListener('mouseup', () => starCursor.classList.remove('cursor-down'));

    function followStar() {
        cx += (tx - cx) * 0.3;
        cy += (ty - cy) * 0.3;

        const dx = cx - lx;
        const dy = cy - ly;
        const speed = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        if (speed > 0.4) {
            starCursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%) rotate(${angle}deg)`;
            starCursor.style.setProperty('--speed', Math.min(1, speed * 0.035));
        } else {
            starCursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
            starCursor.style.setProperty('--speed', 0.12);
        }
        lx = cx;
        ly = cy;
        requestAnimationFrame(followStar);
    }
    followStar();
});

// ===== DEEP LINK POR HASH (ej: index.html#contacto) =====
function handleHashRoute() {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
        switchTab(hash, null);
    }
}

window.addEventListener('hashchange', handleHashRoute);
handleHashRoute();

// ===== STACK DE SERVICIOS (click o rueda del mouse para rotar, en loop) =====
function rotateServices(direction) {
    const track = document.getElementById('servicesCarousel');
    if (!track || track.classList.contains('grid-mode')) return;
    const cards = Array.from(track.querySelectorAll('.glass-card'));
    const total = cards.length;
    if (!total) return;

    cards.forEach(card => {
        const current = parseInt(card.dataset.pos, 10) || 0;
        const next = (current - direction + total) % total;
        card.dataset.pos = next;
    });
}

(function initServicesStack() {
    const track = document.getElementById('servicesCarousel');
    if (!track) return;

    // Click en cualquier parte del stack: pasa a la siguiente tarjeta (solo en modo 3D)
    track.addEventListener('click', () => {
        if (track.classList.contains('grid-mode')) return;
        rotateServices(1);
    });

    // Rueda del mouse sobre el stack: gira sin scrollear la página, con un pequeño freno anti-rebote
    let wheelLocked = false;
    track.addEventListener('wheel', (e) => {
        if (track.classList.contains('grid-mode')) return;
        e.preventDefault();
        if (wheelLocked) return;
        wheelLocked = true;
        rotateServices(e.deltaY > 0 ? 1 : -1);
        setTimeout(() => { wheelLocked = false; }, 350);
    }, { passive: false });
})();

// ===== VISTA GRILLA PARA SERVICIOS (botón "Ver Todos", igual que Proyectos) =====
(function initServicesGridToggle() {
    const toggleBtn = document.getElementById('toggleServicesGrid');
    const track = document.getElementById('servicesCarousel');
    const section = document.getElementById('servicios');
    if (!toggleBtn || !track) return;

    function setGridMode(active) {
        track.classList.toggle('grid-mode', active);
        toggleBtn.classList.toggle('active', active);
        if (section) section.classList.toggle('grid-view-active', active);
        const btnText = toggleBtn.querySelector('span:not(.plus-icon)');
        const btnIcon = toggleBtn.querySelector('i');
        if (active) {
            if (btnText) btnText.textContent = 'Ver menos';
            if (btnIcon) btnIcon.className = 'fas fa-th-large';
        } else {
            if (btnText) btnText.textContent = 'Ver más';
            if (btnIcon) btnIcon.className = 'fas fa-th-large';
        }
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setGridMode(!track.classList.contains('grid-mode'));
    });

    // En pantallas muy chicas, el stack 3D es difícil de navegar: activamos la grilla automáticamente
    if (window.innerWidth < 480) {
        setGridMode(true);
    }
})();

// ===== CARRUSEL 3D DE PROYECTOS (flechas laterales) =====
function rotateProjects(direction) {
    const track = document.getElementById('projectsCarousel');
    if (!track || track.classList.contains('grid-mode')) return;
    const cards = Array.from(track.querySelectorAll('.project-card'));
    const total = cards.length;
    if (!total) return;

    cards.forEach(card => {
        const current = parseInt(card.dataset.pos, 10) || 0;
        const next = (current - direction + total) % total;
        card.dataset.pos = next;
    });
}

// ===== PROYECTOS: Click + rueda del mouse para rotar (igual que servicios) =====
(function initProjectsStack() {
    const track = document.getElementById('projectsCarousel');
    if (!track) return;

    // No rotar si el click fue sobre la galería de fotos, el botón "Ver en Vivo"
    // o cualquier otro elemento interactivo: esos deben abrir su propia acción
    // y dejar la tarjeta activa quieta, sin pasar a la siguiente.
    track.addEventListener('click', (e) => {
        if (track.classList.contains('grid-mode')) return;
        if (e.target.closest('.stacked-gallery, .btn-live-crystal, a, button')) return;
        rotateProjects(1);
    });

    let wheelLocked = false;
    track.addEventListener('wheel', (e) => {
        if (track.classList.contains('grid-mode')) return;
        e.preventDefault();
        if (wheelLocked) return;
        wheelLocked = true;
        rotateProjects(e.deltaY > 0 ? 1 : -1);
        setTimeout(() => { wheelLocked = false; }, 350);
    }, { passive: false });
})();

// ===== VISTA GRILLA PARA PROYECTOS (botón "Ver Todos") =====
(function initProjectsGridToggle() {
    const toggleBtn = document.getElementById('toggleGridView');
    const track = document.getElementById('projectsCarousel');
    const section = document.getElementById('proyectos');
    if (!toggleBtn || !track) return;

    function setGridMode(active) {
        track.classList.toggle('grid-mode', active);
        toggleBtn.classList.toggle('active', active);
        if (section) section.classList.toggle('grid-view-active', active);
        const btnText = toggleBtn.querySelector('span:not(.plus-icon)');
        const btnIcon = toggleBtn.querySelector('i');
        if (active) {
            if (btnText) btnText.textContent = 'Ver menos';
            if (btnIcon) btnIcon.className = 'fas fa-th-large';
        } else {
            if (btnText) btnText.textContent = 'Ver más';
            if (btnIcon) btnIcon.className = 'fas fa-th-large';
        }
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setGridMode(!track.classList.contains('grid-mode'));
    });

    // En pantallas muy chicas, el abanico 3D es difícil de navegar: activamos la grilla automáticamente
    if (window.innerWidth < 480) {
        setGridMode(true);
    }
})();

// ===== EFECTO 3D TILT EN TARJETAS (SERVICIOS + PROYECTOS) =====
(function initTilt() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const TILT_MAX = 10;
    const SCALE_HOVER = 1.04;

    function attachTilt(card) {
        if (card.dataset.tiltAttached) return;
        card.dataset.tiltAttached = 'true';

        const shine = document.createElement('div');
        shine.className = 'tilt-shine';
        card.appendChild(shine);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateY = ((x - cx) / cx) * TILT_MAX;
            const rotateX = -((y - cy) / cy) * TILT_MAX;

            card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${SCALE_HOVER}, ${SCALE_HOVER}, ${SCALE_HOVER})`;
            card.style.setProperty('--shine-x', (x / rect.width * 100) + '%');
            card.style.setProperty('--shine-y', (y / rect.height * 100) + '%');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease';
            setTimeout(() => {
                card.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
            }, 600);
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
        });
    }

    function initAllCards() {
        document.querySelectorAll('.projects-grid-glass .glass-card:not(.project-card), .profile-widget').forEach(attachTilt);
    }

    initAllCards();

    const observer = new MutationObserver(() => { initAllCards(); });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
})();

// ===== WELCOME CODE: se escribe como código =====
(function initWelcomeCode() {
    var el = document.getElementById('welcome-typewriter');
    var wrap = document.getElementById('heroLogoTilt');
    if (!el || !wrap) return;

    var line1 = 'const str = "Tu idea, hecha código";';
    var line2 = 'console.log(Bienvenido a YamySystem ${str});';
    var output1 = 'Bienvenido a YamySystem Tu idea, hecha código';
    var output2 = '< undefined';

    var htmlLine1 = '<span class="tw-violet">const</span> <span class="tw-white">str</span> <span class="tw-violet">=</span> <span class="tw-green">"Tu idea, hecha código";</span>';
    var htmlLine2 = '<span class="tw-cyan">console</span><span class="tw-violet">.log</span><span class="tw-violet">(</span><span class="tw-green">"Bienvenido a YamySystem "</span> <span class="tw-green">$</span><span class="tw-white">{str}</span><span class="tw-violet">);</span>';
    var htmlOut1 = '<span class="tw-white" style="opacity:0.75">' + output1 + '</span>';
    var htmlOut2 = '<span class="tw-white" style="opacity:0.65">&lt; undefined</span>';

    var fullPlain = line1 + '\n' + line2 + '\n' + output1 + '\n' + output2;
    var fullHTML = htmlLine1 + '\n' + htmlLine2 + '\n' + htmlOut1 + '\n' + htmlOut2;

    var i = 0;
    var typeTimer = null;
    var hideTimer = null;

    function countVisible(plainUpTo) {
        var count = 0;
        for (var j = 0; j < fullHTML.length && count < plainUpTo; j++) {
            if (fullHTML[j] === '<') { while (j < fullHTML.length && fullHTML[j] !== '>') j++; continue; }
            if (fullHTML[j] === '&') { if (fullHTML.substring(j, j + 4) === '&lt;') { count++; j += 3; continue; } }
            count++;
        }
        return j;
    }

    function typeChar() {
        if (i < fullPlain.length) {
            i++;
            var htmlIdx = countVisible(i);
            el.innerHTML = fullHTML.substring(0, htmlIdx) + '<span class="tw-cursor"></span>';
            var ch = fullPlain[i - 1];
            var speed = (ch === '\n') ? 350 : (30 + Math.random() * 25);
            typeTimer = setTimeout(typeChar, speed);
        } else {
            el.innerHTML = fullHTML + '<span class="tw-cursor"></span>';
            hideTimer = setTimeout(function() { el.classList.remove('active'); }, 4500);
        }
    }

    function startTyping() {
        clearTimeout(typeTimer);
        clearTimeout(hideTimer);
        i = 0;
        el.innerHTML = '';
        el.classList.add('active');
        typeChar();
    }

    wrap.addEventListener('mouseenter', startTyping);

    wrap.addEventListener('mouseleave', function() {
        clearTimeout(typeTimer);
        clearTimeout(hideTimer);
        setTimeout(function() {
            el.classList.remove('active');
            el.innerHTML = '';
            i = 0;
        }, 600);
    });
})();

// ===== HERO LOGO + CAGE: tilt 3D unificado + float =====
(function initHeroLogo() {
    var wrap = document.getElementById('heroLogoTilt');
    var img = wrap ? wrap.querySelector('.hero-logotipo-img') : null;
    if (!wrap || !img) return;

    var MAX_TILT = 35;
    var targetRX = 0, targetRY = 0;
    var isHovering = false;

    wrap.addEventListener('mousemove', function(e) {
        var r = wrap.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        img.style.transform = 'rotateY(' + (x * MAX_TILT) + 'deg) rotateX(' + (-y * MAX_TILT) + 'deg) scale3d(1.12,1.12,1.12)';
        targetRY = x * 1.2;
        targetRX = -y * 1.0;
        if (!isHovering) { isHovering = true; wrap.style.animationPlayState = 'paused'; }
    });

    wrap.addEventListener('mouseleave', function() {
        img.style.transform = 'rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
        targetRY = 0; targetRX = 0;
        isHovering = false;
        wrap.style.animationPlayState = 'running';
    });

    window._cageMouse = { get: function() { return { rx: targetRX, ry: targetRY }; } };
})();

// ===== ICOSAEDRO CAGE: jaula 3D plexus alrededor del logo =====
(function initCage() {
    try {
        var cv = document.getElementById('cageCanvas');
        if (!cv || typeof THREE === 'undefined') { console.warn('[CAGE] skip:', !cv ? 'no canvas' : 'no THREE'); return; }

        var S = cv.clientWidth || 280;
        var ren = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
        if (!ren.getContext()) { console.warn('[CAGE] no WebGL context'); return; }
        ren.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        ren.setClearColor(0x000000, 0);
        ren.setSize(S, S, false);

        var scene = new THREE.Scene();
        var cam = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
        cam.position.set(0, 0, 5.5);

        var group = new THREE.Group();
        var ico = new THREE.IcosahedronGeometry(1.6, 0);

        var edges = new THREE.EdgesGeometry(ico);
        var lineMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.6, linewidth: 2 });
        group.add(new THREE.LineSegments(edges, lineMat));

        var edges2 = new THREE.EdgesGeometry(ico);
        var lineMat2 = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.35, linewidth: 2 });
        var wf2 = new THREE.LineSegments(edges2, lineMat2);
        wf2.scale.set(1.04, 1.04, 1.04);
        group.add(wf2);

        var pos = ico.getAttribute('position');
        var nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
        var nodes = [];
        var seen = {};
        for (var i = 0; i < pos.count; i++) {
            var key = pos.getX(i).toFixed(4) + ',' + pos.getY(i).toFixed(4) + ',' + pos.getZ(i).toFixed(4);
            if (!seen[key]) {
                seen[key] = true;
                var isCyan = nodes.length % 2 === 0;
                var mat = new THREE.MeshBasicMaterial({ color: isCyan ? 0x22d3ee : 0x8b5cf6, transparent: true, opacity: 0.9 });
                var sphere = new THREE.Mesh(nodeGeo, mat);
                sphere.position.set(pos.getX(i), pos.getY(i), pos.getZ(i));
                group.add(sphere);
                nodes.push(sphere);
            }
        }

        scene.add(group);

        function resizeCage() {
            var ns = parseInt(getComputedStyle(cv).width) || 280;
            if (ns !== S) {
                S = ns;
                ren.setSize(S, S, false);
                cam.aspect = 1;
                cam.updateProjectionMatrix();
            }
        }
        window.addEventListener('resize', resizeCage);

        var rotY = 0, rotX = 0;
        function animate() {
            requestAnimationFrame(animate);
            var t = Date.now() * 0.001;

            var m = window._cageMouse ? window._cageMouse.get() : { rx: 0, ry: 0 };
            rotY += (m.ry - rotY) * 0.12;
            rotX += (m.rx - rotX) * 0.12;

            group.rotation.y = rotY + t * 0.3;
            group.rotation.x = rotX + Math.sin(t * 0.5) * 0.15;
            var breath = 1 + Math.sin(t * 0.8) * 0.04;
            group.scale.set(breath, breath, breath);
            lineMat.opacity = 0.4 + Math.sin(t * 1.2) * 0.2;
            lineMat2.opacity = 0.25 + Math.sin(t * 1.2 + 1) * 0.15;
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].material.opacity = 0.5 + Math.sin(t * 2 + i * 1.1) * 0.4;
                var s = 0.7 + Math.sin(t * 2.5 + i * 0.9) * 0.5;
                nodes[i].scale.set(s, s, s);
            }
            ren.render(scene, cam);
        }
        animate();
        console.log('[CAGE] initialized OK');
    } catch(e) { console.error('[CAGE] ERROR:', e.message); }
})();

// =======================================================
// THEME TOGGLE - Color palette switcher
// =======================================================
(function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    const themes = ['violet', 'emerald', 'amber', 'rose', 'indigo', 'cyan'];
    let currentIndex = 0;

    // Load saved theme
    const saved = localStorage.getItem('yamysystem-theme');
    if (saved && themes.includes(saved)) {
        currentIndex = themes.indexOf(saved);
        document.documentElement.setAttribute('data-theme', saved);
    }

    toggle.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % themes.length;
        const theme = themes[currentIndex];
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('yamysystem-theme', theme);
        toggle.style.transform = 'scale(0.95) rotate(180deg)';
        setTimeout(() => { toggle.style.transform = ''; }, 150);
    });
})();

// =======================================================
// CONTROLES DE SCROLL LATERAL FUTURISTAS (SOLO CUANDO HACE FALTA)
// =======================================================
(function initSideScrollControls() {
    const widget = document.getElementById('side-scroll-widget');
    const upBtn = document.getElementById('scrollUpBtn');
    const downBtn = document.getElementById('scrollDownBtn');
    if (!widget || !upBtn || !downBtn) return;

    function getActiveTabContent() {
        return document.querySelector('.tab-content.active');
    }

    function checkScrollNeeded() {
        const tab = getActiveTabContent();
        if (!tab) {
            widget.classList.remove('visible');
            return;
        }

        // Comprobar si el contenido desborda verticalmente (hace falta scroll)
        const isScrollable = tab.scrollHeight > tab.clientHeight + 10;
        if (isScrollable) {
            widget.classList.add('visible');

            // Estado deshabilitado sutil según la posición actual del scroll
            const atTop = tab.scrollTop <= 5;
            const atBottom = tab.scrollTop + tab.clientHeight >= tab.scrollHeight - 5;
            
            upBtn.classList.toggle('disabled', atTop);
            downBtn.classList.toggle('disabled', atBottom);
        } else {
            widget.classList.remove('visible');
        }
    }

    // Detectar desplazamientos y cambios de tamaño
    document.addEventListener('scroll', checkScrollNeeded, true);
    window.addEventListener('resize', checkScrollNeeded);

    // Escuchar el cambio de pestañas o mutaciones de contenido (ej. activar vista de grilla)
    const observer = new MutationObserver(() => {
        setTimeout(checkScrollNeeded, 80);
    });

    const mainContainer = document.querySelector('.app-main');
    if (mainContainer) {
        observer.observe(mainContainer, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    }

    upBtn.addEventListener('click', () => {
        const tab = getActiveTabContent();
        if (tab) {
            tab.scrollBy({ top: -280, behavior: 'smooth' });
        }
    });

    downBtn.addEventListener('click', () => {
        const tab = getActiveTabContent();
        if (tab) {
            tab.scrollBy({ top: 280, behavior: 'smooth' });
        }
    });

    // Evaluación inicial y periódica ligera por carga de imágenes/lottie
    setTimeout(checkScrollNeeded, 200);
    setInterval(checkScrollNeeded, 1500);
})();

// =======================================================
// SEGUIMIENTO EXCLUSIVO DE LAS PUPILAS DEL GATO DE CONTACTO
// =======================================================
(function initContactPupilTracking() {
    const catContainer = document.getElementById('cat-container-contacto');
    if (!catContainer) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = 0;
    let currentY = 0;
    let ticking = false;

    function onMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!ticking) {
            requestAnimationFrame(updatePupilPosition);
            ticking = true;
        }
    }

    function updatePupilPosition() {
        ticking = false;
        const pupils = catContainer.querySelectorAll('.cat-pupil');
        if (!pupils.length) return;

        const rect = catContainer.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0 || rect.bottom < 0 || rect.top > window.innerHeight) {
            return;
        }

        // Centro aproximado de los ojos
        const catX = rect.left + rect.width * 0.5;
        const catY = rect.top + rect.height * 0.35;

        const dx = mouseX - catX;
        const dy = mouseY - catY;
        const dist = Math.hypot(dx, dy);

        // Desplazamiento de las pupilas dentro del iris
        const maxOffset = Math.min(14, dist / 20);
        const angle = Math.atan2(dy, dx);

        const targetX = Math.cos(angle) * maxOffset;
        const targetY = Math.sin(angle) * maxOffset;

        // Suavizado fluido a 60fps
        currentX += (targetX - currentX) * 0.18;
        currentY += (targetY - currentY) * 0.18;

        const strX = currentX.toFixed(2);
        const strY = currentY.toFixed(2);

        pupils.forEach(pupil => {
            pupil.style.transform = `translate(${strX}px, ${strY}px)`;
        });

        if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
            requestAnimationFrame(updatePupilPosition);
            ticking = true;
        }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
})();