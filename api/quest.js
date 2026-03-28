import { generateQuestWithGemini } from '../server/geminiQuest.js';

const vibeConfigs = {
  adventurous: {
    title: 'Urban Explorer',
    summary: 'Push into a few unfamiliar corners and collect stories along the way.',
    color: '#e8534a',
    templates: [
      { icon: 'coffee', place: 'Hidden Cafe', challenge: 'Order the most unfamiliar thing on the menu and rate it out loud like a food critic.' },
      { icon: 'treePine', place: 'Neighborhood Park', challenge: 'Walk a path you would normally skip and photograph one detail that feels cinematic.' },
      { icon: 'bookOpen', place: 'Local Bookshop', challenge: 'Open a random book, read one page, and keep the best sentence in your notes.' },
      { icon: 'utensils', place: 'Bustling Food Spot', challenge: 'Try a snack you have never ordered before and describe it in three words.' },
      { icon: 'map', place: 'Scenic Detour', challenge: 'Take the long way to your next stop and look for one street or mural worth remembering.' },
      { icon: 'trophy', place: 'Hidden Gem Finish', challenge: 'Ask a local for one spot they love that tourists never find.' },
    ],
  },
  bored: {
    title: 'Spark Quest',
    summary: 'Low-stakes novelty to shake the day back into focus.',
    color: '#c084fc',
    templates: [
      { icon: 'gamepad2', place: 'Arcade Corner', challenge: 'Play exactly one round of something loud and let yourself be a little dramatic about it.' },
      { icon: 'coffee', place: 'Cozy Drink Stop', challenge: 'Pick a drink based only on its name and write a one-line review.' },
      { icon: 'music4', place: 'Record Store', challenge: 'Find one album cover you would frame and one song title that sounds like your mood.' },
      { icon: 'bookOpen', place: 'Indie Shop', challenge: 'Ask a staff member for the weirdest recommendation they have today.' },
      { icon: 'camera', place: 'Photo Spot', challenge: 'Capture three images that could pass as a movie trailer storyboard.' },
      { icon: 'map', place: 'Wandering Finish', challenge: 'Walk one block with no destination and note the first interesting thing you notice.' },
    ],
  },
  excited: {
    title: 'Momentum Run',
    summary: 'Keep the energy high with a fast-moving route and punchy challenges.',
    color: '#f5c842',
    templates: [
      { icon: 'zap', place: 'High-Energy Start', challenge: 'Do a quick victory lap around the block and set the tone for the quest.' },
      { icon: 'utensils', place: 'Quick Bite Spot', challenge: 'Order the boldest thing you can justify in under thirty seconds.' },
      { icon: 'treePine', place: 'Open-Air Stop', challenge: 'Do a two-minute reset: breathe deep, stretch, and name what you want more of today.' },
      { icon: 'shoppingBag', place: 'Local Market', challenge: 'Buy or spot one small thing that feels like a trophy from the day.' },
      { icon: 'flag', place: 'Final Viewpoint', challenge: 'End with a short voice memo describing the best moment so far.' },
      { icon: 'zap', place: 'Bonus Sprint', challenge: 'Find one spontaneous thing to do that was not on any plan today.' },
    ],
  },
  lazy: {
    title: 'Soft Mode',
    summary: 'Comfortable pacing, easy wins, and places that ask very little from you.',
    color: '#60a5fa',
    templates: [
      { icon: 'coffee', place: 'Slow Sip Cafe', challenge: 'Sit for ten quiet minutes and do absolutely nothing productive.' },
      { icon: 'sofa', place: 'Relaxed Lounge Spot', challenge: 'Find the coziest seat and people-watch without touching your phone.' },
      { icon: 'bookOpen', place: 'Library Nook', challenge: 'Read one page of anything and keep going only if it feels good.' },
      { icon: 'treePine', place: 'Shady Bench', challenge: 'Take a slow lap or just sit still and notice the weather for a minute.' },
      { icon: 'iceCreamCone', place: 'Treat Stop', challenge: 'Pick a comfort snack and enjoy it without multitasking.' },
      { icon: 'moon', place: 'Wind Down Spot', challenge: 'Find somewhere quiet to sit for five minutes and do absolutely nothing.' },
    ],
  },
  restless: {
    title: 'Move Quest',
    summary: 'A route built to turn pacing energy into forward motion.',
    color: '#4ade80',
    templates: [
      { icon: 'footprints', place: 'Walking Start', challenge: 'Take the fastest safe route for five minutes, then deliberately slow down and reset.' },
      { icon: 'treePine', place: 'Open Green Space', challenge: 'Do a lap, stretch your shoulders, and breathe until your pulse settles.' },
      { icon: 'shoppingBag', place: 'Busy Strip', challenge: 'Window shop with a mission: find one thing you did not know you wanted.' },
      { icon: 'utensils', place: 'Refuel Stop', challenge: 'Grab the fastest snack you can and eat it standing outside for one minute.' },
      { icon: 'map', place: 'Waypoint Finish', challenge: 'Pick one next destination for later this week so the momentum lasts.' },
      { icon: 'coffee', place: 'Cool-Down Cafe', challenge: 'Sit, breathe, and write down the one highlight of the route so far.' },
    ],
  },
  happy: {
    title: 'Good Vibes Route',
    summary: 'Light, social energy with a few excuses to keep the mood rolling.',
    color: '#f97316',
    templates: [
      { icon: 'sun', place: 'Sunny Start', challenge: 'Name three things that are already going right before you head out.' },
      { icon: 'coffee', place: 'Friendly Cafe', challenge: 'Give a genuine compliment to someone working there.' },
      { icon: 'music4', place: 'Creative Stop', challenge: 'Find a song, poster, or mural that matches your energy and snap a photo.' },
      { icon: 'utensils', place: 'Snack Mission', challenge: 'Share a bite, a recommendation, or a laugh with someone if the moment opens up.' },
      { icon: 'trophy', place: 'Victory Finish', challenge: 'Write the headline you would give today if it were a tiny adventure movie.' },
      { icon: 'star', place: 'Golden Hour Spot', challenge: 'Find the best light in the area and take one photo worth keeping forever.' },
    ],
  },
};

function formatDuration(index, totalStops, hours) {
  const totalMinutes = Math.max(hours, 1) * 60;
  const avg = Math.max(20, Math.round(totalMinutes / totalStops / 5) * 5);
  return `${avg + index * 5}m`;
}

function buildQuest({ vibe, time, location, activities }) {
  const config = vibeConfigs[vibe] || vibeConfigs.bored;
  const hours = Number(time) || 2;
  const totalStops = Math.min(Math.max(Number(activities) || 4, 2), config.templates.length);
  const area = (location || 'your area').trim();
  const stops = config.templates.slice(0, totalStops).map((template, index) => ({
    id: index + 1,
    place: `${template.place} near ${area}`,
    challenge: template.challenge,
    duration: formatDuration(index, totalStops, hours),
    icon: template.icon,
    color: config.color,
  }));
  return {
    title: `${config.title} in ${area}`,
    summary: config.summary,
    location: area,
    vibe: vibe || 'bored',
    time: hours,
    stops,
  };
}

async function fetchWeatherForLocation(locationQuery) {
  const key = process.env.OPENWEATHER_API_KEY?.trim();
  if (!key || !locationQuery?.trim()) return null;
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(locationQuery.trim())}&appid=${key}&units=imperial`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const w = data.weather?.[0];
    return {
      temp: Math.round(data.main?.temp ?? 0),
      description: w?.description ? w.description.replace(/\b\w/g, c => c.toUpperCase()) : '',
      city: data.name ?? locationQuery,
    };
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body;
  const location = typeof body?.location === 'string' ? body.location.trim() : '';

  if (!location) {
    return res.status(400).json({ error: 'Location is required.' });
  }

  try {
    const vibeKey = typeof body.vibe === 'string' ? body.vibe : 'bored';
    const hours = Number(body.time) || 2;
    const config = vibeConfigs[vibeKey] || vibeConfigs.bored;
    const totalStops = Math.min(Math.max(Number(body.activities) || 4, 2), config.templates.length);

    const weather = await fetchWeatherForLocation(location);

    const aiQuest = await generateQuestWithGemini({
      vibe: vibeKey,
      time: hours,
      location,
      weather,
      totalStops,
      themeColor: config.color,
      vibeTitleHint: config.title,
    });

    const quest =
      aiQuest ??
      buildQuest({ vibe: vibeKey, time: body.time, location, activities: body.activities });

    return res.status(200).json({ quest: { ...quest, weather } });
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Unable to generate quest.',
    });
  }
}
