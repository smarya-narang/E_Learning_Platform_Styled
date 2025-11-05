import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const Leaderboard = () => {
  const [list, setList] = useState([]);
  const [err, setErr] = useState('');
  useEffect(()=>{
    const fetch = async()=>{
      try{
        const res = await api.get('/leaderboard/top/10');
        setList(res.data);
      }catch(e){ setErr(e.message || 'Failed to load leaderboard'); }
    };
    fetch();
  },[]);
  const getRankIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="container">
      <div className="card">
        <h2>🏆 Leaderboard (Top 10)</h2>
        <p className="small">Top performers based on quiz points earned.</p>
        {err && <div className="error">{err}</div>}
        {list.length === 0 ? (
          <p className="small">No rankings available yet. Be the first to earn points!</p>
        ) : (
          <ol className="leaderboard-list">
            {list.map((u, index) => (
              <li key={u._id} className={index < 3 ? 'leaderboard-top' : ''}>
                <div className="leaderboard-rank">
                  <span className="rank-icon">{getRankIcon(index)}</span>
                  <div className="leaderboard-info">
                    <strong>{u.name}</strong>
                    {u.badges?.length > 0 && (
                      <div className="badges-container">
                        {u.badges.map((badge, idx) => (
                          <span key={idx} className="badge badge-small">{badge}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="leaderboard-score">
                  <span className="score-value">{u.points || 0}</span>
                  <span className="score-label">pts</span>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};
export default Leaderboard;
