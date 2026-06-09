export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: Missing GEMINI_API_KEY environment variable.' });
    }

    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid job description.' });
    }

    // Input sanitization / length limit to protect tokens
    if (prompt.length > 2000) {
        return res.status(400).json({ error: 'Payload too large. Job description must be under 2000 characters.' });
    }

    const dhruvProfileContext = `
DHRUV LOHCHAB - PROFILE DATA:
- Role Interest: Aspiring AI Engineer, Web Developer, Software Engineer.
- Education: 3rd Year B.Tech Computer Science & Engineering (CSE) at Manav Rachna University (July 2023 - July 2027) | Current SGPA: 8.2.
- Programming Languages: Python (Primary / Strongest), SQL, HTML5, CSS3, JavaScript, React, TypeScript.
- AI & NLP Stack: NumPy, Pandas, Scikit-learn, Matplotlib, FAISS, Sentence Transformers (S-BERT), Natural Language Processing (NLP).
- Key Projects:
  1. WiSearch: An Intelligent Semantic Search retrieval engine. Built backend in Python utilizing Sentence Transformers (S-BERT) and FAISS vector database for sub-millisecond document similarity queries. Paired with an interactive, animated React & TypeScript frontend.
  2. Bhasha Translate: Bidirectional English-Hindi offline-resilient translation desktop app. Built using Python, Tkinter UI, and deep-translator. Optimized with background threads to prevent UI freezes.
  3. Admetus LifeSciences: High-performance corporate website built from scratch with Next.js, React, Tailwind CSS, and Node.js. Fixed hydration errors, duplicates, and fully polished equal-height grids and carousels.
- Soft Skills: Strategic, Analytical, Observant, Solution-Oriented, Resourceful, Collaborative.
- Tools: VS Code, Git/GitHub, Google Colab.

ALIGNMENT MATCHING RULES:
1. Compare the user's input Job Description (JD) against Dhruv's profile data.
2. Calculate an integer "compatibilityScore" between 0 and 100:
   - Give high scores (80-95%) for roles seeking Python, Javascript, React, Frontend, NLP, Semantic Search, Vector DBs, or general Software Engineering.
   - Penalize appropriately (lower the score to 40-70%) if the role explicitly demands senior-level experience, or technologies Dhruv has no listed exposure to (e.g. Ruby, Go, Rust, Solidity, C++, Kubernetes, PHP).
   - Be objective and realistic. Do not exaggerate or make false claims.
3. Write a "summary" (brief 2-3 sentences max) explaining the alignment.
4. Extract 2 to 4 "keyStrengths" showing direct overlap.
5. Extract 1 to 3 "areasOfGrowth" where Dhruv lacks experience or needs learning to adapt to the role.
`;

    // API URL using gemini-2.5-flash for speed and reliability
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const reqBody = {
        contents: [{ parts: [{ text: `Job Description to Analyze:\n\n${prompt}` }] }],
        systemInstruction: { parts: [{ text: dhruvProfileContext }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    compatibilityScore: { type: "INTEGER" },
                    summary: { type: "STRING" },
                    keyStrengths: { type: "ARRAY", items: { type: "STRING" } },
                    areasOfGrowth: { type: "ARRAY", items: { type: "STRING" } }
                },
                required: ["compatibilityScore", "summary", "keyStrengths", "areasOfGrowth"]
            }
        }
    };

    try {
        const fetchRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
        });

        if (!fetchRes.ok) {
            const errData = await fetchRes.json().catch(() => ({}));
            return res.status(fetchRes.status).json({ error: errData.error?.message || `HTTP ${fetchRes.status}` });
        }

        const data = await fetchRes.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            // Validate it is parseable JSON before returning to client
            const textResponse = data.candidates[0].content.parts[0].text;
            try {
                const parsed = JSON.parse(textResponse);
                return res.status(200).json(parsed);
            } catch (jsonErr) {
                return res.status(500).json({ error: "Gemini outputted invalid JSON", raw: textResponse });
            }
        } else {
            return res.status(500).json({ error: "Response from Gemini was empty or malformed." });
        }
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
