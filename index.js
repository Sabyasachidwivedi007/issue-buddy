import Resolver from '@forge/resolver';
import api from '@forge/api';

const resolver = new Resolver();

resolver.define('summarize', async ({ payload }) => {
  const { issueKey } = payload;

  const response = await api.asApp().requestJira(`/rest/api/3/issue/${issueKey}`);
  const data = await response.json();
  const desc = data.fields.description?.content?.map(c => c.content?.map(p => p.text).join(' ')).join(' ') || '';

  const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You're a Jira assistant." },
        { role: "user", content: `Summarize this issue: "${desc}". Also rate its complexity as Easy, Medium or Hard.` }
      ]
    })
  });

  const openAiData = await openAiRes.json();
  const content = openAiData.choices[0].message.content;

  const summary = content.split('Complexity:')[0].trim();
  const complexity = content.split('Complexity:')[1]?.trim() || 'Unknown';

  return { summary, complexity };
});

export const handler = resolver.getDefinitions();
