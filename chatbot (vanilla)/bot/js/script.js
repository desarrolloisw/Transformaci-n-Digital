document.addEventListener("DOMContentLoaded", function () {
    // Crear estilos
    const style = document.createElement("style");
    style.textContent = `
    .chatbot-bubble {
        position: fixed;
        bottom: 32px;
        right: 32px;
        width: 64px;
        height: 64px;
        background: #0078d4;
        border-radius: 50%;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        transition: box-shadow 0.2s, transform 0.3s;
        animation: chatbot-bubble-in 0.4s cubic-bezier(.68,-0.55,.27,1.55);
    }
    .chatbot-bubble:hover {
        box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        transform: scale(1.08);
    }
    @keyframes chatbot-bubble-in {
        from { opacity: 0; transform: scale(0.5);}
        to { opacity: 1; transform: scale(1);}
    }
    @keyframes chatbot-bubble-out {
        from { opacity: 1; transform: scale(1);}
        to { opacity: 0; transform: scale(0.5);}
    }
    .chatbot-bubble-icon {
        color: #fff;
        font-size: 2rem;
        user-select: none;
    }
    .chatbot-window {
        position: fixed;
        bottom: 32px;
        right: 32px;
        width: 340px;
        height: 440px;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        display: flex;
        flex-direction: column;
        z-index: 1001;
        overflow: hidden;
        animation: chatbot-fade-in 0.3s cubic-bezier(.68,-0.55,.27,1.55);
    }
    @keyframes chatbot-fade-in {
        from { opacity: 0; transform: translateY(40px) scale(0.95);}
        to { opacity: 1; transform: translateY(0) scale(1);}
    }
    @keyframes chatbot-fade-out {
        from { opacity: 1; transform: translateY(0) scale(1);}
        to { opacity: 0; transform: translateY(40px) scale(0.95);}
    }
    .chatbot-header {
        background: #0078d4;
        color: #fff;
        padding: 16px;
        font-size: 1.1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .chatbot-close {
        background: none;
        border: none;
        color: #fff;
        font-size: 1.3rem;
        cursor: pointer;
        transition: color 0.2s;
    }
    .chatbot-close:hover {
        color: #ffd700;
    }
    .chatbot-body {
        flex: 1;
        padding: 16px;
        background: #f4f6fa;
        overflow-y: auto;
        font-size: 0.95rem;
        color: #222;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .chatbot-message {
        opacity: 0;
        animation: chatbot-msg-in 0.3s forwards;
    }
    @keyframes chatbot-msg-in {
        from { opacity: 0; transform: translateY(10px);}
        to { opacity: 1; transform: translateY(0);}
    }
    .chatbot-typing {
        display: inline-block;
        width: 1.2em;
        height: 1.2em;
        vertical-align: middle;
        margin-left: 4px;
    }
    .chatbot-typing span {
        display: inline-block;
        width: 0.3em;
        height: 0.3em;
        margin: 0 0.05em;
        background: #0078d4;
        border-radius: 50%;
        opacity: 0.6;
        animation: chatbot-typing-bounce 1s infinite alternate;
    }
    .chatbot-typing span:nth-child(2) { animation-delay: 0.1s;}
    .chatbot-typing span:nth-child(3) { animation-delay: 0.2s;}
    @keyframes chatbot-typing-bounce {
        to { opacity: 1; transform: translateY(-0.2em);}
    }
    `;
    document.head.appendChild(style);

    // Obtener el contenedor
    const container = document.querySelector('.chatbot');

    // Crear la burbuja
    const bubble = document.createElement('div');
    bubble.className = 'chatbot-bubble';
    bubble.innerHTML = `<span class="chatbot-bubble-icon">&#128172;</span>`; // ícono de chat

    // Crear la ventana del chat (oculta por defecto)
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chatbot-window';
    chatWindow.style.display = 'none';

    // Header del chat
    const header = document.createElement('div');
    header.className = 'chatbot-header';
    header.innerHTML = `
        <span>Chatbot</span>
        <button class="chatbot-close" title="Cerrar">&times;</button>
    `;

    // Cuerpo del chat (mock)
    const body = document.createElement('div');
    body.className = 'chatbot-body';

    // Armar ventana
    chatWindow.appendChild(header);
    chatWindow.appendChild(body);

    // Añadir al DOM
    container.appendChild(bubble);
    container.appendChild(chatWindow);

    // Animación de escritura simulada
    function typeMessage(text, delay = 20) {
        return new Promise(resolve => {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chatbot-message';
            body.appendChild(msgDiv);

            let i = 0;
            function typeChar() {
                msgDiv.textContent = text.slice(0, i);
                i++;
                if (i <= text.length) {
                    setTimeout(typeChar, delay);
                } else {
                    resolve();
                }
            }
            typeChar();
        });
    }

    // Animación de "escribiendo..."
    function showTyping(duration = 300) {
        return new Promise(resolve => {
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chatbot-message';
            typingDiv.innerHTML = `<span class="chatbot-typing">
                <span></span><span></span><span></span>
            </span>`;
            body.appendChild(typingDiv);
            setTimeout(() => {
                typingDiv.remove();
                resolve();
            }, duration);
        });
    }

    // Mostrar mensajes de bienvenida con animación
    async function showWelcomeMessages() {
        body.innerHTML = ""; // Limpiar
        await showTyping(900);
        await typeMessage("¡Hola! 👋");
        await showTyping(700);
        await typeMessage("¿En qué puedo ayudarte hoy?");
    }

    // Animación de cierre de ventana
    function closeChatWindow() {
        chatWindow.style.animation = "chatbot-fade-out 0.3s cubic-bezier(.68,-0.55,.27,1.55)";
        setTimeout(() => {
            chatWindow.style.display = 'none';
            chatWindow.style.animation = "";
            bubble.style.display = 'flex';
            bubble.style.animation = "chatbot-bubble-in 0.4s cubic-bezier(.68,-0.55,.27,1.55)";
        }, 280);
    }

    // Animación de apertura de ventana
    function openChatWindow() {
        bubble.style.animation = "chatbot-bubble-out 0.3s cubic-bezier(.68,-0.55,.27,1.55)";
        setTimeout(() => {
            bubble.style.display = 'none';
            chatWindow.style.display = 'flex';
            chatWindow.style.animation = "chatbot-fade-in 0.3s cubic-bezier(.68,-0.55,.27,1.55)";
            showWelcomeMessages();
        }, 250);
    }

    // Eventos para abrir/cerrar
    bubble.addEventListener('click', openChatWindow);

    header.querySelector('.chatbot-close').addEventListener('click', closeChatWindow);
});