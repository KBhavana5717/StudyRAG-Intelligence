import { useState } from 'react';

export default function DocumentUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setStatus('Parsing document chunks and embedding vectors...');

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/upload", { method: "POST", body: formData });
      const data = await response.json();

      setStatus('Successfully indexed and embedded! 🎉');
      onUploadSuccess(data.filename);
      setFile(null);
    } catch (error) {
      setStatus('Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-box">
      <span style={{fontSize: '3rem'}}>📥</span>
      <h3 style={{marginTop: '15px'}}>Upload Study Material</h3>
      <p style={{color: '#94a3b8', fontSize: '0.85rem', marginTop: '5px'}}>Supports PDFs, text notes, and course modules</p>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.docx,.png,.jpg" />
        <button type="submit" className="primary-btn" disabled={!file || uploading}>
          {uploading ? 'Processing Vectors...' : 'Ingest Document'}
        </button>
      </form>
      {status && <p style={{marginTop: '15px', color: '#10b981', fontSize: '0.9rem'}}>{status}</p>}
    </div>
  );
}