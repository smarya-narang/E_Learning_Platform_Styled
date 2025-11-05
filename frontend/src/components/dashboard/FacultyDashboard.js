import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const FacultyDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState('courses');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [courseForm, setCourseForm] = useState({ title: '', description: '' });
  const [quizForm, setQuizForm] = useState({ title: '', course: '', questions: [{ question: '', options: ['', '', '', ''], correctIndex: 0, points: 10 }] });
  const [materialForm, setMaterialForm] = useState({ title: '', description: '', course: '', fileUrl: '', fileType: 'other' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchCourses();
    fetchQuizzes();
    fetchMaterials();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      const myCourses = res.data.filter(c => c.faculty?._id === user?.id || c.faculty === user?.id);
      setCourses(myCourses);
    } catch (e) {
      setErr(e.response?.data?.msg || e.message || 'Failed to load courses');
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await api.get('/quizzes');
      setQuizzes(res.data);
    } catch (e) {
      setErr(e.response?.data?.msg || e.message || 'Failed to load quizzes');
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await api.get('/materials');
      setMaterials(res.data);
    } catch (e) {
      setErr(e.response?.data?.msg || e.message || 'Failed to load materials');
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      await api.post('/courses', courseForm);
      setCourseForm({ title: '', description: '' });
      setShowCourseForm(false);
      fetchCourses();
    } catch (e) {
      setErr(e.response?.data?.msg || e.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const questions = quizForm.questions.filter(q => q.question.trim() && q.options.every(opt => opt.trim()));
      await api.post('/quizzes', { ...quizForm, questions });
      setQuizForm({ title: '', course: '', questions: [{ question: '', options: ['', '', '', ''], correctIndex: 0, points: 10 }] });
      setShowQuizForm(false);
      fetchQuizzes();
    } catch (e) {
      setErr(e.response?.data?.msg || e.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMaterial = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      await api.post('/materials', materialForm);
      setMaterialForm({ title: '', description: '', course: '', fileUrl: '', fileType: 'other' });
      setShowMaterialForm(false);
      fetchMaterials();
    } catch (e) {
      setErr(e.response?.data?.msg || e.message || 'Failed to upload material');
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = () => {
    setQuizForm({
      ...quizForm,
      questions: [...quizForm.questions, { question: '', options: ['', '', '', ''], correctIndex: 0, points: 10 }]
    });
  };

  const updateQuestion = (idx, field, value) => {
    const questions = [...quizForm.questions];
    if (field === 'option') {
      const [optIdx, optValue] = value;
      questions[idx].options[optIdx] = optValue;
    } else {
      questions[idx][field] = value;
    }
    setQuizForm({ ...quizForm, questions });
  };

  const removeQuestion = (idx) => {
    const questions = quizForm.questions.filter((_, i) => i !== idx);
    setQuizForm({ ...quizForm, questions });
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Faculty Dashboard</h2>
        <p className="small">Create and manage courses, quizzes, and materials.</p>

        <div className="tabs">
          <button className={activeTab === 'courses' ? 'tab-active' : 'tab'} onClick={() => setActiveTab('courses')}>
            My Courses ({courses.length})
          </button>
          <button className={activeTab === 'quizzes' ? 'tab-active' : 'tab'} onClick={() => setActiveTab('quizzes')}>
            Manage Quizzes ({quizzes.length})
          </button>
          <button className={activeTab === 'materials' ? 'tab-active' : 'tab'} onClick={() => setActiveTab('materials')}>
            Upload Materials ({materials.length})
          </button>
        </div>

        {err && <div className="error">{err}</div>}

        {activeTab === 'courses' && (
          <div>
            <button className="btn" onClick={() => setShowCourseForm(!showCourseForm)}>
              {showCourseForm ? 'Cancel' : '+ Create New Course'}
            </button>
            {showCourseForm && (
              <form onSubmit={handleCreateCourse} className="form-card">
                <h3>Create Course</h3>
                <div>
                  <label>Course Title *</label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label>Description</label>
                  <textarea
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                    rows="3"
                  />
                </div>
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Course'}
                </button>
              </form>
            )}
            <div className="courses-grid">
              {courses.map(course => (
                <div key={course._id} className="course-card">
                  <h3>{course.title}</h3>
                  <p className="small">{course.description || 'No description'}</p>
                  <p className="small">Created: {new Date(course.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div>
            <button className="btn" onClick={() => setShowQuizForm(!showQuizForm)}>
              {showQuizForm ? 'Cancel' : '+ Create New Quiz'}
            </button>
            {showQuizForm && (
              <form onSubmit={handleCreateQuiz} className="form-card">
                <h3>Create Quiz</h3>
                <div>
                  <label>Quiz Title *</label>
                  <input
                    type="text"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label>Course *</label>
                  <select
                    value={quizForm.course}
                    onChange={(e) => setQuizForm({...quizForm, course: e.target.value})}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Questions</label>
                  {quizForm.questions.map((q, qIdx) => (
                    <div key={qIdx} className="question-card">
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <strong>Question {qIdx + 1}</strong>
                        {quizForm.questions.length > 1 && (
                          <button type="button" className="btn btn-danger btn-small" onClick={() => removeQuestion(qIdx)}>
                            Remove
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Question text"
                        value={q.question}
                        onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
                        required
                      />
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="option-row">
                          <input
                            type="radio"
                            name={`correct-${qIdx}`}
                            checked={q.correctIndex === optIdx}
                            onChange={() => updateQuestion(qIdx, 'correctIndex', optIdx)}
                          />
                          <input
                            type="text"
                            placeholder={`Option ${optIdx + 1}`}
                            value={opt}
                            onChange={(e) => updateQuestion(qIdx, 'option', [optIdx, e.target.value])}
                            required
                          />
                        </div>
                      ))}
                      <div>
                        <label>Points: </label>
                        <input
                          type="number"
                          value={q.points}
                          onChange={(e) => updateQuestion(qIdx, 'points', parseInt(e.target.value) || 10)}
                          min="1"
                          style={{width: '80px'}}
                        />
                      </div>
                    </div>
                  ))}
                  <button type="button" className="btn btn-secondary" onClick={addQuestion}>
                    + Add Question
                  </button>
                </div>
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Quiz'}
                </button>
              </form>
            )}
            <div className="quizzes-list">
              {quizzes.map(quiz => (
                <div key={quiz._id} className="quiz-card">
                  <div>
                    <strong>{quiz.title}</strong>
                    <div className="small">Course: {quiz.course?.title || 'General'}</div>
                    <div className="small">Questions: {quiz.questions?.length || 0}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div>
            <button className="btn" onClick={() => setShowMaterialForm(!showMaterialForm)}>
              {showMaterialForm ? 'Cancel' : '+ Upload Material'}
            </button>
            {showMaterialForm && (
              <form onSubmit={handleCreateMaterial} className="form-card">
                <h3>Upload Material</h3>
                <div>
                  <label>Title *</label>
                  <input
                    type="text"
                    value={materialForm.title}
                    onChange={(e) => setMaterialForm({...materialForm, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label>Description</label>
                  <textarea
                    value={materialForm.description}
                    onChange={(e) => setMaterialForm({...materialForm, description: e.target.value})}
                    rows="3"
                  />
                </div>
                <div>
                  <label>Course *</label>
                  <select
                    value={materialForm.course}
                    onChange={(e) => setMaterialForm({...materialForm, course: e.target.value})}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(c => (
                      <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>File URL</label>
                  <input
                    type="url"
                    value={materialForm.fileUrl}
                    onChange={(e) => setMaterialForm({...materialForm, fileUrl: e.target.value})}
                    placeholder="https://example.com/file.pdf"
                  />
                </div>
                <div>
                  <label>File Type</label>
                  <select
                    value={materialForm.fileType}
                    onChange={(e) => setMaterialForm({...materialForm, fileType: e.target.value})}
                  >
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                    <option value="link">Link</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? 'Uploading...' : 'Upload Material'}
                </button>
              </form>
            )}
            <div className="materials-grid">
              {materials.map(material => (
                <div key={material._id} className="material-card">
                  <h4>{material.title}</h4>
                  <p className="small">{material.description || 'No description'}</p>
                  <p className="small">Course: {material.course?.title || 'Unknown'}</p>
                  <p className="small">Type: {material.fileType}</p>
                  {material.fileUrl && (
                    <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-link">
                      View Material
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
