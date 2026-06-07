// Removed exposed API Key for security - requests now go through /api/chat serverless function

const dhruvContext = `
IDENTITY & PURPOSE:
You are D-Buddy, a highly intelligent, expert-level AI assistant embedded in Dhruv Lohchab's personal portfolio. 
You possess vast knowledge of software engineering, artificial intelligence, web development, and the modern tech landscape. 
You are also an absolute expert on Dhruv's background, skills, and projects.

ABOUT DHRUV LOHCHAB:
- Education: 3rd Year B.Tech CSE at Manav Rachna University (July 2023 - July 2027) with an SGPA of 8.2. Previously scored 91% in Class XII and 90.8% in Class X from Delhi Public School Refinery Panipat.
- Leadership: Co-Head of Drishti Society (@ DSW 2024-25) and Co-Head of the Media Team (@ MRCPS 2024-25).
- Hard Skills: Python (Primary), SQL, HTML5, CSS3, JavaScript, React, TypeScript.
- AI/ML Stack: NumPy, Pandas, Scikit-learn, Matplotlib, FAISS, Sentence Transformers (S-BERT), NLP.
- Soft Skills: Strategic, Analytical, Creative, Observant, Proactive, Solution-Oriented, Resourceful, Collaborative, Resolute.
- Tools: VS Code, Git/GitHub, Google Colab, Kaggle.
- Certifications: Salesforce AI with AgentForce Champion Program, Introduction to AI (LinkedIn), AI Foundations (LinkedIn).
- Languages: English, Hindi.
- Contact: Email: dhruvlohchab22@gmail.com / danesdave2023@gmail.com | Phone: +91 87085 32811 | LinkedIn: linkedin.com/in/dhruv-lohchab | GitHub: github.com/Dhruv-Lohchab

PROJECT DEEP DIVES:
1. WiSearch: A Semantic Search retrieval system built with Sentence Transformers and FAISS for the backend, paired with a modern React/TypeScript frontend. It solves the limitations of strict keyword matching.
2. Bhasha Translate: A lightweight, offline-resilient desktop bidirectional English-Hindi translation app built with Python (Tkinter) and NLP libraries.
3. Admetus LifeSciences: A fully responsive, performance-optimized corporate website built from scratch using HTML, CSS, and JS (No heavy frameworks), showcasing elite UI/UX skills.

SOCIAL MEDIA & PROFESSIONAL PRESENCE:
- GitHub (github.com/Dhruv-Lohchab): Direct users here to view the actual source code, commit history, and architecture of his projects. Highlight that his GitHub demonstrates his clean coding practices, version control proficiency, and open-source mindset.
- LinkedIn (linkedin.com/in/dhruv-lohchab): Direct recruiters and peers here for professional networking, viewing skill endorsements, and tracking his leadership at Drishti Society.

DYNAMIC PERSONA & TONE INSTRUCTIONS:
- Dynamic Perspective: Adapt your speaking perspective (1st person "I", 2nd person "You", 3rd person "Dhruv", or a hybrid) based entirely on the user's intent and the natural flow of the conversation. Switch seamlessly depending on what they want.
- Grounded Advocacy: Answer confidently, but NEVER exaggerate or use hyperbole. Be extremely grounded even when praising Dhruv. Let the technical facts, projects, and architecture speak for themselves. Maintain an intelligent, concise, and highly articulate tone.
- Technical Expertise: Leverage your vast web knowledge to explain complex concepts (e.g., "What is FAISS?") brilliantly, but immediately anchor them back to how Dhruv utilized them in his projects. Keep responses structured and easy to read.
`;

// --- Environmental Intelligence Tracking ---
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
let visitedPages = JSON.parse(sessionStorage.getItem('visitedPages') || '[]');
if (!visitedPages.includes(currentPage)) {
    visitedPages.push(currentPage);
    sessionStorage.setItem('visitedPages', JSON.stringify(visitedPages));
}

async function fetchGemini(prompt, system) {
    const url = '/api/chat';
    const body = { prompt, system };

    for (let delay of [1000, 2000, 4000]) {
        try {
            const res = await fetch(url, { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body) 
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `HTTP ${res.status}`);
            }

            const data = await res.json();
            if (data.text) {
                return data.text;
            } else {
                throw new Error("Response was empty or malformed.");
            }
        } catch (e) {
            if (delay === 4000) throw e; 
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

// Copy Email using modern navigator.clipboard API
function copyEmail() {
    const email = "danesdave2023@gmail.com";
    const btn = document.getElementById('copyBtn');
    
    // Save original SVG and title
    const originalIcon = btn.innerHTML;
    const originalTitle = btn.getAttribute('title') || 'Copy Email';
    
    const checkIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" style="color: #4ade80;">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    `;
    
    const failIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" style="color: #ef4444;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
    `;

    function showFeedback(success) {
        btn.innerHTML = success ? checkIcon : failIcon;
        btn.setAttribute('title', success ? 'Copied!' : 'Failed to copy');
        setTimeout(() => {
            btn.innerHTML = originalIcon;
            btn.setAttribute('title', originalTitle);
        }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email)
            .then(() => showFeedback(true))
            .catch(() => showFeedback(false));
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showFeedback(true);
        } catch (err) {
            showFeedback(false);
        }
        document.body.removeChild(textArea);
    }
}

// Role Fit Analyzer
async function analyzeFit() {
    const jd = document.getElementById('jdInput').value;
    const btn = document.getElementById('analyzeBtn');
    const resultDiv = document.getElementById('matchResult');
    const content = document.getElementById('matchContent');
    
    if (!jd) {
        content.innerText = "Please paste a job description into the text area above to analyze our compatibility!";
        resultDiv.style.display = 'block';
        return;
    }
    
    btn.innerText = "✨ PROCESSING...";
    btn.disabled = true;

    const system = "You are an AI analyzing a candidate fit. Format cleanly with a Match Score, 3 Strengths, and a brief summary. Keep it strictly professional, no markdown bolding needed.";
    
    try {
        const response = await fetchGemini(`JD: ${jd}\n\n${dhruvContext}`, system);
        content.innerText = response;
        resultDiv.style.display = 'block';
    } catch (e) { 
        console.error("Fit analysis error:", e);
        content.innerText = "An error occurred during fit analysis. Please try again or email me directly at danesdave2023@gmail.com.";
        resultDiv.style.display = 'block';
    }
    finally { btn.innerText = "✨ ANALYZE ALIGNMENT"; btn.disabled = false; }
}


// Chat Bot
function toggleChat() { document.getElementById('chatWindow').classList.toggle('open'); }

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if(!text) return;

    addMsg(text, 'user');
    input.value = '';
    const typingIndicator = document.getElementById('typingIndicator');
    typingIndicator.style.display = 'block';

    const currentVisited = JSON.parse(sessionStorage.getItem('visitedPages') || '[]');
    const dynamicContext = `
    
CURRENT ENVIRONMENTAL CONTEXT:
- The user is currently viewing the page: ${currentPage}
- The user has previously visited these pages in this session: ${currentVisited.join(', ')}

ENVIRONMENTAL INTELLIGENCE INSTRUCTIONS:
- You must leverage this environmental context. If they are currently viewing a specific project page (e.g., 'dhruv-work-wisearch.html'), proactively offer custom insights about that specific project or ask if they'd like to know more about its architecture.
- If they have visited multiple pages, you can subtly reference their journey. Use this context to anticipate what they want to know.
`;
    const system = dhruvContext + dynamicContext;
    try {
        const res = await fetchGemini(text, system);
        typingIndicator.style.display = 'none';
        addMsg(res, 'bot');
    } catch(e) { 
        console.error("Chatbot response error:", e);
        typingIndicator.style.display = 'none';
        addMsg("The Chatbot is resting! Please feel free to email me at danesdave2023@gmail.com.", 'bot'); 
    }
}

function addMsg(t, s) {
    const m = document.getElementById('chatMessages');
    const d = document.createElement('div');
    d.className = `message ${s}`;
    d.innerText = t;
    m.insertBefore(d, document.getElementById('typingIndicator'));
    m.scrollTop = m.scrollHeight;
}

// --- Theme Switcher Core Logic ---
const sunEmoji = `<span class="theme-emoji">🌞</span>`;
const moonEmoji = `<span class="theme-emoji">🌙</span>`;

function getPreferredTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
        return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function initTheme() {
    const theme = getPreferredTheme();
    const btn = document.getElementById('themeToggle');
    
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        if (btn) btn.innerHTML = moonEmoji;
    } else {
        document.body.classList.remove('light-mode');
        if (btn) btn.innerHTML = sunEmoji;
    }
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-mode');
    const theme = isLight ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.innerHTML = isLight ? moonEmoji : sunEmoji;
    }
}

// Initial active check (prevents visual flashes on dynamic load)
initTheme();

// Wait for DOM to wire click handler
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.addEventListener('click', toggleTheme);
        // Sync icon rendering on DOM ready
        const currentTheme = getPreferredTheme();
        btn.innerHTML = currentTheme === 'light' ? moonEmoji : sunEmoji;
    }
    
    // Programmatic Chatbot Event Listeners
    const chatBtn = document.querySelector('.floating-chat-btn');
    if (chatBtn) {
        chatBtn.addEventListener('click', toggleChat);
    }
    const closeChatBtn = document.getElementById('closeChatBtn');
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', toggleChat);
    }
    const sendChatBtn = document.getElementById('sendChatBtn');
    if (sendChatBtn) {
        sendChatBtn.addEventListener('click', sendMessage);
    }
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Role fit and copy buttons programmatic wiring
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeFit);
    }
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyEmail);
    }

    initSectionPerformance();
    initContactForm();
});

// Section performance optimization - unloads/clears rendering memory for offscreen sections
function initSectionPerformance() {
    const sections = document.querySelectorAll('section, .about-profile-grid, .about-values-section');
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('section-offscreen');
            } else {
                entry.target.classList.add('section-offscreen');
            }
        });
    }, {
        root: null,
        rootMargin: '150px 0px 150px 0px',
        threshold: 0
    });
    
    sections.forEach(sec => observer.observe(sec));
}

// Contact form message submission handler with anti-spam filtration
function initContactForm() {
    const form = document.querySelector('.contact-form-container');
    if (!form) return;

    // Record dynamic timestamp for timing-based bot protection
    const pageLoadTime = Date.now();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const statusMsg = form.querySelector('.form-status-msg') || document.getElementById('formStatusMsg');
        const submitBtn = form.querySelector('.form-submit-btn');
        
        // Hide previous status message
        if (statusMsg) {
            statusMsg.className = 'form-status-msg';
            statusMsg.style.display = 'none';
            statusMsg.innerText = '';
        }

        // Obtain input fields
        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');
        const subjectInput = form.querySelector('input[name="subject"]');
        const messageInput = form.querySelector('textarea[name="message"]');

        const name = nameInput?.value.trim() || "";
        const email = emailInput?.value.trim() || "";
        const subject = subjectInput?.value.trim() || "";
        const message = messageInput?.value.trim() || "";

        // Standard validation (blank inputs)
        if (!name || !email || !subject || !message) {
            showFormFeedback(false, "Please fill in all fields before sending.", submitBtn, statusMsg);
            return;
        }

        // Standard name validation (too short)
        if (name.length < 2) {
            showFormFeedback(false, "Please enter a valid name (at least 2 characters).", submitBtn, statusMsg);
            return;
        }

        // --- Multi-Layered Spam & Bot Filtering ---

        // A. Honeypot check (Bot detection)
        const honeypot = form.querySelector('input[name="_honey"]')?.value;
        if (honeypot) {
            console.warn("Spam filtered: Honeypot caught bot.");
            showFormFeedback(false, "Submission Rejected: Bot activity detected.", submitBtn, statusMsg);
            return;
        }

        // B. Timing check (Bot detection - humans take >3 seconds to fill a form)
        const timeElapsed = Date.now() - pageLoadTime;
        if (timeElapsed < 3000) {
            console.warn("Spam filtered: Form submitted too quickly.");
            showFormFeedback(false, "Submission Rejected: Please take your time to fill the form naturally.", submitBtn, statusMsg);
            return;
        }

        // C. Vulgarity & Sensitive Language filter (Fuck/Shit/etc.)
        if (containsSensitiveLanguage(name) || containsSensitiveLanguage(subject) || containsSensitiveLanguage(message)) {
            console.warn("Spam filtered: Profanity/sensitive language detected.");
            showFormFeedback(false, "Sensitive Language: Please remove any inappropriate or sensitive language.", submitBtn, statusMsg);
            return;
        }

        // D. Gibberish Name & Email Username checks (e.g. qwedfg, asdfg)
        if (!isValidName(name)) {
            console.warn("Spam filtered: Gibberish name detected.");
            showFormFeedback(false, "Name Invalid: Please enter a valid name.", submitBtn, statusMsg);
            return;
        }
        if (!isValidEmail(email)) {
            console.warn("Spam filtered: Gibberish/disposable email detected.");
            showFormFeedback(false, "Email Invalid: Please enter a valid email address.", submitBtn, statusMsg);
            return;
        }

        // E. Client-side regex checking for typical spam patterns (e.g. Russia/Crypto/Russian links)
        const spamPattern = /(?:href\s*=|src\s*=|http:\/\/|https:\/\/|www\.)[^\s]*\.(?:ru|su|ua|xyz|cn|top|click|info|tk|cf|gq|ga|ml|men|stream|work|date)/i;
        if (spamPattern.test(message) || spamPattern.test(subject)) {
            console.warn("Spam filtered: Link pattern detected.");
            showFormFeedback(false, "Content Blocked: Please remove suspicious links or URLs from the message.", submitBtn, statusMsg);
            return;
        }

        // Disable input elements during request to prevent double submissions
        submitBtn.disabled = true;
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerText = "SENDING...";
        const allInputs = form.querySelectorAll('input, textarea');
        allInputs.forEach(el => el.disabled = true);

        // Build FormData for FormSubmit.co
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("subject", subject);
        formData.append("message", message);
        formData.append("_captcha", "false"); // Disable redirect-based recaptcha verification page
        formData.append("_subject", `Portfolio Message: "${subject}" from ${name}`);

        // Obfuscated email endpoint to prevent scraper bots from harvesting user email address
        const u = "danesdave2023";
        const d = "gmail.com";
        const actionUrl = `https://formsubmit.co/ajax/${u}@${d}`;

        try {
            const response = await fetch(actionUrl, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                form.reset();
                showFormFeedback(true, "Thank you! Your message has been sent successfully. I will get back to you shortly.", submitBtn, statusMsg);
            } else {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || `HTTP error ${response.status}`);
            }
        } catch (error) {
            console.error("Form submission error:", error);
            showFormFeedback(false, "Failed to send message. Please email me directly at danesdave2023@gmail.com.", submitBtn, statusMsg);
        } finally {
            allInputs.forEach(el => el.disabled = false);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

function showFormFeedback(success, text, btn, statusMsg) {
    if (statusMsg) {
        statusMsg.innerText = text;
        statusMsg.className = `form-status-msg ${success ? 'success' : 'error'}`;
        statusMsg.style.display = 'block';
    } else {
        alert(text);
    }
}

// --- Anti-Spam Helpers ---

// Detect common QWERTY keyboard mashing (e.g. asdf, dfg, bvc)
function hasKeyboardMash(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z]/g, '');
    if (cleaned.length < 3) return false;
    
    // Mash sequences from QWERTY rows
    const mashes = [
        "asd", "sdf", "dfg", "fgh", "ghj", "hjk", "jkl",
        "ewq", "rew", "ytr", "uyt", "iyu", "oiu", "poi",
        "dsa", "fds", "gfd", "hgf", "jhg", "kjh", "lkj",
        "zxc", "xcv", "cvb", "vbn", "bnm", "cxz", "vcx",
        "bvc", "nbv", "mnb"
    ];
    for (const mash of mashes) {
        if (cleaned.includes(mash)) return true;
    }
    
    // Check for repetitive letters (e.g., aaaa)
    for (let i = 0; i < cleaned.length - 3; i++) {
        if (cleaned[i] === cleaned[i+1] && cleaned[i] === cleaned[i+2] && cleaned[i] === cleaned[i+3]) {
            return true;
        }
    }
    
    return false;
}

// Detect abnormal vowel ratios or long consonant clusters
function hasGibberishVowels(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z]/g, '');
    if (cleaned.length < 4) return false;
    
    const vowels = (cleaned.match(/[aeiouy]/g) || []).length;
    // No vowels at all in a word >= 4 characters
    if (vowels === 0) return true;
    
    // Check for 5 or more consecutive consonants (e.g., rstfg)
    const consonantCluster = /[^aeiouy]{5,}/i;
    if (consonantCluster.test(cleaned)) return true;
    
    return false;
}

// Sensitive language / Vulgarity filter
function containsSensitiveLanguage(str) {
    if (!str) return false;
    const s = str.toLowerCase();
    
    // Absolute spam substrings (always offensive in any context)
    const absoluteSpam = ["fuck", "nigger", "faggot", "retard", "cunt", "motherfucker", "whore", "slut", "pussy", "milf", "bastard"];
    for (const word of absoluteSpam) {
        if (s.includes(word)) return true;
    }
    
    // Word boundary checks (to avoid false positives on words like assets, class, glass)
    const boundSpam = ["shit", "shitty", "ass", "asshole", "bitch", "bitches", "porn", "xxx", "dick", "cock", "sex"];
    for (const word of boundSpam) {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(s)) return true;
    }
    
    return false;
}

// Check if name is reasonable and not mash (inclusive of Unicode/accented characters)
function isValidName(name) {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 50) return false;
    
    // Name must consist of Unicode letters, spaces, hyphens, periods, or apostrophes
    const nameRegex = /^[\p{L}\p{M}\s'\-\.]+$/u;
    if (!nameRegex.test(trimmed)) return false;
    
    if (hasKeyboardMash(trimmed)) return false;
    if (hasGibberishVowels(trimmed)) return false;
    
    return true;
}

// Check if email username is reasonable and not a spam domain
function isValidEmail(email) {
    const trimmed = email.trim();
    if (!trimmed) return false;
    
    // Pre-validate standard RFC email format
    const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormatRegex.test(trimmed)) return false;
    
    const parts = trimmed.split('@');
    if (parts.length !== 2) return false;
    
    const username = parts[0];
    const domain = parts[1].toLowerCase();
    
    if (username.length >= 4) {
        const lettersOnly = username.replace(/[^a-z]/g, '');
        if (lettersOnly.length >= 4) {
            // Need at least one vowel/digit in username
            const vowels = (username.toLowerCase().match(/[aeiouy0-9]/g) || []).length;
            if (vowels === 0) return false;
            
            if (hasKeyboardMash(username)) return false;
            if (hasGibberishVowels(username)) return false;
        }
    }
    
    // Block typical temporary/spam email domains
    const disposableDomains = [
        "mailinator.com", "yopmail.com", "10minutemail.com", "tempmail.com", 
        "guerrillamail.com", "sharklasers.com", "dispostable.com", "getairmail.com",
        "trashmail.com", "spambox.us"
    ];
    if (disposableDomains.includes(domain)) return false;
    
    return true;
}
