import React, { useState } from 'react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Welcome back! Your notes and documents are fully indexed. What would you like to review today?', sources: [] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", userMessage);

      const response = await fetch("http://localhost:8000/chat", { method: "POST", body: formData });
      const data = await response.json();

      setMessages((prev) => [...prev, { sender: 'ai', text: data.answer, sources: data.sources }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'ai', text: "Connection error with backend server.", sources: [] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden'}}>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-bubble">
              <p>{msg.text}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="source-badge">
                  📌 Source: {msg.sources[0].file} (Page {msg.sources[0].page})
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="message ai"><div className="message-bubble">Analyzing vector embeddings... ⚡</div></div>}
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input type="text" placeholder="Ask anything about your notes or syllabus..." value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit" className="send-btn">Send</button>
      </form>
    </div>
  );
}