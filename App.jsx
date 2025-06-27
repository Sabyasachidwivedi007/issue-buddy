import React, { useEffect, useState } from 'react';
import { view } from '@forge/bridge';

function App() {
  const [summary, setSummary] = useState('');
  const [complexity, setComplexity] = useState('');
  const [loading, setLoading] = useState(false);

  const summarizeIssue = async () => {
    setLoading(true);
    const context = await view.getContext();
    const res = await fetch('/api/summarize', {
      method: 'POST',
      body: JSON.stringify({ issueKey: context.extension.issue.key }),
    });
    const data = await res.json();
    setSummary(data.summary);
    setComplexity(data.complexity);
    setLoading(false);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🧠 Issue Buddy</h2>
      <button onClick={summarizeIssue}>Summarize This Issue</button>
      {loading ? <p>Working...</p> : (
        <>
          <p><strong>TL;DR:</strong> {summary}</p>
          <p><strong>Complexity:</strong> {complexity}</p>
        </>
      )}
    </div>
  );
}

export default App;
