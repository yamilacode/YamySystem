// =======================================================
// RED NEURONAL IA 2D ULTRA-LIGERA (PURE HTML5 CANVAS)
// Nodos cibernéticos y conexiones neón (Cian, Púrpura, Magenta)
// Consumo de CPU/GPU ~0%, 120 FPS fluido en móviles sin Three.js
// =======================================================
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    // Configuración según dispositivo para maximizar rendimiento
    const isMobile = window.innerWidth < 768;
    const isSmall = window.innerWidth < 400;
    const NUM_NODES = isSmall ? 14 : isMobile ? 22 : 36;
    const MAX_DIST = isMobile ? 120 : 160;

    // Paleta Neón Cyberpunk / IA
    const colors = [
        { r: 34,  g: 211, b: 238 }, // Cyan (#22d3ee)
        { r: 139, g: 92,  b: 246 }, // Purple (#8b5cf6)
        { r: 217, g: 70,  b: 239 }, // Magenta (#d946ef)
        { r: 255, g: 255, b: 255 }  // White accent
    ];

    // Generar Nodos de la Red IA
    const nodes = [];
    for (let i = 0; i < NUM_NODES; i++) {
        const col = colors[Math.floor(Math.random() * colors.length)];
        nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.55),
            vy: (Math.random() - 0.5) * (isMobile ? 0.35 : 0.55),
            radius: Math.random() * 1.8 + 1.2,
            color: col,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.03
        });
    }

    // Posición del Cursor / Touch
    const pointer = { x: -999, y: -999, active: false };
    window.addEventListener('pointermove', (e) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.active = true;
    });
    window.addEventListener('pointerleave', () => { pointer.active = false; });

    // Secciones y Parallax sutil
    const sectionOffsets = { inicio: 0, servicios: 25, proyectos: -25, contacto: 15 };
    let targetOffsetY = 0;
    let currentOffsetY = 0;
    window.particleFormation = (name) => {
        targetOffsetY = sectionOffsets[name] || 0;
    };

    // Control de Visibilidad (Pausa total si la pestaña no está activa o el canvas sale de vista)
    let isTabVisible = !document.hidden;
    let isCanvasVisible = true;

    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries) => {
            if (entries[0]) isCanvasVisible = entries[0].isIntersecting;
        }, { threshold: 0.05 });
        obs.observe(canvas);
    }
    document.addEventListener('visibilitychange', () => {
        isTabVisible = !document.hidden;
    });

    let lastTime = performance.now();

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Transición suave de offset de sección
        currentOffsetY += (targetOffsetY - currentOffsetY) * 0.05;

        // Dibujar Conexiones entre Nodos (Red Neuronal)
        const maxDist2 = MAX_DIST * MAX_DIST;
        for (let i = 0; i < NUM_NODES; i++) {
            const na = nodes[i];
            const ay = na.y + currentOffsetY;

            for (let j = i + 1; j < NUM_NODES; j++) {
                const nb = nodes[j];
                const by = nb.y + currentOffsetY;
                const dx = na.x - nb.x;
                const dy = ay - by;
                const dist2 = dx * dx + dy * dy;

                if (dist2 < maxDist2) {
                    const alpha = (1 - Math.sqrt(dist2) / MAX_DIST) * 0.42;
                    ctx.strokeStyle = `rgba(${na.color.r}, ${na.color.g}, ${na.color.b}, ${alpha})`;
                    ctx.lineWidth = alpha * 1.4;
                    ctx.beginPath();
                    ctx.moveTo(na.x, ay);
                    ctx.lineTo(nb.x, by);
                    ctx.stroke();
                }
            }

            // Conexión interactiva cibernética con el cursor
            if (pointer.active) {
                const dx = na.x - pointer.x;
                const dy = ay - pointer.y;
                const dist2 = dx * dx + dy * dy;
                const cursorMax = 170;
                if (dist2 < cursorMax * cursorMax) {
                    const alpha = (1 - Math.sqrt(dist2) / cursorMax) * 0.55;
                    ctx.strokeStyle = `rgba(34, 211, 238, ${alpha})`;
                    ctx.lineWidth = alpha * 1.6;
                    ctx.beginPath();
                    ctx.moveTo(na.x, ay);
                    ctx.lineTo(pointer.x, pointer.y);
                    ctx.stroke();
                }
            }
        }

        // Dibujar Nodos e Interacción de Movimiento
        for (let i = 0; i < NUM_NODES; i++) {
            const n = nodes[i];

            // Movimiento continuo
            n.x += n.vx;
            n.y += n.vy;

            // Rebote suave en bordes
            if (n.x < 0 || n.x > width) n.vx *= -1;
            if (n.y < 0 || n.y > height) n.vy *= -1;

            // Pulso de brillo neón
            n.pulse += n.pulseSpeed;
            const currentRadius = n.radius + Math.sin(n.pulse) * 0.6;
            const drawY = n.y + currentOffsetY;

            // Punto central luminoso
            ctx.fillStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, 0.88)`;
            ctx.beginPath();
            ctx.arc(n.x, drawY, Math.max(0.5, currentRadius), 0, Math.PI * 2);
            ctx.fill();

            // Brillo resplandeciente sutil (Glow)
            ctx.fillStyle = `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, 0.22)`;
            ctx.beginPath();
            ctx.arc(n.x, drawY, Math.max(1, currentRadius * 2.2), 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function loop(now) {
        if (!REDUCED) requestAnimationFrame(loop);
        if (!isTabVisible || !isCanvasVisible) return;

        // Freno inteligente anti-sobrecarga (60 FPS estables)
        if (now - lastTime < 16) return;
        lastTime = now;

        draw();
    }

    if (REDUCED) {
        draw();
    } else {
        loop(performance.now());
    }
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
    let isRunning = false;

    function startLoop() {
        if (!isRunning) {
            isRunning = true;
            requestAnimationFrame(followStar);
        }
    }

    document.addEventListener('mousemove', (e) => {
        tx = e.clientX;
        ty = e.clientY;
        startLoop();
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

        if (Math.abs(tx - cx) > 0.2 || Math.abs(ty - cy) > 0.2) {
            requestAnimationFrame(followStar);
        } else {
            isRunning = false;
        }
    }
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

    // Gestos táctiles de deslizamiento (swipe) para móviles
    let touchStartX = 0;
    let touchStartY = 0;
    track.addEventListener('touchstart', (e) => {
        if (track.classList.contains('grid-mode') || !e.touches.length) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        if (track.classList.contains('grid-mode') || !e.changedTouches.length) return;
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
            rotateServices(diffX < 0 ? 1 : -1);
        }
    }, { passive: true });
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

    // Gestos táctiles de deslizamiento (swipe) en abanico de proyectos para móviles
    let touchStartX = 0;
    let touchStartY = 0;
    track.addEventListener('touchstart', (e) => {
        if (track.classList.contains('grid-mode') || !e.touches.length) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        if (track.classList.contains('grid-mode') || !e.changedTouches.length) return;
        if (e.target.closest('.stacked-gallery, .btn-live-crystal, a, button')) return;
        const diffX = e.changedTouches[0].clientX - touchStartX;
        const diffY = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
            rotateProjects(diffX < 0 ? 1 : -1);
        }
    }, { passive: true });
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
    const mainContainer = document.querySelector('.app-main');
    if (mainContainer) {
        observer.observe(mainContainer, { childList: true, subtree: true });
    }
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
        var ren = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: false });
        if (!ren.getContext()) { console.warn('[CAGE] no WebGL context'); return; }
        ren.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
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
        var lastCageFrame = 0;
        function animate(now) {
            requestAnimationFrame(animate);
            if (document.hidden) return;
            var inicioTab = document.getElementById('inicio');
            if (inicioTab && !inicioTab.classList.contains('active')) return;
            if (now - lastCageFrame < 42) return; // Limitar jaula 3D a ~24 FPS
            lastCageFrame = now;
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