import React, { useState } from 'react';

export default function QuizGenerator() {
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateQuiz = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("topic", topic);

      const response = await fetch("http://localhost:8000/quiz", { method: "POST", body: formData });
      const data = await response.json();
      setQuiz(data.quiz);
      setSubmitted(false);
      setSelectedAnswers({});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-wrapper">
      <form onSubmit={generateQuiz} style={{display: 'flex', gap: '12px', marginBottom: '25px'}}>
        <input 
          type="text" 
          placeholder="Enter a subject topic from your notes (e.g. machine learning, calculus)..." 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          style={{flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '12px 16px', borderRadius: '12px', color: 'white', outline: 'none'}}
        />
        <button type="submit" className="primary-btn" style={{width: '180px'}} disabled={loading}>
          {loading ? 'Building Quiz...' : 'Generate Exam 🚀'}
        </button>
      </form>

      {quiz && quiz.map((q, idx) => (
        <div key={q.id} className="quiz-card">
          <h4 style={{marginBottom: '15px'}}>Q{idx + 1}: {q.question}</h4>
          {q.options.map((opt, i) => (
            <label key={i} className={`option-item ${selectedAnswers[q.id] === opt ? 'selected' : ''}`}>
              <input type="radio" name={`q-${q.id}`} checked={selectedAnswers[q.id] === opt} onChange={() => setSelectedAnswers({...selectedAnswers, [q.id]: opt})} />
              {opt}
            </label>
          ))}
        </div>
      ))}

      {quiz && (
        <button className="primary-btn" onClick={() => setSubmitted(true)} style={{marginBottom: '30px'}}>
          Submit Evaluation 🎯
        </button>
      )}

      {submitted && <div style={{padding: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '12px', color: '#10b981', textAlign: 'center', fontWeight: 'bold'}}>Evaluation Submitted Successfully! Great job reviewing your documents 🎉</div>}
    </div>
  );
}