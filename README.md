# ✈️ Travel AI Assistant

> AI-powered travel planning app — phrasebook, checklist, daily itinerary and interactive map for any city.

**Portfolio project built with Next.js 14, React, TypeScript, Tailwind CSS and Claude API (Anthropic).**

---

## 🚀 Live Demo

🔗 **[travel-ai-assistant.vercel.app](https://travel-ai-assistant.vercel.app)**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📖 **Phrasebook** | 20–30 local phrases with pronunciation guide |
| ✅ **Checklist** | Destination-specific travel checklist with progress bar |
| 🗓️ **Itinerary** | Realistic 1-day plan with times, costs and insider tips |
| 🗺️ **Map** | Interactive OpenStreetMap with AI-placed markers |
| 💡 **Tips** | Food, safety, scams, transport, photo spots, etiquette |
| 🌍 **PL / EN** | Full Polish and English language support |
| 📱 **Responsive** | Mobile-first design with desktop/mobile preview toggle |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI**: [Claude API](https://www.anthropic.com/) (Anthropic, claude-sonnet-4)
- **Map**: [React-Leaflet](https://react-leaflet.js.org/) + [OpenStreetMap](https://www.openstreetmap.org/)
- **Storage**: localStorage (no backend required)
- **Hosting**: [Vercel](https://vercel.com/)

---

## 📁 Project Structure

```
travel-ai-assistant/
├── app/
│   ├── api/generate/route.ts   # Server-side Claude API proxy
│   ├── layout.tsx               # Root HTML layout + metadata
│   ├── page.tsx                 # Main SPA — all pages rendered here
│   └── globals.css              # Tailwind base + global styles
├── components/
│   ├── map/
│   │   └── TravelMap.tsx        # Leaflet map (dynamic import, SSR-safe)
│   ├── results/
│   │   ├── Phrasebook.tsx       # Grouped phrase cards
│   │   ├── Checklist.tsx        # Interactive checklist with progress
│   │   ├── Itinerary.tsx        # Timeline-style day plan
│   │   └── Tips.tsx             # Color-coded tip cards
│   └── ui/
│       └── Navbar.tsx           # Top navigation bar
├── hooks/
│   ├── useLocalStorage.ts       # SSR-safe localStorage hook
│   └── useLang.ts               # Language persistence hook
├── lib/
│   ├── ai.ts                    # Claude API integration
│   ├── prompts.ts               # System + user prompt builders
│   └── i18n.ts                  # PL / EN translations
├── types/
│   └── index.ts                 # All TypeScript interfaces
├── .env.example                 # Environment variable template
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## ⚡ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/travel-ai-assistant.git
cd travel-ai-assistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your free API key at: **https://console.anthropic.com/**

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deploy to Vercel

### Option A: One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/travel-ai-assistant)

### Option B: Manual deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Add environment variable: `ANTHROPIC_API_KEY` = your key
5. Click **Deploy** ✅

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | ✅ Yes |

**Important**: Never commit `.env.local` to Git. It's in `.gitignore` by default.

---

## 🏗️ Architecture Decisions

### Why Next.js App Router?
- Server-side API route keeps the API key secret (never exposed to browser)
- Built-in TypeScript, great Vercel integration
- File-based routing is clean for MVP

### Why localStorage (no database)?
- Zero backend setup needed for MVP
- Works offline
- Easy to upgrade to Supabase later

### Why Leaflet + OpenStreetMap?
- 100% free, no API key required for maps
- Great React integration via react-leaflet
- Used by Wikipedia, major projects worldwide

### AI JSON Structure
The Claude API returns a structured JSON with 5 sections:
```
phrasebook[] → checklist{} → itinerary[] → map_points[] → tips{}
```
The system prompt enforces strict output format with no markdown wrapping.

---

## 🗺️ Roadmap (Post-MVP)

- [ ] User accounts with Supabase
- [ ] Save and share travel plans
- [ ] PDF export of travel plan
- [ ] More destinations + presets
- [ ] Offline mode (PWA)
- [ ] Dark mode

---

## 📄 License

MIT — feel free to fork, modify and use as inspiration for your own projects.

---

## 👤 Author

Built by [Your Name] as a portfolio project demonstrating:
- AI API integration (Claude / Anthropic)
- Modern React patterns (hooks, dynamic imports, context)
- Mobile-first responsive design
- TypeScript for full type safety
- Production-ready Next.js architecture

**LinkedIn**: [your-linkedin]  
**GitHub**: [your-github]
