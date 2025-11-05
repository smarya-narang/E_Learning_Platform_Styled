import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to={user ? (user.role === 'Admin' ? '/admin' : user.role === 'Faculty' ? '/faculty' : '/student') : '/'} className="brand">E-Learn 🎮</Link>
        <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
        {user && (
          <>
            {user.role === 'Admin' && <Link to="/admin" className="nav-link">Admin</Link>}
            {user.role === 'Faculty' && <Link to="/faculty" className="nav-link">Faculty</Link>}
            {user.role === 'Student' && <Link to="/student" className="nav-link">Student</Link>}
          </>
        )}
      </div>
      <div className="nav-right">
        {!user && <><Link to="/register" className="btn-link">Register</Link><Link to="/login" className="btn-link">Login</Link></>}
        {user && (
          <div className="user-info">
            <span className="user-name">Welcome, <strong>{user.name}</strong></span>
            <span className={`user-role role-${user.role.toLowerCase()}`}>{user.role}</span>
            {user.role === 'Student' && (
              <Link to="/leaderboard" className="btn-link">Leaderboard</Link>
            )}
            <button className="btn btn-small" onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
