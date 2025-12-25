### YamySystem - Soluciones Tecnológicas Integrales
YamySystem es una plataforma web profesional diseñada para centralizar servicios de soporte técnico, armado de equipos de alto rendimiento y desarrollo web a medida. El sitio combina una estética moderna con una arquitectura ligera para ofrecer una experiencia de usuario fluida y eficiente.

🌐 **Demo en Vivo:** 
[Ver sitio web]( https://yamilacode.github.io/YamySystem/)

### 📂 Estructura del Proyecto

```text
yamysystem/
├── index.html          # Punto de entrada principal
├── 404.html            # Página de error personalizada
├── styles.css          # Estilos y variables de color
├── script.js           # Lógica global
├── chatbot.js          # Cerebro del Asistente
└── img/                # Assets (Logo, Iconos)
```

### 🚀 Características Destacadas
Asistente Virtual Inteligente: Chatbot programado en Vanilla JS con lógica de procesamiento de lenguaje natural (NLP) básica para resolver dudas comunes instantáneamente.

Diseño de Alto Impacto: Estética profesional que utiliza efectos de Glassmorphism y animaciones suaves para captar la atención del cliente.

Arquitectura Responsive: Adaptabilidad total en todos los dispositivos (Mobile-First) mediante CSS Flexbox y Grid.

Gestión de Consultas (Serverless): Integración con EmailJS para la recepción de pedidos de presupuesto directamente al correo electrónico, eliminando la necesidad de un servidor dedicado.

Experiencia Visual Avanzada: Implementación de animaciones de entrada controladas por el scroll y un preloader personalizado.

### 🛠️ Stack Tecnológico
Frontend & Core
- HTML5 & CSS3: Uso avanzado de Variables CSS para temas dinámicos y Media Queries para responsive design.

- JavaScript (ES6+): Manipulación del DOM, lógica del chatbot y gestión de eventos asíncronos (Async/Await).

Bibliotecas y APIs
- AOS.js (Animate On Scroll): Biblioteca para animaciones al desplazar la página.

- EmailJS: Servicio de envío de correos electrónicos desde el lado del cliente.

- Font Awesome 6: Set de iconos vectoriales para una interfaz intuitiva.

### Configuración del Sistema
1. Requisitos para el Formulario
Para activar el envío de correos, asegúrate de configurar tu Public Key en el script:

```javascript
// Inicialización de EmailJS
emailjs.init("TU_PUBLIC_KEY");
```

2. Personalización de Identidad Visual
El sistema de colores es fácilmente editable desde el archivo styles.css. Hemos utilizado los colores corporativos:

- Fondo Primario: #0B132B (Azul Noche)

- Accento: #8B5CF6 (Morado Eléctrico)

### 🎯 Secciones del Sitio
- Hero Section - Presentación con imagen de fondo y overlay

- Estadísticas - Contadores animados de logros

- Servicios - Tarjetas interactivas con detalles

- Testimonios - Carrusel automático de reseñas

- Contacto - Formulario funcional con validación

- Footer - Información de contacto y redes sociales

👤 Autor
Yamila 
- GitHub: @yamilacode
