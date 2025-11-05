import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [err, setErr] = useState('');
  const [activeTab, setActiveTab] = useState('quizzes');

  useEffect(() => {
    fetchQuizzes();
    fetchCourses();
    fetchMaterials();
    fetchFeedbacks();
    // Refresh user data
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/quizzes');
      setQuizzes(res.data);
    } catch (e) {
      setErr(e.message || 'Failed to load quizzes');
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (e) {
      setErr(e.message || 'Failed to load courses');
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await api.get('/materials');
      setMaterials(res.data);
    } catch (e) {
      setErr(e.message || 'Failed to load materials');
    }
  };

  const fetchFeedbacks = async () => {
    try {
      if (user?.id) {
        const res = await api.get(`/feedback/user/${user.id}`);
        setFeedbacks(res.data);
      }
    } catch (e) {
      // Silently fail if feedbacks can't be loaded
    }
  };

  const getBadgeColor = (badge) => {
    if (badge.includes('Champion')) return 'badge-gold';
    if (badge.includes('Master')) return 'badge-silver';
    return 'badge-bronze';
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Student Dashboard</h2>
        
        {user && (
          <div className="user-stats">
            <div className="stat-card">
              <div className="stat-value">{user.points || 0}</div>
              <div className="stat-label">Total Points</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{feedbacks.length}</div>
              <div className="stat-label">Quizzes Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{user.badges?.length || 0}</div>
              <div className="stat-label">Badges Earned</div>
            </div>
          </div>
        )}

        {user?.badges?.length > 0 && (
          <div className="badges-section">
            <h3>Your Badges</h3>
            <div className="badges-container">
              {user.badges.map((badge, idx) => (
                <div key={idx} className={`badge-display ${getBadgeColor(badge)}`}>
                  <span className="badge-icon">🏆</span>
                  <span className="badge-name">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="tabs">
          <button className={activeTab === 'quizzes' ? 'tab-active' : 'tab'} onClick={() => setActiveTab('quizzes')}>
            Available Quizzes ({quizzes.length})
          </button>
          <button className={activeTab === 'materials' ? 'tab-active' : 'tab'} onClick={() => setActiveTab('materials')}>
            Course Materials ({materials.length})
          </button>
          <button className={activeTab === 'feedback' ? 'tab-active' : 'tab'} onClick={() => setActiveTab('feedback')}>
            My Evaluations ({feedbacks.length})
          </button>
        </div>

        {err && <div className="error">{err}</div>}

        {activeTab === 'quizzes' && (
          <div>
            <h3>Available Quizzes</h3>
            <div className="quizzes-list">
              {quizzes.length === 0 ? (
                <p className="small">No quizzes available at the moment.</p>
              ) : (
                quizzes.map(q => (
                  <div key={q._id} className="quiz-card">
                    <div>
                      <div><strong>{q.title}</strong></div>
                      <div className="small">Course: {q.course?.title || 'General'}</div>
                      <div className="small">Questions: {q.questions?.length || 0}</div>
                      <div className="small">Total Points: {q.questions?.reduce((sum, q) => sum + (q.points || 10), 0) || 0}</div>
                    </div>
                    <div>
                      <Link to={'/quiz/'+q._id} className="btn btn-primary">
                        Take Quiz
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div>
            <h3>Course Materials</h3>
            <div className="materials-grid">
              {materials.length === 0 ? (
                <p className="small">No materials available at the moment.</p>
              ) : (
                materials.map(material => (
                  <div key={material._id} className="material-card">
                    <h4>{material.title}</h4>
                    <p className="small">{material.description || 'No description'}</p>
                    <p className="small">Course: {material.course?.title || 'Unknown'}</p>
                    <p className="small">Type: <span className={`material-type material-${material.fileType}`}>{material.fileType}</span></p>
                    {material.fileUrl && (
                      <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-link">
                        View Material →
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div>
            <h3>Quiz Evaluations & Feedback</h3>
            {feedbacks.length === 0 ? (
              <p className="small">You haven't completed any quizzes yet. Take a quiz to see your evaluations!</p>
            ) : (
              <div className="feedbacks-list">
                {feedbacks.map(fb => (
                  <div key={fb._id} className="feedback-card">
                    <div className="feedback-header">
                      <div>
                        <strong>{fb.quiz?.title || 'Quiz'}</strong>
                        <div className="small">Completed: {new Date(fb.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className={`score-badge score-${fb.percentage >= 90 ? 'excellent' : fb.percentage >= 70 ? 'good' : fb.percentage >= 50 ? 'fair' : 'poor'}`}>
                        {fb.percentage}%
                      </div>
                    </div>
                    <div className="feedback-body">
                      <p><strong>Score:</strong> {fb.score} / {fb.totalScore} points</p>
                      <p><strong>Feedback:</strong> {fb.feedback}</p>
                    </div>
                    <Link to={`/feedback/${fb.attempt}`} className="btn btn-small">
                      View Detailed Evaluation
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
