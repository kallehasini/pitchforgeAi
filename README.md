# 🚀 PitchForge AI

## One README. The Right Pitch for Every Audience.

PitchForge AI is an AI-powered SaaS web application that transforms technical project documentation into professional, audience-specific pitch decks.

Users can upload README.md, PDF, DOCX, or TXT files. The application extracts and analyzes the project information using Google Gemini AI, allows users to review and edit the extracted information, and generates a structured pitch deck for the selected audience.

The project also demonstrates x402 payment authorization with Algorand Blockchain and provides a verification mechanism for generated pitch records.

---

## 🎯 Problem Statement

Many startups, developers, and project teams have detailed technical documentation but struggle to present their ideas effectively to investors, judges, and stakeholders.

Creating a professional pitch deck manually requires time, storytelling skills, presentation skills, and audience-specific content preparation.

PitchForge AI solves this problem by transforming existing technical documentation into structured, professional presentation content using Artificial Intelligence.

---

## 💡 Solution

PitchForge AI provides an end-to-end workflow:

```text
Upload Documentation
        ↓
Extract Information
        ↓
AI Analysis
        ↓
Review & Edit
        ↓
Select Audience
        ↓
x402 Payment Authorization
        ↓
Algorand Verification
        ↓
Generate Pitch Deck
        ↓
Preview Slides
        ↓
Export / Download
```

---

## ✨ Key Features

### 📄 Multiple Document Uploads

Supported formats:

- README.md
- PDF
- DOCX
- TXT

The application automatically detects the file type and extracts the document content into plain text.

### 🤖 AI-Powered Analysis

Google Gemini AI extracts:

- Project Name
- Problem
- Solution
- Features
- Technology Stack
- Target Users
- Business Model
- Revenue Model
- Market Opportunity
- Competitors
- Future Scope

The extracted information can be reviewed and edited before pitch generation.

### 🎯 Audience Optimizer

Supported audiences:

- Hackathon Judge
- Venture Capitalist
- Angel Investor
- Government Grant

The AI adapts the pitch according to the selected audience.

### 📊 Pitch Deck Generation

Generated pitch sections include:

1. Title
2. Problem
3. Solution
4. Features
5. Technology
6. Architecture
7. Business Model
8. Revenue
9. Competition
10. Roadmap
11. Funding
12. Thank You

Additional generated content:

- Presenter Notes
- 20 Investor Questions and Answers
- 30-second Elevator Pitch
- 60-second Elevator Pitch
- 3-minute Elevator Pitch

---

## 💳 x402 Payment Integration

The pitch-generation API is protected by x402 payment authorization.

### Payment Flow

```text
User clicks Generate Pitch
        ↓
Backend checks x402 authorization
        ↓
HTTP 402 Payment Required
        ↓
Payment Authorization
        ↓
Algorand Verification
        ↓
Payment Successful
        ↓
AI Generates Pitch
        ↓
PPTX Generation
```

For hackathon/demo purposes, a mock/demo x402 flow can be used when real payment credentials are unavailable. The demo must clearly indicate when it is simulated.

---

## ⛓️ Algorand Blockchain

Algorand is used as the blockchain/payment layer for the x402 integration.

Relevant transaction information can include:

- Transaction ID
- Generation ID
- Timestamp
- Payment Status
- Network

Sensitive information and complete uploaded documents are kept off-chain.

---

## 🔐 Verification

PitchForge AI provides a verification mechanism for generated pitch records.

A verification record can include:

- Verification ID
- Project ID
- Transaction ID
- Timestamp
- SHA-256 Hash
- Verification Status

### Verification Flow

```text
Generated Pitch
      ↓
SHA-256 Hash
      ↓
Verification Record
      ↓
Verification ID
      ↓
Hash Comparison
      ↓
Verified / Modified
```

**Verified:** The submitted artifact matches the stored hash.

**Modified:** The submitted artifact does not match the stored hash.

---

## 🖥️ Pitch Preview and Export

Users can preview generated slides using previous/next navigation.

The application generates editable PowerPoint presentations using PptxGenJS.

Premium functionality can include:

- PPTX export
- PDF export
- Unlimited downloads
- Unlimited history
- Premium badge

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │ Tailwind + Router   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       Document Processing   Gemini AI       MongoDB
              │                │                │
              └────────────────┘                │
                               │                 │
                               ▼                 │
                         x402 Payment            │
                               │                 │
                               ▼                 │
                          Algorand               │
                               │                 │
                               ▼                 │
                       Pitch Generation         │
                               │                 │
                               ▼                 │
                          PptxGenJS              │
                               │                 │
                               ▼                 │
                         Pitch Deck              │
```

---

## 🛠️ Technology Stack

### Frontend

- React
- Tailwind CSS
- React Router
- Framer Motion

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- MongoDB Atlas

### Artificial Intelligence

- Google Gemini API

### Presentation Generation

- PptxGenJS

### Blockchain

- Algorand SDK

### Payment

- x402

### Deployment

- Vercel
- Render
- MongoDB Atlas

---

## 📂 File Processing

| File Type | Processing |
|---|---|
| README.md | FileReader / text extraction |
| TXT | FileReader / text extraction |
| PDF | pdfjs-dist |
| DOCX | Mammoth |

Processing flow:

```text
Upload
  ↓
File Type Detection
  ↓
Text Extraction
  ↓
Plain Text
  ↓
Gemini AI
  ↓
Structured Project Information
```

---

## 🔄 Complete Application Workflow

```text
Landing Page
      ↓
Login / Signup
      ↓
Dashboard
      ↓
Upload Documentation
      ↓
Uploading...
      ↓
Extracting...
      ↓
Analyzing...
      ↓
Display Extracted Information
      ↓
Review & Edit
      ↓
Select Audience
      ↓
x402 Payment Authorization
      ↓
Algorand Payment Verification
      ↓
Gemini AI Generation
      ↓
PptxGenJS
      ↓
Pitch Deck Preview
      ↓
PPTX / PDF Export
      ↓
Verification
```

---

## 🔌 REST API

Authentication:

```text
POST /signup
POST /login
```

Document processing:

```text
POST /upload
POST /analyze
```

Pitch generation:

```text
POST /generate
```

The pitch-generation endpoint is protected by the x402 payment flow.

History:

```text
GET /history
```

Verification:

```text
GET /verify
```

---

## 📁 Project Structure

```text
pitchforge-ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── middleware/
│   └── server.js
│
├── .env.example
├── package.json
└── README.md
```

The exact structure may vary depending on the final implementation.

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB / MongoDB Atlas
- Google Gemini API key
- Algorand configuration

### Clone Repository

```bash
git clone https://github.com/YOUR-USERNAME/pitchforge-ai.git
cd pitchforge-ai
```

### Install Dependencies

If frontend and backend are separate:

```bash
cd frontend
npm install

cd ../backend
npm install
```

---

## 🔑 Environment Variables

Create `.env` files based on `.env.example`.

Example:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

ALGORAND_NETWORK=testnet
ALGORAND_SERVER=your_algorand_server
ALGORAND_PORT=443
ALGORAND_INDEXER=your_algorand_indexer
ALGORAND_PAYMENT_ADDRESS=your_payment_address

X402_CONFIGURATION=your_x402_configuration
```

Never commit API keys, passwords, private keys, wallet seed phrases, or database credentials to GitHub.

---

## ▶️ Running the Application

### Backend

```bash
cd backend
npm run dev
```

### Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Open the local URL displayed by the frontend development server.

---

## 🧪 Hackathon Demo Flow

1. Open PitchForge AI.
2. Login or Signup.
3. Upload a README, PDF, DOCX, or TXT file.
4. Extract project information.
5. Analyze the project using Gemini AI.
6. Review and edit the extracted information.
7. Select the target audience.
8. Click Generate Pitch Deck.
9. Demonstrate the x402 payment authorization.
10. Demonstrate Algorand payment/transaction verification.
11. Generate the audience-specific pitch.
12. Preview the slides.
13. Generate/export the PPTX.
14. Show the verification record.

---

## 🛡️ Error Handling

The application handles:

- Invalid files
- Unsupported file types
- PDF parsing errors
- DOCX parsing errors
- Gemini API errors
- MongoDB errors
- x402 payment errors
- Algorand errors
- Blockchain verification errors
- PPTX generation errors

User-friendly error messages are shown instead of exposing internal errors.

---

## 🔒 Security

The application uses:

- Environment variables for secrets
- Protected API routes
- Input validation
- File type validation
- File size restrictions
- Secure authentication
- No private keys in source code
- Sensitive information kept off-chain

---

## ☁️ Deployment

### Frontend

Vercel

### Backend

Render

### Database

MongoDB Atlas

Production credentials should be configured using environment variables.

---

## 📈 Future Scope

- GitHub repository integration
- More audience types
- Multi-language pitch generation
- Advanced AI slide designs
- Custom presentation themes
- Team collaboration
- Pitch analytics
- Real payment integration
- Advanced blockchain verification
- AI-powered presentation coaching

---

## 👥 Target Users

PitchForge AI can help:

- Startups
- Developers
- Entrepreneurs
- Hackathon participants
- Open-source developers
- Students
- Project teams

---

## 🌟 Project Highlights

### Artificial Intelligence
Gemini AI understands technical documentation and converts it into presentation-ready content.

### Automated Presentation Generation
PptxGenJS generates editable PowerPoint presentations from the AI-generated pitch.

### x402 Payment
The pitch-generation API uses HTTP 402 payment authorization before processing the generation request.

### Algorand Blockchain
Algorand provides the blockchain/payment layer for the x402 workflow and associated verification.

---

## 🎯 Project Impact

PitchForge AI reduces the time and effort required to transform technical documentation into clear, professional, audience-focused presentations.

Instead of manually creating slides, users can start with documentation they already have and use AI to transform it into presentation-ready content.

---

## 🏁 Conclusion

PitchForge AI bridges the gap between technical documentation and professional communication.

It combines:

**AI + Automated Pitch Generation + x402 + Algorand Blockchain**

into a single platform for transforming technical project documentation into professional, audience-specific presentations.

### From Documentation to Pitch — Automatically. 🚀

---

## 📜 License

This project was developed for educational and hackathon purposes.
