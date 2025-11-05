import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RegisterPage = () => {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'Student' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onChange = e => setForm({...form, [e.target.name]: e.target.value});
  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if(res.data.user.role === 'Admin') navigate('/admin');
      else if(res.data.user.role === 'Faculty') navigate('/faculty');
      else navigate('/student');
      window.location.reload();
    } catch (error) {
      // handle friendly error messages from api interceptor
      setErr(error.response?.data?.msg || error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <div className="card" style={{maxWidth:720, margin:'0 auto'}}>
        <h2>Register</h2>
        <p className="small">Create an account to participate in quizzes and earn points.</p>
        {err && <div className="error">{err}</div>}
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div>
              <label>Name</label>
              <input name="name" value={form.name} onChange={onChange} required />
            </div>
            <div>
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={onChange} required />
            </div>
          </div>
          <div className="form-grid">
            <div>
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={onChange} required />
            </div>
            <div>
              <label>Role</label>
              <select name="role" value={form.role} onChange={onChange}>
                <option>Student</option>
                <option>Faculty</option>
                <option>Admin</option>
              </select>
            </div>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <small className="small">By registering you accept the terms.</small>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
