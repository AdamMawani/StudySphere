import React, { useState } from 'react';
import './App.css';

const OpenAIAPIKey = process.env.REACT_APP_OPENAI_API_KEY;

function MindMap({ mindMapData }) {
  return (
    <div className="mind-map">
      <h2>Generated Mind Map:</h2>
      <div className="mind-map-container">
        {mindMapData.blocks.map((block, index) => (
          <div
            key={index}
            className="mind-map-block"
            style={{ left: block.x, top: block.y }}
          >
            {block.content}
          </div>
        ))}
        {mindMapData.lines.map((line, index) => (
          <svg key={index} className="mind-map-line">
            <line
              x1={line.startX}
              y1={line.startY}
              x2={line.endX}
              y2={line.endY}
            />
          </svg>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [mindMapData, setMindMapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const generateMindMap = async () => {
    if (!prompt) {
      alert("Please enter a prompt.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-mindmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OpenAIAPIKey}`,
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      setMindMapData(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Mind Map Generator</h1>
      <textarea
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={handlePromptChange}
      />
      <button onClick={generateMindMap} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Mind Map'}
      </button>

      {error && <p className="error-message">Error: {error}</p>}

      {mindMapData && <MindMap mindMapData={mindMapData} />}
    </div>
  );
}

export default App;