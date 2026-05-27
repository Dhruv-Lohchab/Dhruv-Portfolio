const apiKey = ""; // Insert your Gemini API key here

const dhruvContext = `
    Context: Dhruv, 3rd Year B.Tech CSE student at Manav Rachna University. 
    Skills: Python, Prompt Engineering, NLP (BERT, FAISS), Computer Vision, Git.
    Projects: WiSearch (Semantic Search), KheloKhiladi (Sports Scouting AI), Rakshak (Safety App), Bhasha Translate.
    Certifications: LangChain Prompt Engineering, Salesforce Agentforce, AI Foundations.
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
    const email = "dhruvlohchab22@gmail.com";
    const btn = document.getElementById('copyBtn');

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email)
            .then(() => {
                btn.innerHTML = "COPIED TO CLIPBOARD";
            })
            .catch(() => {
                btn.innerHTML = "FAILED TO COPY";
            })
            .finally(() => {
                setTimeout(() => { btn.innerHTML = "COPY EMAIL ADDRESS"; }, 2500);
            });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            btn.innerHTML = "COPIED TO CLIPBOARD";
        } catch (err) {
            btn.innerHTML = "FAILED TO COPY";
        }
        document.body.removeChild(textArea);
        setTimeout(() => { btn.innerHTML = "COPY EMAIL ADDRESS"; }, 2500);
    }
}

// Role Fit Analyzer
async function analyzeFit() {
    const jd = document.getElementById('jdInput').value;
    const btn = document.getElementById('analyzeBtn');
    const resultDiv = document.getElementById('matchResult');
    const content = document.getElementById('matchContent');
    
    if (!jd) return;
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

    const system = `You are a system agent representing Dhruv. Answer questions concisely using this context: ${dhruvContext}. Tone: Direct, professional, minimal.`;
    try {
        const res = await fetchGemini(text, system);
        typingIndicator.style.display = 'none';
        addMsg(res, 'bot');
    } catch(e) { 
        typingIndicator.style.display = 'none';
        addMsg(`Error: ${e.message || "Connection interrupted."}`, 'bot'); 
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
