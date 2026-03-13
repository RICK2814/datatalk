# DataTalk 🤖📊
**Conversational AI for Instant Business Intelligence Dashboards**
> HackOverFlow · CultRang '26 · React + Clerk + Claude AI + Recharts

---

## 🚀 Deploy in 4 Steps

### Step 1 — Get your keys
| Key | Where to get it |
|-----|----------------|
| `VITE_GEMINI_API_KEY` | [console.anthropic.com](https://aistudio.google.com/app/apikey) |
| `VITE_CLERK_PUBLISHABLE_KEY` | [dashboard.clerk.com](https://dashboard.clerk.com) → API Keys |

### Step 2 — Configure Clerk
In Clerk Dashboard → **Allowed Origins**, add:
- `http://localhost:3000`
- Your Vercel URL (after deploying)

### Step 3 — Run locally
```bash
npm install
cp .env.example .env.local    # fill in your keys
npm run dev                    # http://localhost:3000
```

### Step 4 — Deploy to Vercel
```bash
git init && git add . && git commit -m "DataTalk v1"
gh repo create datatalk --public --push
```
Then in Vercel → Project Settings → Environment Variables, add both keys.

---

## 💬 Demo Queries
1. "Show me monthly revenue trend for 2022 vs 2023"
2. "Which product category generates the most revenue?"
3. "Break down revenue by region and category"
4. "Compare payment methods by revenue"
5. "Show quarterly revenue performance"

