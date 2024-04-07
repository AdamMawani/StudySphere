import React, { useState } from 'react';
import './App.css';

const OpenAIAPIKey = 'YOUR_OPENAI_API_KEY'; // Replace 'YOUR_OPENAI_API_KEY' with your actual OpenAI API key

function App() {
  const [prompt, setPrompt] = useState('');
  const [mindMapData, setMindMapData] = useState(null);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const generateMindMap = async () => {
    try {
      const response = await fetch('/api/generate-mindmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OpenAIAPIKey}`
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });
      const data = await response.json();
      setMindMapData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Mind Map Generator</h1>
      <textarea
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={handlePromptChange}
      ></textarea>
      <button onClick={generateMindMap}>Generate Mind Map</button>
      {mindMapData && (
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
      )}
    </div>
  );
}

export default App;