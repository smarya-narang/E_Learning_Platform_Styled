import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const LoginPage = () => {
  const [form, setForm] = useState({ email:'', password:'' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onChange = e => setForm({...form, [e.target.name]: e.target.value});
  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if(res.data.user.role === 'Admin') navigate('/admin');
      else if(res.data.user.role === 'Faculty') navigate('/faculty');
      else navigate('/student');
      window.location.reload();
    } catch (error) {
      setErr(error.response?.data?.msg || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <div className="card" style={{maxWidth:480, margin:'0 auto'}}>
        <h2>Login</h2>
        {err && <div className="error">{err}</div>}
        <form onSubmit={onSubmit}>
          <div>
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={onChange} required/>
          </div>
          <div>
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={onChange} required/>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <small className="small">Login to continue</small>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
