// ===== CHATBOT FUNCTIONALITY =====

// Toggle chatbot visibility
function toggleChat() {
    const chatbot = document.getElementById('chatbot');
    const toggleBtn = document.querySelector('.chat-toggle');
    
    chatbot.classList.toggle('active');
    
    // Ocultar el botón cuando el chatbot está abierto
    if (chatbot.classList.contains('active')) {
        toggleBtn.classList.add('hidden');
    } else {
        toggleBtn.classList.remove('hidden');
    }
}

// Send message function
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Generate bot response with delay
    setTimeout(() => {
        const response = generateResponse(message.toLowerCase());
        addMessage(response, 'bot');
    }, 500);
}

// Add message to chat
function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateResponse(message) {
    // 1. Convertimos todo a minúsculas para que no importe cómo escriba el usuario
    const msg = message.toLowerCase();

    // Saludos
    if (msg.includes('hola') || msg.includes('buenos') || msg.includes('buenas')) {
        return '¡Hola! 💻 En **YamySystem** ofrecemos reparación de PC, armado gaming y desarrollo web. ¿En qué servicio estás interesado?';
    }
    
    // Precios (Añadí "presupuesto" y "vale")
    else if (msg.includes('precio') || msg.includes('costo') || msg.includes('cuanto') || msg.includes('presupuesto') || msg.includes('vale')) {
        return 'Los precios dependen de cada caso técnico. ¿Podrías decirme qué servicio necesitas? También puedes enviarnos los detalles por el formulario de contacto para un presupuesto exacto.';
    }
    
    // Desarrollo Web (Añadí "portfolio", "negocio")
    else if (msg.includes('web') || msg.includes('página') || msg.includes('sitio') || msg.includes('desarrollo') || msg.includes('online')) {
        return 'Creamos sitios web modernos (portafolios, tiendas online, landing pages). ¿Necesitas una web para tu negocio o algo personal?';
    }

    // Hardware / Armado (Añadí "componentes", "piezas")
    else if (msg.includes('armado') || msg.includes('armar') || msg.includes('pc nueva') || msg.includes('componentes') || msg.includes('gaming')) {
        return '¡Somos especialistas en hardware! 🚀 Armamos PCs a medida (Gaming, Oficina o Edición). ¿Tienes un presupuesto en mente o quieres que te asesoremos desde cero?';
    }

    // Ubicación específica (Ya que mencionaste Laguna Naineck)
    else if (msg.includes('donde') || msg.includes('ubicacion') || msg.includes('direccion') || msg.includes('localidad')) {
        return 'Nos encontramos en **Laguna Naineck, Formosa**. Si no eres de la zona, ¡no hay problema! El desarrollo web lo hacemos para todo el país.';
    }

    // Ayuda / Soporte
    else if (msg.includes('ayuda') || msg.includes('soporte') || msg.includes('problema')) {
        return '¡Claro! Cuéntame qué está pasando con tu equipo o qué proyecto tienes en mente para poder ayudarte mejor.';
    }

    // Respuesta por defecto con CTA (Llamado a la acción)
    else {
        return 'No estoy seguro de entenderte del todo, pero me encantaría ayudarte. ¿Podrías intentar con palabras como "precio", "reparación" o "web"? También puedes escribirnos a yamysystem@outlook.com.';
    }
}