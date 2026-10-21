/**
 * JobWay Gemini AI Chatbot Widget
 * Minimal robot-styled website guide powered securely by Google Gemini API
 */

(function () {
  // Ensure styles are loaded
  if (!document.getElementById('jobway-chat-styles')) {
    const link = document.createElement('link');
    link.id = 'jobway-chat-styles';
    link.rel = 'stylesheet';
    link.href = '/css/chat-widget.css?v=5';
    document.head.appendChild(link);
  }

  // Professional SVG Robot Icon
  const robotSvg = (size = 24) => `
    <svg class="jobway-robot-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2V5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="2" r="1.4" fill="#00D084"/>
      <rect x="3.5" y="5.5" width="17" height="13.5" rx="4" stroke="currentColor" stroke-width="2" fill="rgba(255,255,255,0.06)"/>
      <path d="M1.5 10.5V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M22.5 10.5V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <rect x="6.5" y="8.8" width="11" height="4.6" rx="2" fill="currentColor" fill-opacity="0.18"/>
      <circle cx="9" cy="11.1" r="1.3" fill="#00D084"/>
      <circle cx="15" cy="11.1" r="1.3" fill="#00D084"/>
      <path d="M9.5 15.5H14.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    </svg>
  `;

  // Determine API Base URL
  const getApiBase = () => {
    if (typeof window !== 'undefined' && window.jobApi && window.jobApi.baseUrl) {
      return window.jobApi.baseUrl;
    }
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://127.0.0.1:8787/api';
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

    // Clean up any old client-side key storage
    try {
      localStorage.removeItem('jc_gemini_api_key');
    } catch {}

    const root = document.createElement('div');
    root.id = 'jobway-chat-root';
    root.innerHTML = `
      <!-- Minimalist Floating Robot Launcher -->
      <button type="button" class="jobway-chat-launcher" id="jobway-chat-launcher" aria-label="Open JobWay AI Guide" title="JobWay AI Guide">
        <span class="jobway-chat-launcher-robot">${robotSvg(26)}</span>
        <span class="jobway-chat-launcher-pulse"></span>
      </button>

      <!-- Chat Modal Window -->
      <div class="jobway-chat-window" id="jobway-chat-window" role="dialog" aria-label="JobWay AI Guide">
        <!-- Header -->
        <div class="jobway-chat-header">
          <div class="jobway-chat-header-info">
            <div class="jobway-chat-header-avatar">${robotSvg(22)}</div>
            <div>
              <h3 class="jobway-chat-header-title">
                JobWay AI Guide
              </h3>
              <div class="jobway-chat-header-subtitle">
                <span class="jobway-chat-header-dot"></span>
                Visakhapatnam Assistant • Gemini
              </div>
            </div>
          </div>
          <div class="jobway-chat-header-actions">
            <button type="button" class="jobway-chat-header-btn" id="jobway-chat-close-btn" title="Close Chat" aria-label="Close Chat">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M1 1l12 12M13 1L1 13"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="jobway-chat-messages" id="jobway-chat-messages">
          <!-- Initial Welcome Message -->
          <div class="jobway-chat-msg bot">
            <div class="jobway-chat-bubble">
              Hello! 👋 I'm your <strong>JobWay AI Assistant</strong>.<br><br>
              How can I help you navigate Visakhapatnam's verified tech and engineering hiring network?
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
            <button type="submit" class="jobway-chat-send-btn" id="jobway-chat-send-btn" title="Send Message" aria-label="Send Message">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 2px;">
                <path d="M22 2L11 13"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
              </svg>
            </button>
          </form>
          <div class="jobway-chat-branding">
            Guided by <span>Google Gemini AI</span> • Visakhapatnam
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(root);

    // Bind Event Listeners
    const launcher = document.getElementById('jobway-chat-launcher');
    const windowEl = document.getElementById('jobway-chat-window');
    const closeBtn = document.getElementById('jobway-chat-close-btn');
    const form = document.getElementById('jobway-chat-form');
    const input = document.getElementById('jobway-chat-input');
    const messagesEl = document.getElementById('jobway-chat-messages');

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

    // Close on click outside (mobile & desktop)
    document.addEventListener('click', (e) => {
      if (isOpen && !root.contains(e.target)) {
        isOpen = false;
        windowEl.classList.remove('open');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        isOpen = false;
        windowEl.classList.remove('open');
      }
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

      const apiBase = getApiBase();

      try {
        const res = await fetch(`${apiBase}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: conversationHistory.slice(-6)
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
