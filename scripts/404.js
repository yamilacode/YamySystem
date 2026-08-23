// =======================================================
// FONDO CONSTELACIÓN PARA LA PÁGINA 404 (Vanilla JS)
// Puntos flotantes conectados por líneas, sin dependencias.
// =======================================================
(() => {
    const canvas = document.getElementById('bg-canvas-404');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const palette = ['#22d3ee', '#8b5cf6', '#d946ef', '#ffffff'];
    let W, H, dots = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();

    const COUNT = Math.min(150, Math.max(70, Math.floor((W * H) / 15000)));
    for (let i = 0; i < COUNT; i++) {
        dots.push({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.8 + 0.6,
            c: palette[Math.floor(Math.random() * palette.length)]
        });
    }

    const LINE_DIST = 130;

    function frame() {
        ctx.clearRect(0, 0, W, H);

        for (const d of dots) {
            d.x += d.vx;
            d.y += d.vy;
            if (d.x < 0) d.x = W;
            if (d.x > W) d.x = 0;
            if (d.y < 0) d.y = H;
            if (d.y > H) d.y = 0;

            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = d.c;
            ctx.globalAlpha = 0.9;
            ctx.fill();
        }

        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.18)';
        ctx.lineWidth = 1;

        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].x - dots[j].x;
                const dy = dots[i].y - dots[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINE_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(dots[i].x, dots[i].y);
                    ctx.lineTo(dots[j].x, dots[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(frame);
    }

    frame();
    window.addEventListener('resize', resize);
})();
