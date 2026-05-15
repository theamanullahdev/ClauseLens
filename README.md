# ClauseLens

**Contract Review That Thinks Like a Lawyer**

ClauseLens is an AI-powered contract comparison tool that helps users analyze changes between two versions of a legal document. Upload your original and revised contracts to receive a complete risk report — every change detected, risk-scored, and explained in plain English.

---

## ✨ Features

- 🔍 Detects changes between two contract versions
- ⚠️ Risk scoring system: **CRITICAL / MODERATE / MINOR**
- 💬 Explains legal changes in plain English
- ✅ Smart recommendations: **Reject / Negotiate / Acceptable**
- 📄 Supports PDF, DOCX, and TXT files
- ⚡ Fast contract analysis powered by AI
- 🔒 No login required
- 🧠 Clean and modern UI with smooth UX

---

## 🚀 How It Works

1. Open the application
2. Upload your **original** contract
3. Upload the **revised** contract
4. Click **Analyze My Contract**
5. Review the generated risk report and recommendations

---

## 📂 Supported File Formats

- PDF
- DOCX
- TXT

**Maximum file size:** 10MB per file

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Frontend:** React + Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **AI Model:** Anthropic Claude (`claude-sonnet-4-20250514`)
- **PDF Parsing:** `pdf-parse`
- **DOCX Parsing:** `mammoth.js`
- **Deployment:** Vercel

---

## 🧪 Getting Started

### 1 — Clone the Repository

```bash
git clone https://github.com/your-username/clauselens.git
cd clauselens
```

### 2 — Install Dependencies

```bash
npm install
```

### 3 — Configure Environment Variables

Create a `.env.local` file in the root directory and add:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### 4 — Run the Development Server

```bash
npm run dev
```

Visit:

```txt
http://localhost:3000
```

---

## 🧳 Deployment

ClauseLens can be deployed on any Node.js-compatible hosting platform, but **Vercel** is recommended.

### Deploy on Vercel

1. Push your project to GitHub
2. Import the repository into Vercel
3. Add `ANTHROPIC_API_KEY` in:

   * Project Settings → Environment Variables
4. Deploy the project

---

## 📁 Project Structure

```txt
src/
├── app/
│   ├── components/
│   │   ├── Upload/
│   │   ├── Analysis/
│   │   ├── Report/
│   │   └── UI/
│   ├── api/
│   │   └── analyze/route.js
│   └── utils/
│       ├── extractText.js
│       ├── compareContracts.js
│       └── riskAnalysis.js
```

---

## 👥 Team

| Name      | Role                                  |
| --------- | ------------------------------------- |
| Amanullah | Architecture, AI pipeline, deployment |
| Fahad     | API integration, backend logic        |
| Khizra    | File upload, PDF/DOCX parsing         |
| Sehr      | UI/UX design, landing page            |
| Shafia    | Documentation, product communication  |

---

## 🧠 Notes

* No user authentication required
* No contract data is permanently stored
* Files are processed in-memory only
* Designed for hackathons, legal-tech demos, and rapid contract analysis

---

## 📬 License

MIT — Free to use, modify, and improve.
