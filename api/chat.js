export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { prompt, system } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: Missing GEMINI_API_KEY environment variable in Vercel.' });
    }

    if (!prompt || !system) {
        return res.status(400).json({ error: 'Missing prompt or system instruction.' });
    }

    // Using stable alias gemini-2.5-flash for compatibility
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const body = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: system }] }
    };

    try {
        const fetchRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!fetchRes.ok) {
            const errData = await fetchRes.json().catch(() => ({}));
            return res.status(fetchRes.status).json({ error: errData.error?.message || `HTTP ${fetchRes.status}` });
        }

        const data = await fetchRes.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return res.status(200).json({ text: data.candidates[0].content.parts[0].text });
        } else {
            return res.status(500).json({ error: "Response from Gemini was empty or malformed." });
        }
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
