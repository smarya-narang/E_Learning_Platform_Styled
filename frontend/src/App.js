import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegisterPage from './components/auth/RegisterPage';
import LoginPage from './components/auth/LoginPage';
import StudentDashboard from './components/dashboard/StudentDashboard';
import FacultyDashboard from './components/dashboard/FacultyDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import QuizPage from './components/dashboard/QuizPage';
import Leaderboard from './components/dashboard/Leaderboard';
import FeedbackPage from './components/dashboard/FeedbackPage';

function App(){
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/faculty" element={<FacultyDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/feedback/:attemptId" element={<FeedbackPage />} />
          <Route path="/" element={<StudentDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
