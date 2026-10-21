/**
 * JobWay Gemini AI Chatbot Widget
 * Intelligent website guide powered by Google Gemini API
 */

(function () {
  // Ensure styles are loaded
  if (!document.getElementById('jobway-chat-styles')) {
    const link = document.createElement('link');
    link.id = 'jobway-chat-styles';
    link.rel = 'stylesheet';
    link.href = '/css/chat-widget.css?v=1';
    document.head.appendChild(link);
  }

  // Determine API Base URL
  const getApiBase = () => {
    if (typeof window !== 'undefined' && window.jobApi && window.jobApi.baseUrl) {
      return window.jobApi.baseUrl;
    }
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://127.0.0.1:8787/api';
    }
    if (window.location.hostname.includes('job-way.in')) {
      return 'https://api.job-way.in';
    }
    return 'https://jobconnect-backend.white018899.workers.dev/api';
  };

  // State
  let isOpen = false;
  let isSending = false;
  let conversationHistory = [];

  // Parse markdown into safe HTML
  function formatMarkdown(text) {
    if (!text) return '';
    let html = text
      // Escape HTML tags to prevent injection
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Links [title](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      // Bullet points
      .replace(/^[\*\-•]\s+(.+)$/gm, '<li>$1</li>');

    // Wrap list items in <ul>
    html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
    // Paragraphs
    html = html.split('\n\n').map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<ul>') || p.startsWith('<li>')) return p;
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');

    return html;
  }

  function initChatWidget() {
    // Prevent duplicate initialization
    if (document.getElementById('jobway-chat-root')) return;

    const root = document.createElement('div');
    root.id = 'jobway-chat-root';
    root.innerHTML = `
      <!-- Launcher Button -->
      <div class="jobway-chat-launcher" id="jobway-chat-launcher" title="Ask JobWay AI Guide">
        <div class="jobway-chat-launcher-icon">
          ✨
          <div class="jobway-chat-launcher-pulse"></div>
        </div>
        <span class="jobway-chat-launcher-text">Ask AI Guide</span>
        <span class="jobway-chat-launcher-badge">Vizag</span>
      </div>

      <!-- Chat Modal Window -->
      <div class="jobway-chat-window" id="jobway-chat-window" role="dialog" aria-label="JobWay AI Guide">
        <!-- Header -->
        <div class="jobway-chat-header">
          <div class="jobway-chat-header-info">
            <div class="jobway-chat-header-avatar">✨</div>
            <div>
              <h3 class="jobway-chat-header-title">
                JobWay AI Guide
              </h3>
              <div class="jobway-chat-header-subtitle">
                <span class="jobway-chat-header-dot"></span>
                Visakhapatnam Network • Gemini
              </div>
            </div>
          </div>
          <div class="jobway-chat-header-actions">
            <button type="button" class="jobway-chat-header-btn" id="jobway-chat-settings-toggle" title="Gemini API Key Settings">⚙️</button>
            <button type="button" class="jobway-chat-header-btn" id="jobway-chat-close-btn" title="Close Chat">✕</button>
          </div>
        </div>

        <!-- Settings Panel (Gemini API Key) -->
        <div class="jobway-chat-settings-panel" id="jobway-chat-settings-panel">
          <div class="jobway-chat-settings-title">
            <span>Google Gemini API Key</span>
            <span id="jobway-key-status" style="font-weight: 500; font-size: 11px; color: #059669;">● Ready</span>
          </div>
          <div class="jobway-chat-settings-desc">
            Provide a custom Gemini API key for personalized AI inference, or use the default JobWay system assistant.
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style="color: #059669; text-decoration: underline;">Get free key</a>
          </div>
          <div class="jobway-chat-settings-input-group">
            <input type="password" id="jobway-gemini-key-input" class="jobway-chat-settings-input" placeholder="AIzaSy...">
            <button type="button" id="jobway-gemini-key-save" class="jobway-chat-settings-save-btn">Save Key</button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="jobway-chat-messages" id="jobway-chat-messages">
          <!-- Initial Welcome Message -->
          <div class="jobway-chat-msg bot">
            <div class="jobway-chat-bubble">
              Hello! 👋 I'm your <strong>JobWay AI Guide</strong>.<br><br>
              I can help you navigate Visakhapatnam's verified tech and engineering hiring network, explore open roles, understand candidate unlocks, and answer questions about the platform.
            </div>
            <div class="jobway-chat-suggestions" id="jobway-initial-suggestions">
              <button type="button" class="jobway-chat-pill" data-prompt="How do I find software jobs in Vizag?">🔍 Find Jobs in Vizag</button>
              <button type="button" class="jobway-chat-pill" data-prompt="How can employers hire candidates?">👥 Hire Candidates</button>
              <button type="button" class="jobway-chat-pill" data-prompt="What IT corridors are covered in Visakhapatnam?">📍 IT Corridors Covered</button>
              <button type="button" class="jobway-chat-pill" data-prompt="How does DigiLocker verification work?">🛡️ Verification & DigiLocker</button>
              <button type="button" class="jobway-chat-pill" data-prompt="What are the unlock credit prices?">💳 Pricing & Credits</button>
            </div>
            <div class="jobway-chat-msg-time">Just now</div>
          </div>
        </div>

        <!-- Footer Input -->
        <div class="jobway-chat-footer">
          <form class="jobway-chat-form" id="jobway-chat-form">
            <input 
              type="text" 
              id="jobway-chat-input" 
              class="jobway-chat-input" 
              placeholder="Ask anything about JobWay..." 
              autocomplete="off"
            >
            <button type="submit" class="jobway-chat-send-btn" id="jobway-chat-send-btn" title="Send Message">
              ➤
            </button>
          </form>
          <div class="jobway-chat-branding">
            Guided by <span>Google Gemini AI</span> • Visakhapatnam Hub
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(root);

    // Bind Event Listeners
    const launcher = document.getElementById('jobway-chat-launcher');
    const windowEl = document.getElementById('jobway-chat-window');
    const closeBtn = document.getElementById('jobway-chat-close-btn');
    const settingsBtn = document.getElementById('jobway-chat-settings-toggle');
    const settingsPanel = document.getElementById('jobway-chat-settings-panel');
    const keyInput = document.getElementById('jobway-gemini-key-input');
    const keySaveBtn = document.getElementById('jobway-gemini-key-save');
    const keyStatus = document.getElementById('jobway-key-status');
    const form = document.getElementById('jobway-chat-form');
    const input = document.getElementById('jobway-chat-input');
    const messagesEl = document.getElementById('jobway-chat-messages');

    // Populate existing saved key
    const savedKey = localStorage.getItem('jc_gemini_api_key') || '';
    if (savedKey) {
      keyInput.value = savedKey;
      if (keyStatus) keyStatus.textContent = '● Custom Key Active';
    }

    // Toggle Chat
    const toggleChat = () => {
      isOpen = !isOpen;
      windowEl.classList.toggle('open', isOpen);
      if (isOpen) {
        input.focus();
        scrollBottom();
      }
    };

    launcher.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', () => {
      isOpen = false;
      windowEl.classList.remove('open');
    });

    // Toggle Settings
    settingsBtn.addEventListener('click', () => {
      settingsPanel.classList.toggle('open');
    });

    // Save Key
    keySaveBtn.addEventListener('click', () => {
      const val = keyInput.value.trim();
      if (val) {
        localStorage.setItem('jc_gemini_api_key', val);
        if (keyStatus) {
          keyStatus.textContent = '● Custom Key Saved!';
          keyStatus.style.color = '#059669';
        }
      } else {
        localStorage.removeItem('jc_gemini_api_key');
        if (keyStatus) {
          keyStatus.textContent = '● Using Server / Default';
          keyStatus.style.color = '#6B7280';
        }
      }
      setTimeout(() => {
        settingsPanel.classList.remove('open');
      }, 700);
    });

    // Quick suggestion pills
    root.addEventListener('click', (e) => {
      const pill = e.target.closest('.jobway-chat-pill');
      if (pill && pill.dataset.prompt) {
        sendMessage(pill.dataset.prompt);
      }
    });

    // Submit Message
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (text) {
        sendMessage(text);
        input.value = '';
      }
    });

    function scrollBottom() {
      setTimeout(() => {
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }, 50);
    }

    function appendMessage(sender, text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `jobway-chat-msg ${sender}`;

      const bubbleDiv = document.createElement('div');
      bubbleDiv.className = 'jobway-chat-bubble';
      bubbleDiv.innerHTML = formatMarkdown(text);

      const timeDiv = document.createElement('div');
      timeDiv.className = 'jobway-chat-msg-time';
      const now = new Date();
      timeDiv.textContent = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

      msgDiv.appendChild(bubbleDiv);
      msgDiv.appendChild(timeDiv);
      messagesEl.appendChild(msgDiv);
      scrollBottom();
    }

    function showTyping() {
      const typingDiv = document.createElement('div');
      typingDiv.className = 'jobway-chat-msg bot typing-wrapper';
      typingDiv.id = 'jobway-chat-typing';
      typingDiv.innerHTML = `
        <div class="jobway-chat-typing">
          <div class="jobway-chat-typing-dot"></div>
          <div class="jobway-chat-typing-dot"></div>
          <div class="jobway-chat-typing-dot"></div>
        </div>
      `;
      messagesEl.appendChild(typingDiv);
      scrollBottom();
    }

    function hideTyping() {
      const typing = document.getElementById('jobway-chat-typing');
      if (typing) typing.remove();
    }

    async function sendMessage(text) {
      if (isSending) return;
      isSending = true;

      // Append user message
      appendMessage('user', text);
      conversationHistory.push({ role: 'user', text });

      showTyping();

      const customApiKey = localStorage.getItem('jc_gemini_api_key') || '';
      const apiBase = getApiBase();

      try {
        const res = await fetch(`${apiBase}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: conversationHistory.slice(-6),
            apiKey: customApiKey || undefined
          }),
          signal: AbortSignal.timeout(12000)
        });

        hideTyping();

        if (res.ok) {
          const data = await res.json();
          const reply = data.reply || "I'm here to help you navigate JobWay! Feel free to ask about jobs, candidates, or verification in Visakhapatnam.";
          appendMessage('bot', reply);
          conversationHistory.push({ role: 'model', text: reply });
        } else {
          appendMessage('bot', "Welcome to **JobWay**! You can explore technical jobs on **[Find Jobs](/jobs.html)**, hire engineers on **[Candidates](/candidates.html)**, or manage applications in your **[Worker Desk](/worker.html)**.");
        }
      } catch (err) {
        hideTyping();
        console.warn('Chat request fallback:', err);
        appendMessage('bot', "Welcome to **JobWay Visakhapatnam**! 🌟\n\n• Browse open positions: **[Find Jobs](/jobs.html)**\n• Hire vetted tech specialists: **[Candidates](/candidates.html)**\n• Manage your profile: **[Edit Profile](/profile-edit.html)**\n• Need help signing in? Visit **[Sign In](/login.html)**");
      } finally {
        isSending = false;
      }
    }
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatWidget);
  } else {
    initChatWidget();
  }
})();
