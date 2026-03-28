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
Gemini 1.5 Pro acts as an autonomous agent, pulling **live weather** and **Google Places** data to craft a 3–5 stop adventure with fun micro‑challenges at each location.

Quest turns your city into a playground and your mood into a story.

---

## 🎮 How It Works  
1. The user is greeted with a clean, welcoming start screen.  
2. The user enters their **mood**, **free time**, and **location**.  
3. Gemini 1.5 Pro uses function calling to fetch:  
   - Real‑time weather  
   - Nearby places  
4. The agent synthesizes a personalized adventure with:  
   - 3–5 stops  
   - Mood‑aligned activities  
   - Weather‑aware adjustments  
   - Creative micro‑challenges  
5. The React frontend displays the adventure as a clean, scrollable quest timeline.


---

## 🛠️ Tech Stack  
- **Frontend:** React  
- **Backend:** Node.js  
- **AI:** Gemini 1.5 Pro (function calling)  
- **APIs:** Google Places, OpenWeather  
- **Output:** Structured JSON adventure plan rendered in UI  

---

## 🧠 Ideation & Development Process  
We started with the question:  
**“How can AI make real life more playful?”**

From there, we designed a simple but powerful loop:  
input → agent → real‑world data → adventure → action.

**In 24 hours, we built:**
- A working AI agent pipeline  
- Real‑time weather + Places integration  
- A challenge generator  
- A clean React interface  
- A stable end‑to‑end demo flow  

Our focus was on delivering a magical core experience rather than feature bloat.

---

## 🌦️ Key Features  
- Personalized adventures based on mood, time, and location  
- Weather‑aware and time‑aware planning  
- Real‑world stops pulled from Google Places  
- Creative micro‑challenges at each stop  
- Simple, mobile‑friendly UI  
- Fallback logic for API failures  

---

## 🔮 Future Roadmap  
With more time, we would add:  
- Social quests (friends join your adventure)  
- XP + leveling system  
- Safety‑aware routing  
- Local business partnerships  
- Daily AI‑crafted missions  
- Photo journaling + memory tracking  

---

## 📹 Demo Video  

---

## 📂 Repository Structure  
