import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const FeedbackPage = () => {
  const { attemptId } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get(`/feedback/attempt/${attemptId}`);
        setFeedback(res.data);
        
        // Fetch quiz details
        const quizRes = await api.get(`/quizzes/${res.data.quiz}`);
        setQuiz(quizRes.data);
      } catch (e) {
        setErr(e.response?.data?.msg || e.message || 'Failed to load feedback');
      }
    };
    if (attemptId) fetchFeedback();
  }, [attemptId]);

  if (err) return <div className="container"><div className="error">{err}</div></div>;
  if (!feedback || !quiz) return <div className="container"><div className="card">Loading...</div></div>;

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'warning';
    if (percentage >= 50) return 'info';
    return 'danger';
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Quiz Evaluation - {quiz.title}</h2>
        
        <div className={`score-card score-${getScoreColor(feedback.percentage)}`}>
          <div className="score-display">
            <div className="score-main">{feedback.percentage}%</div>
            <div className="score-details">
              Score: {feedback.score} / {feedback.totalScore} points
            </div>
          </div>
          <div className="feedback-message">
            <strong>{feedback.feedback}</strong>
          </div>
        </div>

        <div className="questions-review">
          <h3>Question Review</h3>
          {quiz.questions.map((q, qIdx) => {
            const isCorrect = feedback.correctAnswers[qIdx] === feedback.studentAnswers[qIdx];
            return (
              <div key={qIdx} className={`question-review ${isCorrect ? 'correct' : 'incorrect'}`}>
                <div className="question-header">
                  <span className="question-number">Question {qIdx + 1}</span>
                  <span className={`question-status ${isCorrect ? 'correct-badge' : 'incorrect-badge'}`}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
                <p className="question-text">{q.question}</p>
                <div className="answers-comparison">
                  <div className="answer-section">
                    <strong>Your Answer:</strong>
                    <div className={`answer-box ${!isCorrect ? 'wrong-answer' : ''}`}>
                      {q.options[feedback.studentAnswers[qIdx]] || 'Not answered'}
                    </div>
                  </div>
                  {!isCorrect && (
                    <div className="answer-section">
                      <strong>Correct Answer:</strong>
                      <div className="answer-box correct-answer">
                        {q.options[feedback.correctAnswers[qIdx]]}
                      </div>
                    </div>
                  )}
                </div>
                <div className="points-info">
                  Points: {isCorrect ? q.points || 10 : 0} / {q.points || 10}
                </div>
              </div>
            );
          })}
        </div>

        <div className="feedback-actions">
          <button className="btn" onClick={() => navigate('/student')}>
            Back to Dashboard
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(`/quiz/${quiz._id}`)}>
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;

