/** Public Railway (or other) origin — no trailing slash. Empty in dev when Vite proxies `/api`. */
const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL ?? '')
  .trim()
  .replace(/\/+$/, '');

export async function generateQuest(payload) {
  const url = `${API_BASE_URL}/api/quest`;

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    const isNetwork =
      err instanceof TypeError &&
      (String(err.message).includes('fetch') || String(err.message).includes('Failed'));
    if (import.meta.env.PROD && !API_BASE_URL) {
      throw new Error(
        'Quest API URL missing: set VITE_API_BASE_URL on Vercel to your Railway URL (https://…), then redeploy.'
      );
    }
    throw new Error(
      isNetwork
        ? 'Cannot reach the quest API. Set VITE_API_BASE_URL to your Railway https URL, redeploy Vercel, and ensure Railway is running.'
        : err instanceof Error
          ? err.message
          : 'Failed to connect to quest server.'
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Failed to generate quest (${response.status}).`);
  }

  return data.quest;
}
