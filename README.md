# ✉️ Lettersmith AI

Lettersmith AI is a modern web app that helps you **instantly generate tailored cover letters** using your CV and job description — right in the browser.

Built with **Next.js 15**, **React 19**, **Framer Motion**, and powered by **OpenRouter API**, it combines a sleek user experience with serverless AI generation.

---

## 🚀 Features

- ✨ Generate custom cover letters from your CV + job description
- 📄 Upload `.pdf` or `.docx` resumes (processed fully in-browser)
- 🔄 Choose tone, length, style, and language
- ⚙️ Copy, download as PDF or DOCX — all in one click
- ⚡ Fast, no backend API calls for file parsing (client-side parsing)
- 🎨 Smooth animations, responsive design, minimal UI

---

## 🛠 Tech Stack

- **Framework**: Next.js (App Router, React Server Components)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **PDF Parsing**: `pdfjs-dist`
- **DOCX Parsing**: `mammoth`
- **Export Utilities**: `pdf-lib`, `docx`
- **AI API**: OpenRouter (LLM wrapper)

---

## 🧪 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/lettersmith.git
cd lettersmith
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your OpenRouter API key

Rename the included `env.txt` file to `.env`:

```bash
mv env.txt .env
```

Then edit the file and replace:

```
OPENROUTERS_API_KEY = "API KEY HERE"
```

with your actual [OpenRouter](https://openrouter.ai/) API key.

---

### 4. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

\`\`\`
src/
├── app/
│   ├── Components/
│   │   └── Chat/CoverLetter/
│   │       ├── CoverInput.js       # User form
│   │       ├── CoverShow.js        # Output display
│   │       ├── Uploader.js         # Upload CV
│   │       └── ActionButtons.js    # Copy/Download/etc
│   ├── utils/
│   │   ├── extractText.js          # In-browser PDF/DOCX parsing
│   │   ├── generatePDF.js
│   │   └── generateDOCX.js
│   └── api/Chat/Cover/route.js     # API route calling OpenRouter
\`\`\`

---

## 🧠 Notes

- 🔐 CV file parsing is 100% in-browser — your data stays local.
- 📡 AI generation uses the OpenRouter API. You must provide an API key via `.env`.
- 📄 PDF and DOCX downloads are **editable and selectable**, not screenshots.
- 🧼 Includes graceful error handling and toast notifications.
- 🧪 If a file fails to parse, users are informed and asked to paste CV text manually.

---

## 🧳 Deploying

You can deploy on any Node.js-compatible host, but **Vercel** is recommended:

```bash
npm run build
npm start
```

To deploy on [Vercel](https://vercel.com/new):

1. Push your project to GitHub
2. Import your repo into Vercel
3. Set `OPENROUTERS_API_KEY` in Project Settings → Environment Variables

---

## 💡 Why Lettersmith?

Writing personalized cover letters is painful. Lettersmith AI removes the friction by giving you high-quality drafts that still feel **yours** — with just a few clicks.

---

## 📬 License

MIT — Free to use, fork, and improve.