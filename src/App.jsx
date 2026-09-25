import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import QuizGenerator from './components/QuizGenerator';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [uploadedDocs, setUploadedDocs] = useState(['Karanam_Bhavana_Resume.pdf']);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleSidebarUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadStatus('Embedding vectors...');

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:8000/upload", { method: "POST", body: formData });
      const data = await response.json();

      setUploadedDocs((prev) => [...prev, data.filename]);
      setUploadStatus('Indexed successfully! 🎉');
      setSelectedFile(null);
      setTimeout(() => setUploadStatus(''), 4000);
    } catch (error) {
      setUploadStatus('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (filename) => {
    try {
      const response = await fetch(`http://localhost:8000/documents/${filename}`, { method: "DELETE" });
      if (response.ok) {
        setUploadedDocs((prev) => prev.filter((doc) => doc !== filename));
      }
    } catch (error) {
      console.error("Failed to delete document", error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <nav className="top-navbar">
        <div className="brand-logo">
          <span className="logo-icon">✨</span>
          <h2>StudyRAG Intelligence</h2>
        </div>
        <div className="nav-tabs">
          <button className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>💬 Tutor Chat</button>
          <button className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>🧠 Quiz Hub (10 Qs)</button>
        </div>
      </nav>

      {/* Main 2-Column Grid Layout */}
      <div className="dashboard-grid">
        {/* Left Card: Knowledge Canvas & Quick Upload */}
        <div className="card">
          <div className="card-header">📊 Knowledge Canvas & Upload</div>
          <div className="sidebar-content">
            {/* Quick Upload Widget */}
            <div className="mini-upload-box">
              <span style={{ fontSize: '1.5rem' }}>📄</span>
              <h4 style={{ fontSize: '0.9rem', marginTop: '6px' }}>Upload New PDF</h4>
              <form onSubmit={handleSidebarUpload}>
                <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} accept=".pdf,.docx,.txt" />
                <button type="submit" className="primary-btn" disabled={!selectedFile || uploading}>
                  {uploading ? 'Processing...' : 'Ingest Document'}
                </button>
              </form>
              {uploadStatus && <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '8px' }}>{uploadStatus}</p>}
            </div>

            {/* Active Vector Files List with Delete Feature */}
            <div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px' }}>Active Vectorized Files:</p>
              {uploadedDocs.map((doc, idx) => (
                <div key={idx} className="doc-node" style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <span style={{ fontSize: '1.2rem' }}>📑</span>
                    <div className="doc-info">
                      <h5>{doc}</h5>
                      <span>● Ready for RAG</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteDoc(doc)} 
                    title="Remove document"
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem', padding: '4px 8px' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Dynamic Center Viewport (Chat or Quiz) */}
        <div className="card">
          <div className="card-header">
            {activeTab === 'chat' ? '🤖 AI Tutor Assistant' : '📝 Interactive Topic Exam (10 Questions)'}
          </div>
          
          {activeTab === 'chat' && <ChatInterface />}
          {activeTab === 'quiz' && (
            <div className="full-panel-view" style={{ justifyContent: 'flex-start' }}>
              <QuizGenerator />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;