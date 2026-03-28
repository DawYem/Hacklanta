import { GoogleGenerativeAI } from '@google/generative-ai';

/** Must match `src/lib/icons.js` `stopIconMap` keys */
const ALLOWED_ICONS = new Set([
  'batteryLow',
  'bookOpen',
  'camera',
  'coffee',
  'flag',
  'footprints',
  'gamepad2',
  'iceCreamCone',
  'map',
  'moon',
  'music4',
  'shoppingBag',
  'sofa',
  'sun',
  'swords',
  'treePine',
  'trophy',
  'utensils',
  'wind',
  'zap',
]);

const ICON_PROMPT_LIST = [...ALLOWED_ICONS].sort().join(', ');

function normalizeStops(raw, totalStops, themeColor, location) {
  const list = Array.isArray(raw) ? raw.slice(0, totalStops) : [];
  const area = (location || 'your area').trim() || 'your area';
  const out = [];
  for (let i = 0; i < totalStops; i++) {
    const s = list[i] || {};
    const icon =
      typeof s.icon === 'string' && ALLOWED_ICONS.has(s.icon) ? s.icon : 'map';
    const color =
      typeof s.color === 'string' && /^#[0-9a-fA-F]{6}$/.test(s.color)
        ? s.color
        : themeColor;
    out.push({
      id: i + 1,
      place:
        String(s.place || `Interesting stop ${i + 1} near ${area}`).slice(0, 220),
      challenge: String(
        s.challenge || 'Spend a few minutes exploring here and note one detail you would not have noticed at home.'
      ).slice(0, 600),
      duration: String(s.duration || `${20 + i * 5}m`).slice(0, 20),
      icon,
      color,
    });
  }
  return out;
}

/**
 * Uses Gemini when GEMINI_API_KEY is set. Returns null on missing key or any failure
 * so the caller can fall back to template quests.
 */
export async function generateQuestWithGemini({
  vibe,
  time,
  location,
  weather,
  totalStops,
  themeColor,
  vibeTitleHint,
}) {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) return null;

  const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash';
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.75,
    },
  });

  const weatherLine = weather
    ? `Weather hint (mention lightly in summary only if helpful): ${weather.temp}°F, ${weather.description} (${weather.city}).`
    : 'Weather: not available; do not invent numbers.';

  const prompt = `You design short real-world walking quests (public places, safe, PG, inclusive).

Area / location focus: "${location}"
Vibe id: ${vibe}
Time budget (hours): ${time}
Theme color for all stops (hex): ${themeColor}
Title style hint: ${vibeTitleHint}

${weatherLine}

Return ONLY valid JSON (no markdown) with this shape:
{
  "title": "string, under 90 characters, can mention the area",
  "summary": "string, 1-2 sentences",
  "stops": [
    {
      "place": "string — type of place near ${location} (e.g. café, park, bookstore). Avoid claiming a specific business exists unless it is generic.",
      "challenge": "string — one micro-challenge doable in public in under 10 minutes",
      "duration": "string like 25m or 40m",
      "icon": "string — MUST be one of: ${ICON_PROMPT_LIST}",
      "color": "${themeColor}"
    }
  ]
}

Rules:
- Put exactly ${totalStops} objects in "stops".
- Each "icon" must be exactly one string from the list above (camelCase).
- Challenges must not require buying anything expensive, trespassing, or unsafe behavior.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed.title !== 'string' || !Array.isArray(parsed.stops)) {
      return null;
    }
    return {
      title: String(parsed.title).slice(0, 120),
      summary: String(parsed.summary ?? '').slice(0, 500),
      location: (location || 'your area').trim(),
      vibe: vibe || 'bored',
      time: Number(time) || 2,
      stops: normalizeStops(parsed.stops, totalStops, themeColor, location),
    };
  } catch (err) {
    console.error('[Gemini quest]', err);
    return null;
  }
}
