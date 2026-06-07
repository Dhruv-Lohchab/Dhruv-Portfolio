const apiKey = ""; // Insert your Gemini API key here

const dhruvContext = `
    Context: Dhruv, 3rd Year B.Tech CSE student at Manav Rachna University. Co-Head of Drishti Society and Co-Head of Media Team.
    Skills: Languages: Python (Primary), SQL; Technologies & Libraries: VS Code, Google Colab, Kaggle, Git/GitHub, NumPy, Pandas, FAISS, Sentence Transformers (BERT), HTML5, CSS3, JavaScript, React, TypeScript.
    Projects: Admetus LifeSciences (designed and developed a complete corporate website for a healthcare firm using HTML, CSS, JavaScript — responsive, performance-optimized, professional UI/UX), WiSearch (Semantic Search retrieval system utilizing Sentence Transformers and FAISS with React/TypeScript frontend), Bhasha Translate (desktop bidirectional English-Hindi translation app using Python and NLP).
`;

async function fetchGemini(prompt, system) {
    if (!apiKey) {
        throw new Error("API key is not configured. Please insert your Gemini API key in script.js.");
    }
    
    // Using stable alias gemini-2.5-flash for compatibility
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const body = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: system }] }
    };

    for (let delay of [1000, 2000, 4000]) {
        try {
            const res = await fetch(url, { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body) 
            });

            // If response is unauthorized, bad request, or not found, fail immediately
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error?.message || `HTTP ${res.status}`);
            }

            const data = await res.json();
            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error("Response was empty or malformed.");
            }
        } catch (e) {
            // Only retry if it's a network error or transient server failure.
            // HTTP errors and API key issues are terminal client errors.
            if (e.message.startsWith("HTTP ") || e.message.includes("API key") || e.message.includes("not configured")) {
                throw e; 
            }
            if (delay === 4000) throw e; // Reached last retry, bubble up error
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

    if (!apiKey) {
        content.innerText = "The PlayGround is underdevlopment !";
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
        content.innerText = `Error: ${e.message || "System error during analysis."}`; 
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

    if (!apiKey) {
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            addMsg("The Chatbot is resting ! Pls feel free to mail me at danesdave2023@gmail.com", 'bot');
        }, 800);
        return;
    }

    const system = `You are a system agent representing Dhruv. Answer questions concisely using this context: ${dhruvContext}. Tone: Direct, professional, minimal.`;
    try {
        const res = await fetchGemini(text, system);
        typingIndicator.style.display = 'none';
        addMsg(res, 'bot');
    } catch(e) { 
        typingIndicator.style.display = 'none';
        addMsg("The Chatbot is resting ! Pls feel free to mail me at danesdave2023@gmail.com", 'bot'); 
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
const sunIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="5"></circle>
  <line x1="12" y1="1" x2="12" y2="3"></line>
  <line x1="12" y1="21" x2="12" y2="23"></line>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
  <line x1="1" y1="12" x2="3" y2="12"></line>
  <line x1="21" y1="12" x2="23" y2="12"></line>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
</svg>
`;

const moonIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
</svg>
`;

function initTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    const btn = document.getElementById('themeToggle');
    
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        if (btn) btn.innerHTML = sunIcon;
    } else {
        document.body.classList.remove('light-mode');
        if (btn) btn.innerHTML = moonIcon;
    }
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-mode');
    const theme = isLight ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.innerHTML = isLight ? sunIcon : moonIcon;
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
        const currentTheme = localStorage.getItem('theme') || 'dark';
        btn.innerHTML = currentTheme === 'light' ? sunIcon : moonIcon;
    }
    initSectionPerformance();
    initContactForm();
});

// Section performance optimization - unloads/clears rendering memory for offscreen sections
function initSectionPerformance() {
    const sections = document.querySelectorAll('section, .about-profile-grid, .about-values-section, .about-outside');
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

// Check if name is reasonable and not mash
function isValidName(name) {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 50) return false;
    
    // Name must consist of letters, spaces, hyphens, periods, or apostrophes
    const nameRegex = /^[a-zA-Z\s'\-\.]+$/;
    if (!nameRegex.test(trimmed)) return false;
    
    if (hasKeyboardMash(trimmed)) return false;
    if (hasGibberishVowels(trimmed)) return false;
    
    return true;
}

// Check if email username is reasonable and not a spam domain
function isValidEmail(email) {
    const trimmed = email.trim();
    if (!trimmed) return false;
    
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
