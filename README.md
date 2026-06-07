# Dhruv

> **Building intelligent systems that understand humans and bridging the gap between AI and human interaction.**

Welcome to the source code of my personal portfolio. This is a custom-built, interactive, and highly optimized web experience designed to showcase my expertise in Front-End Development, UI/UX Design, and Applied Artificial Intelligence (LLMs & Semantic Search).

🔗 **Live Portfolio:** [dhruv-portfolio-black.vercel.app](https://dhruv-portfolio-black.vercel.app/)

---

## 🚀 Key Features

This portfolio goes beyond static text by integrating live AI elements and premium interactions to demonstrate applied engineering competencies.

* 🤖 **System Agent Chatbot (Gemini API):** An embedded, floating chatbot trained on my personal context (skills, projects, education). Recruiters can "interview" the bot to learn about my background.
  * *Resilience & Security Fallback:* If the API key is not configured or during connection interrupts, the chatbot gracefully returns: `"The Chatbot is resting ! Pls feel free to mail me at danesdave2023@gmail.com"`.
* 🎯 **Recruiter Alignment Playground:** A dynamic dashboard where visitors can paste a Job Description (JD) to analyze compatibility. The system evaluates the JD against my profile and outputs a Match Score, core strengths, and alignment summary.
  * *Development Fallback:* During API key absence or development, the playground safely alerts: `"The PlayGround is underdevlopment !"`.
* 🎨 **Premium Editorial UI/UX:** A bespoke, dark-amber editorial design featuring responsive Bento-box grids, smooth hover transitions (e.g. sliding arrows on navigation links), and theme state toggling (Light/Dark mode) with persistent memory.
* 📁 **Detailed Project Subpages:** Dedicated detail pages for each core project detailing my contributions, full tech stacks, outcomes, and GitHub commit references.
* 📬 **Restructured Connect / Contact Grid:** A responsive two-column layout featured on the Home and About pages.
  * *Interactive Cards (Left Column):* Contains copy-to-clipboard Email card with instantaneous SVG visual feedback (success/error icons and tooltip updates without layout shifts), alongside hover-responsive LinkedIn and GitHub link cards.
  * *Glassmorphic Form (Right Column):* A clean form layout built using CSS Variables for frictionless communication.

---

## 🛠️ Showcase Projects

### 1. Admetus LifeSciences
* **Description:** A premium corporate website built for a healthcare & life-sciences firm showcasing services, team expertise, and client trust.
* **Key Contributions:**
  * Implemented site-wide responsive layout styling and product card alignments.
  * Resolved Next.js/React hydration warnings and suppressed double theme script runs.
  * Optimized product grids for equal height alignment and carousel mouse-scroll events.
  * Conducted dependency audits to harden the codebase against vulnerabilities.
* **Tech Stack:** Next.js, React, TypeScript, Customized Tailwind CSS, Node.js, GitHub Actions.
* **Details page:** [Admetus Details](dhruv-work-admetus.html) | [Repository](https://github.com/gauravlochab/admetus-lifesciences)

### 2. WiSearch
* **Description:** An intelligent literature search engine that solves the "vocabulary mismatch" problem in academic databases, retrieving papers based on semantic intent rather than exact keyword matching.
* **Key Contributions:**
  * Built a semantic vector indexing pipeline utilizing Sentence Transformers (BERT embeddings) to convert paper text to dense vectors.
  * Integrated FAISS (Facebook AI Similarity Search) database to execute nearest-neighbor searches in sub-millisecond query time.
  * Developed a modern, fluid React/TypeScript frontend dashboard displaying similarity scores and semantic clusters.
  * Engineered a FastAPI backend layer to serve search results in JSON formats.
* **Tech Stack:** Python, FastAPI, FAISS, Sentence Transformers (BERT), React, TypeScript.
* **Details page:** [WiSearch Details](dhruv-work-wisearch.html) | [Repository](https://github.com/DaveDanes/wisearch)

### 3. Bhasha Translate
* **Description:** A lightweight desktop translation application providing fast, offline-resilient translation between English and Hindi.
* **Key Contributions:**
  * Integrated multi-threading using Python's `threading` module to execute API translator requests in the background, keeping the desktop UI fully responsive and lag-free.
  * Programmed a bidirectional swap mechanism that reverses translation direction (English ↔ Hindi) and dynamically swaps the input/output text boxes.
  * Configured a custom Tkinter window with scrollable fields, clean buttons, and validation limits (5,000 character cap).
* **Tech Stack:** Python, Tkinter GUI, `deep-translator` NLP library, Multi-threading.
* **Details page:** [Bhasha Details](dhruv-work-bhasha.html) | [Repository](https://github.com/DaveDanes/bhasha-translate)

---

## ⚡ Technical & Performance Optimizations

To ensure a seamless user experience, the website utilizes advanced frontend optimization techniques:

1. **IntersectionObserver Rendering Manager:** A custom scroll optimization script in `script.js` checks when major layout sections are offscreen. Offscreen containers are flagged with `.section-offscreen` and styled using `content-visibility: hidden !important`. This completely unloads offscreen elements from the browser's layout tree, saving graphics memory, reducing paint times, and optimizing mobile battery consumption.
2. **Static PNG Noise Layer:** Replaced heavy, CPU-blocking SVG dynamic `feTurbulence` noise filters with a lightweight, repeating, semi-transparent base64 static PNG tile. This resolved mobile scrolling lag and restored a smooth 60fps refresh rate during transitions.
3. **Aggressive Cache Control & Versioning:** Solved sticky caching problems by enforcing HTTP headers and appending unified query-string versioning variables (e.g. `style.css?v=3`) across all HTML files.
4. **Security Hardening:** Patched potential "tab-nabbing" window hijacking exploits by applying `rel="noopener noreferrer"` to all target `_blank` anchor elements.
5. **Asset Optimization:** Purged unneeded massive file sizes (e.g. removed `photo-3.jpeg` and updated layout references to optimized `photo-3.png`).

---

## 📂 Codebase Structure

```text
├── index.html                  # Homepage markup, Bento layouts, and AI containers
├── about.html                  # About Me page (Narrative, core strengths, connect grid)
├── dhruv-work-admetus.html     # Admetus LifeSciences project detail page
├── dhruv-work-wisearch.html    # WiSearch project detail page
├── dhruv-work-bhasha.html      # Bhasha Translate project detail page
├── style.css                   # Theme configurations, bento variables, responsive queries
├── script.js                   # IntersectionObserver performance engine, copy tool, Gemini API logic
├── Dhruv_Resume.pdf            # Curated professional resume (PDF)
├── photo-3.png                 # Main portfolio banner/hero image
├── photo-4.jpeg                # About page profile portrait
└── photo-2.jpeg                # Creative exploration asset
```

---

## 📬 Let's Connect

Currently seeking opportunities at the intersection of AI, Natural Language Processing, and Frontend Engineering.

* 📧 **Email:** [danesdave2023@gmail.com](mailto:danesdave2023@gmail.com)
* 💼 **LinkedIn:** [linkedin.com/in/dhruv-lohchab](https://www.linkedin.com/in/dhruv-lohchab)
* 🐙 **GitHub:** [github.com/DaveDanes](https://github.com/DaveDanes)
