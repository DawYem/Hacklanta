# 🧭Quest — AI‑Generated Real‑World Adventures  
**Turn boredom into a story worth living.**

---

## 🧩 Problem  
We’re facing a silent crisis: adolescent boredom.  
Teens spend **6–9 hours/day** on screens doomscrolling, yet report record levels of loneliness, poor social skills, and lack of meaningful experiences. Traditional apps are designed to *consume* attention — not enrich it.

**Boredom isn’t “nothing to do.”  
It’s a lack of meaningful engagement.**

---

## 🚀 Solution  
**Quest** is an AI life‑adventure app that transforms your **mood**, **free time**, and **location** into a personalized real‑world mini‑adventure — generated on the fly.

You tell Quest how you feel and how much time you have.  
Gemini 2.0 Flash acts as an autonomous agent, pulling **Google Places** data to craft a 3–5 stop adventure with fun micro‑challenges at each location.

Quest turns your city into a playground and your mood into a story.

---

## 🎮 How It Works  
1. The user is greeted with a clean, welcoming start screen.
2. The user gets to select their avatar.
3. The user enters their **mood**, **free time**, and **location**.  
4. Gemini 1.5 Pro uses function calling to fetch:  
   - Real‑time weather  
   - Nearby places  
5. The agent synthesizes a personalized adventure with:  
   - 3–5 stops  
   - Mood‑aligned activities  
   - Creative micro‑challenges  
6. The React frontend displays the adventure as a clean, scrollable quest timeline.


---

## 🛠️ Tech Stack  
**Frontend:** React 19, Vite, Google Maps (@react-google-maps/api)  
**Backend:** Node.js, Vercel Serverless Functions  
**AI:** Google Gemini 2.0 Flash  
**APIs:** Google Maps (JS + Geocoding), BigDataCloud, ipapi.co, OpenWeatherMap  
**Deployment:** Vercel (main), Railway (backup)  
**Styling:** Custom CSS (pixel/retro), Press Start 2P font  

---

## 🧠 Ideation & Development Process  
We asked ourselves:  
**“How can AI make real life more playful?”**

From there, we designed a simple but powerful loop:  
input → agent → real‑world data → adventure → action.

**In 12 hours, we built:**
- A working AI agent pipeline  
- Real‑time weather + Places integration  
- A challenge generator  
- A clean React interface  
- A stable end‑to‑end demo flow  

Our focus was on crafting a tiny, magical core experience — the kind you’d expect from a cozy retro game, instead of piling on extra features.

---

## 🌦️ Key Features  
- Personalized adventures based on mood, time, and location  
- Real‑world stops pulled from Google Places  
- Creative micro‑challenges at each stop  
- Simple, mobile‑friendly UI  
- Fallback logic for API failures  
- Photo uploads for tasks
- XP system

## 🔮 Future Roadmap  
With more time, we would add:  
- Social quests (friends join your adventure)  
- Safety‑aware routing  
- Local business partnerships  
- Daily AI‑crafted missions  
- 
---

## 📹 Demo Video  

---

## 📂 Repository Structure  

```
src/              — React app (screens, map, theme, API client)
server/index.js   — HTTP API + quest assembly + optional weather
server/geminiQuest.js — Optional Gemini-generated quest JSON
public/           — Static assets
.env              — Local secrets (gitignored; copy from `.env.example`)
```

---

## Running & configuring this repository

The sections above describe the **product vision** (including a Gemini-based agent). **This repo** ships a working end-to-end flow with a **Node** quest API, **optional Gemini** for AI-written quests when `GEMINI_API_KEY` is set (otherwise template-based quests), **Google Maps / Places / Geocoding** on the client, and **optional OpenWeather** when `OPENWEATHER_API_KEY` is set.

### Quick start

```bash
npm install
cp .env.example .env
# Add VITE_MAPS_PLATFORM_API_KEY; optionally OPENWEATHER_API_KEY, GEMINI_API_KEY — see below
npm run dev:all
```

Open **http://localhost:5173/** (Vite). The API runs at **http://localhost:5050** (proxied as `/api` in dev).

Or run two terminals: `npm run server` and `npm run dev`.

### Environment variables

| Variable | Where | Purpose |
|----------|--------|---------|
| `VITE_MAPS_PLATFORM_API_KEY` | `.env` (client) | **Required** for the map. Enable Maps JavaScript API, Places API, Geocoding API; set HTTP referrer `http://localhost:5173/*`. |
| `OPENWEATHER_API_KEY` | `.env` (loaded by the server via `dotenv`) | Optional. If set, the quest response includes **live weather** for the location (shown on the map screen). Get a key at [OpenWeather](https://openweathermap.org/api). |
| `GEMINI_API_KEY` | `.env` (server only, never `VITE_*`) | Optional. **Google AI Studio [API key](https://aistudio.google.com/apikey)** — not an OAuth “Client ID”. Enables AI-generated quest titles, summaries, and stops; if unset or on error, the server uses template quests. Optional `GEMINI_MODEL` (e.g. `gemini-1.5-flash`) if the default model is unavailable. |
| `VITE_API_BASE_URL` | **Vercel** (or build env) | **Production:** set to your **Railway public URL** with **no path** and **no trailing slash**, e.g. `https://your-service.up.railway.app`. The browser calls `${VITE_API_BASE_URL}/api/quest`. **Local dev:** leave empty (Vite proxies `/api` → port 5050). |

Restart **Vite** after changing any `VITE_*` variable — on Vercel, **redeploy after changing** `VITE_*` (values are baked in at **build** time). Restart the **Node server** (or `npm run dev:all`) after changing `GEMINI_API_KEY`, `GEMINI_MODEL`, or `OPENWEATHER_API_KEY`.

### Implementation notes (current build)

1. **Landing** → **Avatar** (pick character) → **Vibe** (mood + time + location).  
2. **Loading** — the Node server builds a quest from your inputs (templates, or **Gemini** JSON when `GEMINI_API_KEY` is set).  
3. **Quest map** — Google Maps shows real places; GPS can highlight when you’re near the next stop; **Navigate** opens Google Maps directions.  
4. **Complete** — finish all stops to finish the run.

- **Maps:** Google Maps JavaScript API, Places (text search), Geocoding fallback, Geometry (distance for proximity check-in).  
- **Weather:** OpenWeather current weather API (optional, server-side).  
- **Gemini:** Optional; server calls the Generative Language API to build quest JSON; falls back to templates if the key is missing or the request fails.

### Production (Vercel frontend + Railway API)

1. **Railway:** Deploy the Node server (`server/index.js`), set `PORT` automatically, add `GEMINI_API_KEY` / `OPENWEATHER_API_KEY` if you use them. Copy the **public HTTPS** URL (e.g. `https://xxx.up.railway.app`).
2. **Vercel:** Set `VITE_API_BASE_URL` to that Railway origin **only** (no `/api` suffix). Set `VITE_MAPS_PLATFORM_API_KEY` and add your **Vercel production URL** to the Maps key HTTP referrer allowlist.
3. **Redeploy Vercel** after any `VITE_*` change so the client bundle picks up the new values.
4. In the browser **Network** tab, confirm `POST …/api/quest` goes to Railway (not `yoursite.vercel.app` only).
