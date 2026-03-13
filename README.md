# DataTalk 🤖📊

<div align="center">

**Conversational AI for Instant Business Intelligence Dashboards**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.com)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3-F55036?style=for-the-badge)](https://groq.com)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-22B5BF?style=for-the-badge)](https://recharts.org)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)


</div>

---

## 📌 Problem Statement

Non-technical business executives struggle to extract insights from large sales datasets. Traditional BI tools require SQL knowledge, complex dashboards, and hours of setup. **DataTalk** solves this by letting anyone ask questions in plain English and instantly get interactive, AI-generated charts and insights.

---

## ✨ Features

- 🔐 **Secure Authentication** — Google, GitHub, Email login via Clerk
- 💬 **Conversational AI** — Ask questions in plain English, get instant dashboards
- 📊 **5 Chart Types** — Line, Bar, Area, Pie, Multiline with Recharts
- 🧠 **Multi-turn Memory** — Follow-up questions maintain full context
- ⚡ **Ultra Fast** — Powered by Groq's LLaMA 3.3 70B (fastest free LLM)
- 📱 **Responsive UI** — Works on desktop, tablet, and mobile
- 🎨 **Dark Theme** — Professional dark UI with smooth animations
- 💡 **Smart Suggestions** — AI generates follow-up query chips automatically
- 📦 **50K Orders Dataset** — Real Amazon Sales data (Jan 2022 – Dec 2023)

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    A([👤 User]) -->|Opens App| B[React Frontend\nVite + Recharts]
    B -->|Not Authenticated| C[Clerk Sign-In Page\nGoogle / GitHub / Email]
    C -->|Auth Success| D[Dashboard View]
    B -->|Authenticated| D

    D -->|Types Query| E[Input Bar]
    E -->|Sends Message| F[askGemini Function\nGroq API Call]

    F -->|POST Request| G[Groq API\nLLaMA 3.3 70B]
    G -->|System Prompt +\nConversation History| H{AI Processing}
    H -->|Returns JSON| I[Response Parser]

    I -->|Valid JSON| J[Chart Renderer]
    I -->|Parse Error| K[Error Message]

    J --> L{Chart Type?}
    L -->|line| M[LineChart]
    L -->|bar| N[BarChart]
    L -->|pie| O[PieChart]
    L -->|area| P[AreaChart]
    L -->|multiline| Q[MultiLineChart]

    M & N & O & P & Q --> R[Dashboard Response Card\nTitle + Insight + Charts]
    R --> S[Follow-up Suggestion Chips]
    S -->|User Clicks| E

    subgraph DB[📦 Embedded Dataset]
        T[50K Amazon Orders\n2022–2023]
        T --> U[monthly_revenue]
        T --> V[revenue_by_category]
        T --> W[revenue_by_region]
        T --> X[revenue_by_payment]
        T --> Y[quarterly_revenue]
        T --> Z[monthly_by_category]
    end

    F -.->|References| DB

    subgraph AUTH[🔐 Clerk Auth]
        C --> C1[Google OAuth]
        C --> C2[GitHub OAuth]
        C --> C3[Email + Password]
    end

    style A fill:#6366f1,color:#fff
    style G fill:#f55036,color:#fff
    style DB fill:#0c1220,color:#e2e8f0
    style AUTH fill:#6C47FF,color:#fff
```

---

## 🔄 User Flow

```mermaid
sequenceDiagram
    actor User
    participant App as React App
    participant Clerk as Clerk Auth
    participant Groq as Groq API (LLaMA 3.3)
    participant Charts as Recharts

    User->>App: Opens localhost:3000
    App->>Clerk: Check auth status
    Clerk-->>App: Not signed in
    App-->>User: Show Sign-In Page

    User->>Clerk: Sign in with Google
    Clerk-->>App: Auth token + user profile
    App-->>User: Show Dashboard + KPI Cards

    User->>App: "Which category earns most?"
    App->>Groq: POST /chat/completions\n(system prompt + query)
    Groq-->>App: JSON response\n{dashboard_title, charts[], insights}
    App->>Charts: Render bar chart
    Charts-->>User: Interactive visualization + insights

    User->>App: Clicks follow-up chip
    App->>Groq: POST /chat/completions\n(full conversation history)
    Groq-->>App: JSON with new charts
    App-->>User: Updated dashboard
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI framework |
| **Charts** | Recharts 2.12 | Interactive visualizations |
| **Auth** | Clerk v5 | Google/GitHub/Email login |
| **AI** | Groq (LLaMA 3.3 70B) | Natural language → JSON |
| **Styling** | Inline CSS + CSS animations | Dark theme UI |
| **Deployment** | Vercel | Hosting + CI/CD |
| **Dataset** | Amazon Sales CSV (50K rows) | Business data |

---

## 📊 Dataset Overview

| Attribute | Details |
|-----------|---------|
| **Source** | Amazon Sales Dataset (Kaggle) |
| **Rows** | 50,000 orders |
| **Date Range** | January 2022 – December 2023 |
| **Total Revenue** | $32,866,573.74 |
| **Avg Order Value** | $657.33 |
| **Categories** | Beauty, Books, Electronics, Fashion, Home & Kitchen, Sports |
| **Regions** | Asia, Europe, Middle East, North America |
| **Payment Methods** | UPI, Credit Card, Debit Card, Wallet, Cash on Delivery |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Free accounts on [Groq](https://console.groq.com) and [Clerk](https://dashboard.clerk.com)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/RICK2814/datatalk.git
cd datatalk

# 2. Install dependencies
npm install

# 3. Create environment file (Windows PowerShell)
[System.IO.File]::WriteAllText(".env.local", "VITE_GROQ_API_KEY=gsk_your-key-here`nVITE_CLERK_PUBLISHABLE_KEY=pk_test_your-key-here")

# 4. Start development server
npm run dev
```

### Environment Variables

| Variable | Where to Get |
|----------|-------------|
| `VITE_GROQ_API_KEY` | [console.groq.com](https://console.groq.com) → API Keys |
| `VITE_CLERK_PUBLISHABLE_KEY` | [dashboard.clerk.com](https://dashboard.clerk.com) → API Keys |

---

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import `datatalk`
3. Add environment variables in **Project Settings → Environment Variables**
4. Click **Deploy**
5. Add your Vercel URL to Clerk **Allowed Domains**

---

## 💬 Example Queries

| Query | Chart Generated |
|-------|----------------|
| "Show monthly revenue trend" | Line Chart |
| "Which category earns most?" | Bar Chart |
| "Revenue by payment method" | Pie Chart |
| "Compare regions and categories" | Grouped Bar Chart |
| "Category performance over time" | Multiline Chart |
| "Show quarterly performance" | Area Chart |

---

## 📁 Project Structure

```
datatalk/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main app (auth + dashboard + AI + charts)
│   ├── main.jsx         # React root + ClerkProvider
│   └── index.css        # Global styles
├── .env.example         # Environment variable template
├── .gitignore
├── index.html
├── package.json
├── vercel.json          # SPA routing config
└── vite.config.js
```

---

## 👥 Team

| Name | Role | College |
|------|------|---------|
| Rohit | Full Stack Developer | JIS College of Engineering, Kalyani |
| Sania | Full Stack Developer | JIS College of Engineering, Kalyani |
|Sambhab| Full Stack Developer | JIS College of Engineering, Kalyani |

> Built with ❤️ 

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">
  <strong>DataTalk</strong> · Amazon Sales · 50,000 orders · 
</div>
