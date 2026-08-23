<div align="center">

# <img src="https://raw.githubusercontent.com/yamilacode/YamySystem/main/img/logotipo.png" width="100"> YamySystem

### Desarrollo Web y Software a Medida

[![Website](https://img.shields.io/website?label=yamysystem.com.ar&style=for-the-badge&url=https://www.yamysystem.com.ar)](https://www.yamysystem.com.ar)
[![GitHub Stars](https://img.shields.io/github/stars/yamilacode/YamySystem?style=for-the-badge&color=violet)](https://github.com/yamilacode/YamySystem/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/yamilacode/YamySystem?style=for-the-badge&color=purple)](https://github.com/yamilacode/YamySystem/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/yamilacode/YamySystem?style=for-the-badge&color=fuchsia)](https://github.com/yamilacode/YamySystem/issues)

<br>

**Portfolio interactivo con fondo 3D de partículas, UI glassmorphism y animaciones que sorprenden.**

[![Ver Demo](https://img.shields.io/badge/VER_DEMO-8b5cf6?style=for-the-badge&logo=vercel&logoColor=white)](https://www.yamysystem.com.ar)

</div>

---

## Características

<table>
<tr>
<td width="50%">

**Experiencia Visual**
- Fondo Plexus 3D — Red neuronal de partículas en Three.js
- Glassmorphism UI — Paneles semitransparentes con blur
- Cursor personalizado — Estrella fugaz que sigue el mouse
- Micro-interacciones — Efectos hover, transiciones suaves

</td>
<td width="50%">

**Funcionalidad**
- 100% Responsive — Sidebar colapsable en móvil
- Gatos animados — Lottie animations por sección
- Formulario seguro — EmailJS con anti-bot protection
- SEO optimizado — JSON-LD, Open Graph, sitemap

</td>
</tr>
</table>

---

## Tech Stack

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)

</div>

---

## Estructura del Proyecto

```
YamySystem/
├── index.html              # Pagina principal (SPA)
├── 404.html                # Pagina de error con glitch effect
├── CNAME                   # Dominio personalizado
├── robots.txt              # Reglas para crawlers
├── sitemap.xml             # Mapa del sitio
├── css/
│   ├── styles.css          # Estilos principales
│   └── css404.css          # Estilos de la pagina 404
├── scripts/
│   ├── scripts.js          # Logica de la aplicacion
│   ├── three.min.js        # Three.js (minificado)
│   └── 404.js              # Logica de la pagina 404
├── json/
│   ├── cat.json            # Gato sentado
│   ├── cat_line.json       # Gato caminando
│   ├── Michilactic.json    # Gato cohete (loader)
│   ├── WhiteCat.json       # Gato blanco (contacto)
│   └── Pink Cat.json       # Gato rosa
└── img/
    ├── logo.png            # Logo principal
    ├── logotipo.png        # Favicon
    └── proyect/            # Capturas de proyectos
```

---

## Desarrollo Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/yamilacode/YamySystem.git
   ```

2. Abrir `index.html` en un navegador (requiere servidor local):
   ```bash
   # Con Python
   python -m http.server 8000

   # Con Node.js
   npx serve .
   ```

3. Abrir `http://localhost:8000`

---

## Deployment

El sitio se despliega automaticamente via **GitHub Pages** al hacer push a la rama `main`.

Dominio personalizado: `www.yamysystem.com.ar` (configurado via `CNAME`).

---

## Seguridad

- **Anti-bot en formulario:** Honeypot + timestamp + rate limit (30s)
- **Cloudflare WAF:** Bot Fight Mode, Block AI Bots, reglas personalizadas
- **Sanitizacion de inputs:** Proteccion contra XSS
- **EmailJS:** Keys restringidas por dominio

---

## Autor

**Yamila Peña** — Full Stack Web Dev & Software Developer

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yamilacode)
