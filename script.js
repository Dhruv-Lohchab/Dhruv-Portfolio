const apiKey = ""; // Insert your Gemini API key here

const dhruvContext = `
    Context: Dhruv, 3rd Year B.Tech CSE student at Manav Rachna University. 
    Skills: Python, Prompt Engineering, NLP (BERT, FAISS), Computer Vision, Git.
    Projects: WiSearch (Semantic Search), KheloKhiladi (Sports Scouting AI), Rakshak (Safety App), Bhasha Translate.
    Certifications: LangChain Prompt Engineering, Salesforce Agentforce, AI Foundations.
`;

async function fetchGemini(prompt, system) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const body = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: system }] }
    };

    for (let delay of [1000, 2000, 4000]) {
        try {
            const res = await fetch(url, { method: 'POST', body: JSON.stringify(body) });
            const data = await res.json();
            return data.candidates[0].content.parts[0].text;
        } catch (e) { await new Promise(r => setTimeout(r, delay)); }
    }
}

// Copy Email
function copyEmail() {
    const email = "dhruvlohchab22@gmail.com";
    const btn = document.getElementById('copyBtn');
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
    } catch (e) { content.innerText = "System error during analysis."; }
    finally { btn.innerText = "✨ ANALYZE ALIGNMENT"; btn.disabled = false; }
}

// Project Actions
async function aiAction(type, name, btn) {
    const card = btn.closest('.project-card');
    const desc = card.querySelector('.project-desc');
    const original = desc.getAttribute('data-original');
    
    if (btn.innerText === "✨ RESTORE") {
        desc.innerText = original;
        btn.innerText = type === 'simplify' ? "✨ SIMPLIFY" : "✨ ROADMAP";
        return;
    }

    btn.innerText = "✨ ...";
    btn.disabled = true;

    const systems = {
        simplify: "Rewrite this technical project summary into 2 simple sentences for a non-tech recruiter. No jargon.",
        roadmap: "Suggest 3 bullet points for advanced technical features to add to this project in the next 6 months."
    };

    try {
        const response = await fetchGemini(original, systems[type]);
        desc.innerText = response;
        btn.innerText = "✨ RESTORE";
    } catch (e) { desc.innerText = "System unavailable."; }
    finally { btn.disabled = false; }
}

// Chat Bot
function toggleChat() { document.getElementById('chatWindow').classList.toggle('open'); }

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if(!text) return;

    addMsg(text, 'user');
    input.value = '';
    document.getElementById('typingIndicator').style.display = 'block';

    const system = `You are a system agent representing Dhruv. Answer questions concisely using this context: ${dhruvContext}. Tone: Direct, professional, minimal.`;
    try {
        const res = await fetchGemini(text, system);
        document.getElementById('typingIndicator').style.display = 'none';
        addMsg(res, 'bot');
    } catch(e) { 
        document.getElementById('typingIndicator').style.display = 'none';
        addMsg("Connection interrupted.", 'bot'); 
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
