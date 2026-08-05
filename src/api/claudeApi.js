const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export async function prioritizeTasks(tasks) {
  const taskList = tasks.map((t) => `- ${t.title}: ${t.description}`).join('\n');

  const prompt = `Below is a list of tasks. Analyze them and return ONLY a JSON array 
of task titles ordered from HIGHEST priority to LOWEST priority. 
No explanation, just the JSON array.

Tasks:
${taskList}

Respond ONLY with JSON like: ["Task title 1", "Task title 2", ...]`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content[0].text;
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Error prioritizing tasks:', error);
    return null;
  }
}

export async function generateDescription(title) {
  const prompt = `Generate a short, professional task description (1-2 sentences) 
for this task title: "${title}". 
Respond ONLY with the description text, nothing else.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    return data.content[0].text.trim();
  } catch (error) {
    console.error('Error generating description:', error);
    return '';
  }
}