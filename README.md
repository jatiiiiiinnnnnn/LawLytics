# ⚖️✨ LawLytics

**From legalese to plain speak, instantly.**

LawLytics is an **AI-powered legal co-pilot** designed to demystify complex legal documents. It transforms dense contracts, case files, and agreements into **simple, actionable insights**.  

✅ Instantly analyze documents for risks  
✅ Generate interactive case timelines  
✅ Ask plain-English questions and get **context-aware answers**  

---

## 🌐 Live Demo
🔗 [Try the live application on Vercel](https://lawlytics.vercel.app)

---

## 🚀 Key Features

- **AI-Powered Risk Analysis**  
  Upload a document and instantly see clauses color-coded by risk level (🔴 High, 🟠 Moderate, 🟢 Low).

- **AI Case Timeline Generator**  
  Extracts key dates, parties, and events to generate a **beautiful, interactive timeline**.

- **Conversational Q&A**  
  Ask questions in plain English and get **immediate answers** from the document.

- **🔐 Secure Authentication**  
  Email/Password and Google Sign-In (powered by Firebase Auth).

- **📂 Persistent Document Storage**  
  User-specific history stored securely with **Vercel Blob + Firebase Firestore**.

- **📑 Downloadable PDF Reports**  
  Generate and download **multi-page professional reports**.

- **👤 Personalized Dashboard**  
  Profile setup with user-specific experience.

- **💻 Modern UI**  
  Sleek, responsive, dark-mode interface.

---

## 🏗️ System Architecture
LawLytics is built on a **scalable full-stack architecture**, leveraging **serverless functions** and **managed cloud services**.

<img width="1433" height="553" alt="image" src="https://github.com/user-attachments/assets/a3b06d12-69c3-4dfb-86c8-fcb2bb926d55" />


---

## 🛠️ Tech Stack

| Category          | Technology |
|-------------------|------------|
| **Frontend**      | React (Vite), TailwindCSS |
| **Backend**       | Python (FastAPI) |
| **AI & LLM**      | Google Gemini API |
| **Database**      | Firebase Firestore |
| **Auth**          | Firebase Authentication |
| **File Storage**  | Vercel Blob |
| **Deployment**    | Vercel (Static + Serverless) |
| **PDF Processing**| PyMuPDF (Backend), jsPDF + html2canvas (Frontend) |

---

## ⚙️ Getting Started

### ✅ Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Git
- Firebase Project (Auth + Firestore enabled)
- Vercel Account (with Blob storage)

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/LawLytics.git
cd LawLytics
```

### 2️⃣ Backend Setup
```bash
cd backend
# Create virtual environment
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Environment Variables (backend/.env)
```env
GOOGLE_API_KEY="your_gemini_api_key"
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
```

Place serviceAccountKey.json from Firebase in backend/.

Run the backend:
```bash
uvicorn main:app --reload
```
Runs at 👉 http://localhost:8000

---

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
```
Environment Variables (frontend/.env)
```env
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
```
Run the frontend:
```bash
npm run dev
```
Runs at 👉 http://localhost:5173

Proxy Config (vite.config.js)
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

### 🚢 Deployment (Vercel)

1. Push your code to GitHub

2. Install Vercel CLI
   ```bash
   npm install -g vercel
   vercel link
   ```
3. Add environment variables in Vercel dashboard
4. Deploy
   ```bash
   vercel --prod
   ```
---
### 📜 License
Licensed under the MIT License.

