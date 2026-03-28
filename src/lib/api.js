const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function generateQuest(payload) {
  const response = await fetch(`${API_BASE_URL}/api/quest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate quest.');
  }

  return data.quest;
}
