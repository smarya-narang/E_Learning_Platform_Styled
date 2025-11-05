import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', points: 0, badges: [] });

  useEffect(() => {
    fetchUsers();
    fetchCourses();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (e) {
      setErr(e.response?.data?.msg || e.message || 'Failed to load users');
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get('/admin/courses');
      setCourses(res.data);
    } catch (e) {
      setErr(e.response?.data?.msg || e.message || 'Failed to load courses');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (e) {
      setErr(e.response?.data?.msg || e.message || 'Failed to delete user');
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/admin/courses/${id}`);
      fetchCourses();
    } catch (e) {
      setErr(e.response?.data?.msg || e.message || 'Failed to delete course');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      points: user.points || 0,
      badges: user.badges || []
    });
  };

  const handleSaveUser = async (id) => {
    setLoading(true);
    try {
      await api.put(`/admin/users/${id}`, editForm);
      setEditingUser(null);
      fetchUsers();
    } catch (e) {
      setErr(e.response?.data?.msg || e.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Admin Dashboard</h2>
        <p className="small">Manage users and courses across the platform.</p>
        
        <div className="tabs">
          <button 
            className={activeTab === 'users' ? 'tab-active' : 'tab'} 
            onClick={() => setActiveTab('users')}
          >
            Manage Users ({users.length})
          </button>
          <button 
            className={activeTab === 'courses' ? 'tab-active' : 'tab'} 
            onClick={() => setActiveTab('courses')}
          >
            Manage Courses ({courses.length})
          </button>
        </div>

        {err && <div className="error">{err}</div>}

        {activeTab === 'users' && (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Points</th>
                  <th>Badges</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    {editingUser === user._id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="admin-input"
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            className="admin-input"
                          />
                        </td>
                        <td>
                          <select
                            value={editForm.role}
                            onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                            className="admin-input"
                          >
                            <option>Student</option>
                            <option>Faculty</option>
                            <option>Admin</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={editForm.points}
                            onChange={(e) => setEditForm({...editForm, points: parseInt(e.target.value) || 0})}
                            className="admin-input"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editForm.badges.join(', ')}
                            onChange={(e) => setEditForm({...editForm, badges: e.target.value.split(',').map(b => b.trim()).filter(b => b)})}
                            className="admin-input"
                            placeholder="Comma separated"
                          />
                        </td>
                        <td>
                          <button className="btn btn-small" onClick={() => handleSaveUser(user._id)} disabled={loading}>
                            Save
                          </button>
                          <button className="btn btn-secondary btn-small" onClick={() => setEditingUser(null)}>
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td><span className={`badge badge-${user.role.toLowerCase()}`}>{user.role}</span></td>
                        <td>{user.points || 0}</td>
                        <td>{user.badges?.length ? user.badges.join(', ') : '—'}</td>
                        <td>
                          <button className="btn btn-small" onClick={() => handleEditUser(user)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-small" onClick={() => handleDeleteUser(user._id)}>
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="courses-grid">
            {courses.map(course => (
              <div key={course._id} className="course-card-admin">
                <h3>{course.title}</h3>
                <p className="small">{course.description || 'No description'}</p>
                <p className="small">Faculty: {course.faculty?.name || 'Unknown'}</p>
                <button className="btn btn-danger btn-small" onClick={() => handleDeleteCourse(course._id)}>
                  Delete Course
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

