document.addEventListener("DOMContentLoaded", function () {
    const BACKEND_URL = 'http://localhost:3000'; // Cambia por la URL de tu backend
    const LOGO_URL = '../img/Escudo_Unison.png'; // Cambia por tu logo

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
        box-shadow: 0 8px 32px rgba(0,0,0,0.28);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        transition: box-shadow 0.18s, transform 0.22s;
        animation: chatbot-bubble-in 0.35s cubic-bezier(.68,-0.55,.27,1.55);
        border: 3.5px solid #fff;
        filter: drop-shadow(0 0 8px #00c6fb33);
    }
    .chatbot-bubble:hover {
        box-shadow: 0 16px 40px rgba(0,0,0,0.38);
        transform: scale(1.10) rotate(-2deg);
        background: linear-gradient(135deg, #005fa3 60%, #00b4d8 100%);
    }
    @keyframes chatbot-bubble-in {
        from { opacity: 0; transform: scale(0.5) rotate(-10deg);}
        to { opacity: 1; transform: scale(1) rotate(0);}
    }
    .chatbot-window {
        position: fixed;
        bottom: 32px;
        right: 32px;
        width: 380px;
        height: 520px;
        background: #fafdff;
        border-radius: 20px;
        box-shadow: 0 16px 48px rgba(0,0,0,0.22);
        display: flex;
        flex-direction: column;
        z-index: 1001;
        overflow: hidden;
        animation: chatbot-fade-in 0.28s cubic-bezier(.68,-0.55,.27,1.55);
        border: 2.5px solid #0078d4;
        filter: drop-shadow(0 0 12px #00c6fb22);
    }
    @keyframes chatbot-fade-in {
        from { opacity: 0; transform: translateY(40px) scale(0.95);}
        to { opacity: 1; transform: translateY(0) scale(1);}
    }
    @keyframes chatbot-fade-out {
        from { opacity: 1; transform: translateY(0) scale(1);}
        to { opacity: 0; transform: translateY(60px) scale(0.93);}
    }
    .chatbot-header {
        background: linear-gradient(90deg, #0078d4 70%, #00c6fb 100%);
        color: #fff;
        padding: 15px 20px 13px 16px;
        font-size: 1.13rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 700;
        letter-spacing: 0.6px;
        border-bottom: 2px solid #e3f2fd;
        box-shadow: 0 2px 12px #00c6fb11;
    }
    .chatbot-header img {
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.10);
        border: 2.5px solid #fff;
        margin-right: 8px;
    }
    .chatbot-close {
        background: none;
        border: none;
        color: #fff;
        font-size: 1.5rem;
        cursor: pointer;
        transition: color 0.18s, transform 0.18s;
        font-weight: bold;
        margin-left: 8px;
    }
    .chatbot-close:hover {
        color: #ffd700;
        transform: scale(1.13) rotate(7deg);
    }
    .chatbot-body {
        flex: 1;
        padding: 18px 14px 12px 14px;
        background: linear-gradient(120deg, #fafdff 80%, #e3f2fd 100%);
        overflow-y: auto;
        font-size: 1.04rem;
        color: #1a2a3a;
        display: flex;
        flex-direction: column;
        gap: 10px;
        scroll-behavior: smooth;
    }
    .chatbot-message {
        opacity: 0;
        animation: chatbot-msg-in 0.28s forwards cubic-bezier(.68,-0.55,.27,1.55);
        margin-bottom: 5px;
        font-size: 1.04rem;
        line-height: 1.55;
        word-break: break-word;
        box-shadow: 0 2px 10px #0078d41a;
        transition: background 0.18s, color 0.18s, box-shadow 0.18s;
    }
    .chatbot-message[style*='flex-end'] {
        background: linear-gradient(90deg, #e3f2fd 60%, #b3e0fc 100%);
        color: #0a2540;
        font-weight: 500;
        border: 1.2px solid #b3e0fc;
        border-bottom-right-radius: 15px;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 7px;
        border-top-right-radius: 7px;
        box-shadow: 0 2px 10px #00c6fb22;
    }
    .chatbot-message[style*='flex-start'] {
        background: #fff;
        border: 1.2px solid #e3f2fd;
        color: #1a2a3a;
        border-bottom-left-radius: 15px;
        border-top-right-radius: 15px;
        border-bottom-right-radius: 7px;
        border-top-left-radius: 7px;
        box-shadow: 0 2px 10px #0078d41a;
    }
    @keyframes chatbot-msg-in {
        from { opacity: 0; transform: translateY(12px) scale(0.97);}
        to { opacity: 1; transform: translateY(0) scale(1);}
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
        width: 0.32em;
        height: 0.32em;
        margin: 0 0.07em;
        background: #00c6fb;
        border-radius: 50%;
        opacity: 0.7;
        animation: chatbot-typing-bounce 0.85s infinite alternate;
    }
    .chatbot-typing span:nth-child(2) { animation-delay: 0.09s;}
    .chatbot-typing span:nth-child(3) { animation-delay: 0.18s;}
    @keyframes chatbot-typing-bounce {
        to { opacity: 1; transform: translateY(-0.22em);}
    }
    .chatbot-body button, .chatbot-body .chatbot-message button {
        margin-top: 2px;
        margin-bottom: 2px;
    }
    .chatbot-body button {
        background: linear-gradient(90deg, #0078d4 70%, #00c6fb 100%);
        color: #fff;
        border: none;
        border-radius: 9px;
        padding: 10px 18px;
        cursor: pointer;
        font-size: 1.04rem;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0,0,0,0.09);
        transition: background 0.16s, box-shadow 0.16s, color 0.16s, transform 0.13s;
        letter-spacing: 0.15px;
    }
    .chatbot-body button:hover:not(:disabled) {
        background: linear-gradient(90deg, #005fa3 70%, #00b4d8 100%);
        color: #ffd700;
        box-shadow: 0 4px 14px rgba(0,0,0,0.13);
        transform: scale(1.03);
    }
    .chatbot-body button:disabled {
        background: #e3f2fd;
        color: #b3b3b3;
        cursor: not-allowed;
        border: 1.2px solid #b3e0fc;
    }
    .chatbot-footer {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, #fafdff 80%, #e3f2fd 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        height: 56px;
        border-top: 1.5px solid #e3f2fd;
        z-index: 1002;
        box-shadow: 0 -2px 10px #00c6fb11;
    }
    `;
    style.textContent += `
    @media (max-width: 600px) {
        .chatbot-bubble {
            bottom: 18px;
            right: 18px;
            width: 54px;
            height: 54px;
        }
        .chatbot-window {
            width: 100dvw;
            min-width: 0;
            max-width: 100dvw;
            height: 100dvh; 
            min-height: 0;
            max-height: 100dvh;
            bottom: 0;
            right: 0;
            left: 0;
            border-radius: 0 0 0 0;
            border-width: 0 0 2.5px 0;
        }
        .chatbot-header {
            font-size: 1.05rem;
            padding: 13px 10px 11px 10px;
        }
        .chatbot-body {
            padding: 12px 5px 8px 5px;
            font-size: 0.98rem;
        }
        .chatbot-footer {
            height: 48px;
            font-size: 0.98rem;
        }
        .chatbot-message {
            font-size: 0.98rem;
            padding: 5px 7px;
        }
        .chatbot-options-group button {
            font-size: 0.98rem;
            padding: 8px 8px;
        }
        .chatbot-nav-group button {
            font-size: 0.93rem;
            padding: 6px 7px;
        }
    }
    @media (max-width: 400px) {
        .chatbot-window {
            width: 100dvw;
            height: 100dvh;
            border-radius: 0;
        }
        .chatbot-header {
            font-size: 0.98rem;
        }
        .chatbot-body {
            font-size: 0.93rem;
        }
        .chatbot-footer {
            font-size: 0.93rem;
        }
        .chatbot-message {
            font-size: 0.93rem;
        }
        .chatbot-options-group button {
            font-size: 0.93rem;
        }
        .chatbot-nav-group button {
            font-size: 0.91rem;
        }
    }
    @media (max-width: 350px) {
        .chatbot-header, .chatbot-footer {
            font-size: 0.89rem;
        }
        .chatbot-body, .chatbot-message, .chatbot-options-group button {
            font-size: 0.89rem;
        }
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

    // --- BOTÓN REINICIAR CHAT EN FOOTER ---
    const footer = document.createElement('div');
    footer.className = 'chatbot-footer';
    footer.style.position = 'absolute';
    footer.style.left = '0';
    footer.style.right = '0';
    footer.style.bottom = '0';
    footer.style.background = 'linear-gradient(90deg, #fafdff 80%, #e3f2fd 100%)';
    footer.style.display = 'flex';
    footer.style.justifyContent = 'center';
    footer.style.alignItems = 'center';
    footer.style.height = '56px';
    footer.style.borderTop = '1.5px solid #e3f2fd';
    footer.style.zIndex = '1002';

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reiniciar chat';
    resetBtn.style.background = 'linear-gradient(90deg, #0078d4 70%, #00c6fb 100%)';
    resetBtn.style.color = '#fff';
    resetBtn.style.border = 'none';
    resetBtn.style.borderRadius = '7px';
    resetBtn.style.padding = '10px 24px';
    resetBtn.style.cursor = 'pointer';
    resetBtn.style.fontSize = '1.05rem';
    resetBtn.style.fontWeight = '500';
    resetBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
    resetBtn.addEventListener('click', () => {
        chatStarted = false;
        startChatbotFlow(true);
    });
    footer.appendChild(resetBtn);
    chatWindow.appendChild(footer);

    // Ajustar el padding inferior del body para que no tape el footer
    body.style.paddingBottom = '70px';

    // Añadir al DOM
    container.appendChild(bubble);
    container.appendChild(chatWindow);

    // Animación de escritura simulada
    function typeMessage(text, delay = 8) {
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
                    requestAnimationFrame(() => {
                        msgDiv.style.opacity = 1;
                        body.scrollTop = body.scrollHeight;
                        resolve();
                    });
                }
            }
            typeChar();
        });
    }

    // Animación de "escribiendo..."
    function showTyping(duration = 250) {
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
            if (messageHistory.length > 0) {
                renderHistory();
                const lastMsg = messageHistory[messageHistory.length - 1];
                // Solo mostrar opciones si el último mensaje tiene opciones
                if (lastMsg && lastMsg.options && lastMsg.options.length > 0) {
                    const disabled = lastMsg.disabledOptions || [];
                    if (!disabled.length) {
                        renderOptions(lastMsg.options, (opt, idx) => {
                            renderMessage(`${idx + 1}. ${opt.label}`, true);
                            saveMessage({ text: `${idx + 1}. ${opt.label}`, isUser: true });
                            if (currentStep === 'process') {
                                currentStep = 'category';
                                currentCategoryId = opt.id;
                                historyStack.push({ step: 'process', processId: currentProcessId });
                                fetchCategoryResponse(opt.id);
                            } else if (currentStep === 'initial') {
                                currentStep = 'process';
                                currentProcessId = opt.id;
                                historyStack.push({ step: 'initial' });
                                fetchCategories(opt.id);
                            }
                        }, disabled, false);
                    } else {
                        renderOptions(lastMsg.options, null, disabled, true);
                    }
                }
                // Mostrar navegación si existe
                if (lastMsg && lastMsg.navigation && lastMsg.navigation.length > 0) {
                    renderNavigation(lastMsg.navigation);
                }
            } else {
                startChatbotFlow();
            }
        }, 250);
    }

    // --- ELIMINAR MENSAJES VACÍOS ---
    function removeEmptyMessages() {
        const emptyMsgs = body.querySelectorAll('.chatbot-message');
        emptyMsgs.forEach(msg => {
            if (!msg.textContent.trim() && !msg.innerHTML.replace(/<[^>]+>/g, '').trim()) {
                msg.remove();
            }
        });
    }

    // --- CONFIGURACIÓN Y ESTADO DEL CHATBOT ---
    let currentStep = 'initial';
    let currentProcessId = null;
    let currentCategoryId = null;
    let historyStack = [];
    let messageHistory = [];
    const MAX_HISTORY = 15;
    let chatStarted = false;

    // --- UTILIDADES ---
    function clearChat() {
        body.innerHTML = '';
    }

    function saveMessage(msg) {
        // Solo los mensajes "históricos" (no los de opciones) cuentan para el límite
        if (!msg.options) {
            messageHistory.push(msg);
            // Filtrar solo los mensajes históricos para el límite
            const historicMessages = messageHistory.filter(m => !m.options);
            while (historicMessages.length > MAX_HISTORY) {
                // Elimina el primer mensaje histórico y su posición real en messageHistory
                const idx = messageHistory.findIndex(m => !m.options);
                if (idx !== -1) messageHistory.splice(idx, 1);
                historicMessages.shift();
            }
        } else {
            // Los mensajes de opciones se guardan normalmente
            messageHistory.push(msg);
        }
    }

    function renderHistory() {
        clearChat();
        // Encuentra el último mensaje con opciones
        let lastOptionsIdx = -1;
        for (let i = messageHistory.length - 1; i >= 0; i--) {
            if (messageHistory[i].options && messageHistory[i].options.length > 0) {
                lastOptionsIdx = i;
                break;
            }
        }
        // Si el último mensaje del historial tiene opciones, solo renderiza esas opciones
        if (lastOptionsIdx === messageHistory.length - 1) {
            for (let i = 0; i < messageHistory.length; i++) {
                const msg = messageHistory[i];
                if (i === lastOptionsIdx) {
                    // Solo la última opción debe estar habilitada
                    renderMessage(msg.text, msg.isUser, msg.options, [], false);
                } else {
                    renderMessage(msg.text, msg.isUser, null, [], false);
                }
            }
        } else {
            // Si el último mensaje NO tiene opciones, renderiza solo los mensajes (sin opciones)
            for (let i = 0; i < messageHistory.length; i++) {
                const msg = messageHistory[i];
                renderMessage(msg.text, msg.isUser, null, [], false);
            }
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
        if (options && options.length > 0) {
            renderOptions(options, null, disabledOptions, isHistory);
        }
        requestAnimationFrame(() => {
            body.scrollTop = body.scrollHeight;
        });
        removeEmptyMessages();
    }

    // Limpia todos los botones de opciones y navegación
    function clearOptionButtons() {
        // Elimina todos los divs de opciones y navegación
        const optionDivs = body.querySelectorAll('.chatbot-options-group, .chatbot-nav-group');
        optionDivs.forEach(div => div.remove());
    }

    function renderOptions(options, onSelect, disabledOptions = [], isHistory = false) {
        clearOptionButtons();
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'chatbot-options-group';
        optionsDiv.style.display = 'flex';
        optionsDiv.style.flexDirection = 'column';
        optionsDiv.style.gap = '7px';
        options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.textContent = `${idx + 1}. ${opt.label}`;
            btn.style.background = '#0078d4';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.borderRadius = '7px';
            btn.style.padding = '8px 12px';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '1rem';
            if (disabledOptions.includes(opt.id) || isHistory) {
                btn.disabled = true;
                btn.style.opacity = 0.5;
                btn.style.cursor = 'not-allowed';
            } else if (onSelect) {
                btn.addEventListener('click', () => {
                    optionsDiv.remove();
                    onSelect(opt, idx);
                });
            }
            optionsDiv.appendChild(btn);
        });
        body.appendChild(optionsDiv);
        requestAnimationFrame(() => {
            body.scrollTop = body.scrollHeight;
        });
        removeEmptyMessages();
    }

    function renderNavigation(navigation) {
        // Elimina navegación previa
        const prevNav = body.querySelector('.chatbot-nav-group');
        if (prevNav) prevNav.remove();
        if (!navigation || navigation.length === 0) return;
        const navDiv = document.createElement('div');
        navDiv.className = 'chatbot-nav-group';
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
            btn.addEventListener('click', async () => {
                navDiv.remove();
                clearOptionButtons();
                if (nav.action === 'back') {
                    renderMessage(nav.label, true);
                    saveMessage({ text: nav.label, isUser: true });
                    await showInitialOptionsAgain();
                } else if (nav.action === 'backToProcess') {
                    renderMessage(nav.label, true);
                    saveMessage({ text: nav.label, isUser: true });
                    await showCategoriesAgain();
                }
            });
            navDiv.appendChild(btn);
        });
        body.appendChild(navDiv);
        body.scrollTop = body.scrollHeight;
        // --- GUARDAR NAVEGACIÓN EN EL ÚLTIMO MENSAJE DEL HISTORIAL ---
        if (messageHistory.length > 0) {
            messageHistory[messageHistory.length - 1].navigation = navigation;
        }
    }

    // Mostrar procesos (inicio) sin limpiar historial ni bienvenida
    async function showInitialOptionsAgain() {
        const msg = '¿Con qué proceso puedo ayudarte hoy?';
        renderMessage(msg, false);
        saveMessage({ text: msg, isUser: false });
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

    // Nueva función para mostrar categorías como mensaje al volver
    async function showCategoriesAgain() {
        // No limpiar historial
        const msg = '¿Con qué puedo ayudarte?';
        renderMessage(msg, false);
        saveMessage({ text: msg, isUser: false });
        const data = await callChatbotAPI({ step: 'process', processId: currentProcessId });
        renderOptions(data.options, (opt, idx) => {
            renderMessage(`${idx + 1}. ${opt.label}`, true);
            saveMessage({ text: `${idx + 1}. ${opt.label}`, isUser: true });
            currentStep = 'category';
            currentCategoryId = opt.id;
            historyStack.push({ step: 'process', processId: currentProcessId });
            fetchCategoryResponse(opt.id);
        });
        saveMessage({ text: '', isUser: false, options: data.options, disabledOptions: [] });
        renderNavigation(data.navigation);
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
    async function startChatbotFlow(forceRestart = false) {
        if (chatStarted && !forceRestart) {
            renderHistory();
            return;
        }
        currentStep = 'initial';
        currentProcessId = null;
        currentCategoryId = null;
        historyStack = [];
        messageHistory = [];
        chatStarted = true;
        clearChat();
        // Solo mostrar bienvenida si es el primer mensaje
        await showTyping(700);
        const welcome1 = '¡Hola! Bienvenido al chatbot del Departamento de Ciencias del Deporte de la UNISON.';
        const welcome2 = '¿Con qué proceso puedo ayudarte hoy?';
        renderMessage(welcome1, false);
        saveMessage({ text: welcome1, isUser: false });
        await showTyping(600);
        renderMessage(welcome2, false);
        saveMessage({ text: welcome2, isUser: false });
        const data = await callChatbotAPI({ step: 'initial' });
        if (!data.options || data.options.length === 0) {
            renderMessage('No hay servicios disponibles en este momento. Por favor, intenta más tarde.', false);
            saveMessage({ text: 'No hay servicios disponibles en este momento. Por favor, intenta más tarde.', isUser: false });
            return;
        }
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
        if (!data.options || data.options.length === 0) {
            renderMessage('No hay categorías disponibles en este momento para este proceso.', false);
            saveMessage({ text: 'No hay categorías disponibles en este momento para este proceso.', isUser: false });
            return;
        }
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
        // Elimina navegación previa y opciones previas
        clearOptionButtons();
        await showTyping(600);
        const data = await callChatbotAPI({ step: 'category', categoryId, processId: currentProcessId });
        renderMessage(data.message, false);
        saveMessage({ text: data.message, isUser: false });
        // Solo renderiza navegación (volver al inicio o volver a categorías)
        renderNavigation(data.navigation);
    }

    // --- SOBREESCRIBIR showWelcomeMessages PARA FLUJO REAL ---
    showWelcomeMessages = startChatbotFlow;

    // --- EVENTOS PARA ABRIR/CERRAR ---
    bubble.addEventListener('click', openChatWindow);
    header.querySelector('.chatbot-close').addEventListener('click', closeChatWindow);

    // --- LOGO EN HEADER ---
    const logoImg = document.createElement('img');
    logoImg.src = LOGO_URL;
    logoImg.alt = 'Logo';
    logoImg.style.height = '32px';
    logoImg.style.width = '32px';
    logoImg.style.marginRight = '8px';
    header.insertBefore(logoImg, header.firstChild);

    // --- CIERRE CON ESCAPE ---
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && chatWindow.style.display === 'flex') {
            closeChatWindow();
        }
    });
});