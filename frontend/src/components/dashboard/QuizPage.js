import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const QuizPage = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(()=>{
    const fetch = async()=>{
      try{
        const res = await api.get('/quizzes/'+id);
        setQuiz(res.data);
        setAnswers(new Array(res.data.questions.length).fill(null));
      }catch(e){ setErr(e.message || 'Failed to load quiz'); }
    };
    fetch();
  },[id]);

  const select = (qidx, optIdx) => {
    const tmp = [...answers];
    tmp[qidx] = optIdx;
    setAnswers(tmp);
  };

  const submit = async ()=>{
    if(!user){ alert('Login required'); return; }
    try{
      const res = await api.post('/quizzes/'+id+'/attempt', { answers });
      // update local stored user points & badges
      const updated = {...user, points: res.data.newPoints, badges: res.data.badges};
      localStorage.setItem('user', JSON.stringify(updated));
      // Navigate to feedback page
      if (res.data.attemptId) {
        navigate(`/feedback/${res.data.attemptId}`);
      } else {
        navigate('/student');
      }
    }catch(e){
      setErr(e.response?.data?.msg || e.message || 'Submission failed');
    }
  };

  if(err) return <div className="container"><div className="error">{err}</div></div>;
  if(!quiz) return <div className="container"><div className="card">Loading...</div></div>;
  
  const allAnswered = answers.every(a => a !== null && a !== undefined);
  
  return (
    <div className="container quiz-page">
      <div className="card">
        <h2>{quiz.title}</h2>
        {quiz.course && <p className="small">Course: {quiz.course.title}</p>}
        <p className="small">Total Questions: {quiz.questions.length} | Total Points: {quiz.questions.reduce((sum, q) => sum + (q.points || 10), 0)}</p>
        
        <div className="quiz-questions">
          {quiz.questions.map((q,qi)=> (
            <div key={qi} className="quiz-question">
              <div className="question-header">
                <strong>Question {qi+1} ({q.points || 10} points)</strong>
              </div>
              <p className="question-text">{q.question}</p>
              <div className="options-list">
                {q.options.map((o,oi)=>(
                  <label key={oi} className={answers[qi]===oi ? 'option-selected' : ''}>
                    <input 
                      type="radio" 
                      name={'q'+qi} 
                      checked={answers[qi]===oi} 
                      onChange={()=>select(qi,oi)} 
                    />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="quiz-actions">
          <div className="progress-info">
            <p className="small">
              Progress: {answers.filter(a => a !== null && a !== undefined).length} / {quiz.questions.length} answered
            </p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={submit}
            disabled={!allAnswered}
          >
            {allAnswered ? 'Submit Quiz' : 'Answer All Questions to Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default QuizPage;
