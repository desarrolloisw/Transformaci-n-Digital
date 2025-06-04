document.addEventListener("DOMContentLoaded", function () {
    const BACKEND_URL = 'http://localhost:3000';
    const LOGO_URL = '../img/Escudo_Unison.png'; // Cambia por tu logo si lo deseas

    // Crear estilos
    const style = document.createElement("style");
    style.textContent = `
    .chatbot-bubble {
        position: fixed;
        bottom: 32px;
        right: 32px;
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, #0078d4 60%, #00c6fb 100%);
        border-radius: 50%;
        box-shadow: 0 6px 24px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        transition: box-shadow 0.2s, transform 0.3s;
        animation: chatbot-bubble-in 0.4s cubic-bezier(.68,-0.55,.27,1.55);
        border: 3px solid #fff;
    }
    .chatbot-bubble:hover {
        box-shadow: 0 12px 32px rgba(0,0,0,0.35);
        transform: scale(1.10);
        background: linear-gradient(135deg, #005fa3 60%, #00b4d8 100%);
    }
    @keyframes chatbot-bubble-in {
        from { opacity: 0; transform: scale(0.5);}
        to { opacity: 1; transform: scale(1);}
    }
    @keyframes chatbot-bubble-out {
        from { opacity: 1; transform: scale(1);}
        to { opacity: 0; transform: scale(0.5);}
    }
    .chatbot-window {
        position: fixed;
        bottom: 32px;
        right: 32px;
        width: 370px;
        height: 500px;
        background: #fafdff;
        border-radius: 18px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.22);
        display: flex;
        flex-direction: column;
        z-index: 1001;
        overflow: hidden;
        animation: chatbot-fade-in 0.3s cubic-bezier(.68,-0.55,.27,1.55);
        border: 2px solid #0078d4;
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
        background: linear-gradient(90deg, #0078d4 70%, #00c6fb 100%);
        color: #fff;
        padding: 16px 18px;
        font-size: 1.15rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
        letter-spacing: 0.5px;
        border-bottom: 2px solid #e3f2fd;
    }
    .chatbot-header img {
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        border: 2px solid #fff;
    }
    .chatbot-close {
        background: none;
        border: none;
        color: #fff;
        font-size: 1.5rem;
        cursor: pointer;
        transition: color 0.2s;
        font-weight: bold;
    }
    .chatbot-close:hover {
        color: #ffd700;
    }
    .chatbot-body {
        flex: 1;
        padding: 18px 16px 12px 16px;
        background: linear-gradient(120deg, #fafdff 80%, #e3f2fd 100%);
        overflow-y: auto;
        font-size: 1.01rem;
        color: #1a2a3a;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .chatbot-message {
        opacity: 0;
        animation: chatbot-msg-in 0.3s forwards;
        margin-bottom: 4px;
        font-size: 1.01rem;
        line-height: 1.5;
        word-break: break-word;
    }
    .chatbot-message[style*='flex-end'] {
        background: linear-gradient(90deg, #e3f2fd 60%, #b3e0fc 100%);
        color: #0a2540;
        font-weight: 500;
        border: 1px solid #b3e0fc;
    }
    .chatbot-message[style*='flex-start'] {
        background: #fff;
        border: 1px solid #e3f2fd;
        color: #1a2a3a;
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
    .chatbot-body ol, .chatbot-body ul {
        margin: 0 0 0 18px;
        padding: 0 0 0 18px;
    }
    .chatbot-body b {
        color: #0078d4;
    }
    .chatbot-body a {
        color: #0078d4;
        text-decoration: underline;
    }
    .chatbot-body a:hover {
        color: #005fa3;
    }
    .chatbot-body::-webkit-scrollbar {
        width: 8px;
        background: #e3f2fd;
        border-radius: 8px;
    }
    .chatbot-body::-webkit-scrollbar-thumb {
        background: #b3e0fc;
        border-radius: 8px;
    }
    .chatbot-body::-webkit-scrollbar-thumb:hover {
        background: #90caf9;
    }
    .chatbot-body::-webkit-scrollbar-corner {
        background: #e3f2fd;
    }
    .chatbot-body button, .chatbot-body .chatbot-message button {
        margin-top: 2px;
        margin-bottom: 2px;
    }
    .chatbot-body button {
        background: linear-gradient(90deg, #0078d4 70%, #00c6fb 100%);
        color: #fff;
        border: none;
        border-radius: 7px;
        padding: 10px 16px;
        cursor: pointer;
        font-size: 1.05rem;
        font-weight: 500;
        box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        transition: background 0.2s, box-shadow 0.2s, color 0.2s;
    }
    .chatbot-body button:hover:not(:disabled) {
        background: linear-gradient(90deg, #005fa3 70%, #00b4d8 100%);
        color: #ffd700;
        box-shadow: 0 4px 16px rgba(0,0,0,0.13);
    }
    .chatbot-body button:disabled {
        background: #e3f2fd;
        color: #b3b3b3;
        cursor: not-allowed;
        border: 1px solid #b3e0fc;
    }
    `;
    document.head.appendChild(style);

    // Obtener el contenedor
    const container = document.querySelector('.chatbot');

    // Crear la burbuja
    const bubble = document.createElement('div');
    bubble.className = 'chatbot-bubble';
    bubble.innerHTML = `<img src="${LOGO_URL}" alt="Logo" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" />`; // ícono de chat

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
            startChatbotFlow();
        }, 250);
    }

    // --- CONFIGURACIÓN Y ESTADO DEL CHATBOT ---
    const LOGO_URL_CONF = LOGO_URL; // Cambia por tu logo si lo deseas
    let currentStep = 'initial';
    let currentProcessId = null;
    let currentCategoryId = null;
    let historyStack = [];
    let messageHistory = [];
    const MAX_HISTORY = 15;

    // --- UTILIDADES ---
    function clearChat() {
        body.innerHTML = '';
    }

    function saveMessage(msg) {
        messageHistory.push(msg);
        if (messageHistory.length > MAX_HISTORY) messageHistory.shift();
    }

    function renderHistory() {
        clearChat();
        for (const msg of messageHistory) {
            renderMessage(msg.text, msg.isUser, msg.options, msg.disabledOptions, true);
        }
    }

    // --- RENDERIZADO DE MENSAJES Y OPCIONES ---
    function renderMessage(text, isUser = false, options = null, disabledOptions = [], isHistory = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'chatbot-message';
        msgDiv.style.alignSelf = isUser ? 'flex-end' : 'flex-start';
        msgDiv.style.background = isUser ? '#e6f0fa' : 'transparent';
        msgDiv.style.padding = '6px 10px';
        msgDiv.style.borderRadius = '8px';
        msgDiv.style.maxWidth = '90%';
        msgDiv.style.marginBottom = '2px';
        if (isUser) {
            msgDiv.textContent = text;
        } else {
            msgDiv.innerHTML = text;
        }
        body.appendChild(msgDiv);
        // Si hay opciones, renderizarlas justo después del mensaje
        if (options && options.length > 0) {
            renderOptions(options, null, disabledOptions, isHistory);
        }
        body.scrollTop = body.scrollHeight;
    }

    function renderOptions(options, onSelect, disabledOptions = [], isHistory = false) {
        const optionsDiv = document.createElement('div');
        optionsDiv.style.display = 'flex';
        optionsDiv.style.flexDirection = 'column';
        optionsDiv.style.gap = '8px';
        options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.textContent = `${idx + 1}. ${opt.label}`;
            btn.style.background = '#0078d4';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.borderRadius = '6px';
            btn.style.padding = '8px 12px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '1rem';
            if (disabledOptions.includes(opt.id) || isHistory) {
                btn.disabled = true;
                btn.style.opacity = 0.5;
                btn.style.cursor = 'not-allowed';
            } else if (onSelect) {
                btn.addEventListener('click', () => onSelect(opt, idx));
            }
            optionsDiv.appendChild(btn);
        });
        body.appendChild(optionsDiv);
        body.scrollTop = body.scrollHeight;
    }

    function renderNavigation(navigation) {
        if (!navigation || navigation.length === 0) return;
        const navDiv = document.createElement('div');
        navDiv.style.display = 'flex';
        navDiv.style.gap = '8px';
        navDiv.style.marginTop = '10px';
        navigation.forEach(nav => {
            const btn = document.createElement('button');
            btn.textContent = nav.label;
            btn.style.background = '#e6e6e6';
            btn.style.color = '#0078d4';
            btn.style.border = 'none';
            btn.style.borderRadius = '6px';
            btn.style.padding = '6px 10px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '0.95rem';
            btn.addEventListener('click', () => {
                if (nav.action === 'back') {
                    startChatbotFlow();
                } else if (nav.action === 'backToProcess') {
                    fetchCategories(currentProcessId, true);
                }
            });
            navDiv.appendChild(btn);
        });
        body.appendChild(navDiv);
        body.scrollTop = body.scrollHeight;
    }

    // Llama a la API del backend
    async function callChatbotAPI(payload) {
        try {
            const res = await fetch(`${BACKEND_URL}/api/chatbot/static`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) {
                // Muestra el error real del backend en el chat
                renderMessage(data.error || 'Error en el chatbot', false);
                throw new Error(data.error || 'Error en el chatbot');
            }
            return data;
        } catch (err) {
            renderMessage('Error de conexión o formato de datos', false);
            throw err;
        }
    }

    // Flujo inicial: muestra procesos
    async function startChatbotFlow() {
        currentStep = 'initial';
        currentProcessId = null;
        currentCategoryId = null;
        historyStack = [];
        messageHistory = [];
        clearChat();
        await showTyping(700);
        const welcome1 = '¡Hola! Bienvenido al chatbot del Departamento de Ciencias del Deporte de la UNISON.';
        const welcome2 = '¿Con qué proceso puedo ayudarte hoy?';
        renderMessage(welcome1, false);
        saveMessage({ text: welcome1, isUser: false });
        await showTyping(600);
        renderMessage(welcome2, false);
        saveMessage({ text: welcome2, isUser: false });
        const data = await callChatbotAPI({ step: 'initial' });
        renderOptions(data.options, (opt, idx) => {
            renderMessage(`${idx + 1}. ${opt.label}`, true);
            saveMessage({ text: `${idx + 1}. ${opt.label}`, isUser: true });
            currentStep = 'process';
            currentProcessId = opt.id;
            historyStack.push({ step: 'initial' });
            fetchCategories(opt.id);
        });
        saveMessage({ text: '', isUser: false, options: data.options, disabledOptions: [] });
    }

    async function fetchCategories(processId, fromNav = false) {
        renderHistory();
        await showTyping(600);
        const msg = '¿Con qué puedo ayudarte?';
        renderMessage(msg, false);
        saveMessage({ text: msg, isUser: false });
        const data = await callChatbotAPI({ step: 'process', processId });
        renderOptions(data.options, (opt, idx) => {
            renderMessage(`${idx + 1}. ${opt.label}`, true);
            saveMessage({ text: `${idx + 1}. ${opt.label}`, isUser: true });
            currentStep = 'category';
            currentCategoryId = opt.id;
            historyStack.push({ step: 'process', processId });
            fetchCategoryResponse(opt.id);
        });
        // Deshabilitar opciones previas
        saveMessage({ text: '', isUser: false, options: data.options, disabledOptions: [] });
        renderNavigation(data.navigation);
    }

    async function fetchCategoryResponse(categoryId) {
        renderHistory();
        await showTyping(600);
        const data = await callChatbotAPI({ step: 'category', categoryId, processId: currentProcessId });
        renderMessage(data.message, false);
        saveMessage({ text: data.message, isUser: false });
        renderNavigation(data.navigation);
    }

    // --- SOBREESCRIBIR showWelcomeMessages PARA FLUJO REAL ---
    showWelcomeMessages = startChatbotFlow;

    // --- EVENTOS PARA ABRIR/CERRAR ---
    bubble.addEventListener('click', openChatWindow);
    header.querySelector('.chatbot-close').addEventListener('click', closeChatWindow);

    // --- MOSTRAR HISTÓRICO AL ABRIR ---
    function openChatWindow() {
        bubble.style.animation = "chatbot-bubble-out 0.3s cubic-bezier(.68,-0.55,.27,1.55)";
        setTimeout(() => {
            bubble.style.display = 'none';
            chatWindow.style.display = 'flex';
            chatWindow.style.animation = "chatbot-fade-in 0.3s cubic-bezier(.68,-0.55,.27,1.55)";
            startChatbotFlow();
        }, 250);
    }

    // --- LOGO EN HEADER ---
    const logoImg = document.createElement('img');
    logoImg.src = LOGO_URL;
    logoImg.alt = 'Logo';
    logoImg.style.height = '32px';
    logoImg.style.marginRight = '8px';
    header.insertBefore(logoImg, header.firstChild);

    // --- CIERRE CON ESCAPE ---
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && chatWindow.style.display === 'flex') {
            closeChatWindow();
        }
    });
});