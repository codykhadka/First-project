import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    // Load mock users data
    const mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
    setUsers(mockUsers.map(u => ({ ...u, password: undefined })));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📚 Dashboard</h1>
        </div>
        <div className="header-right">
          {user && (
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
          )}
          <button 
            className="logout-btn" 
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="welcome-section">
          <h2>Welcome, {user?.name}! 👋</h2>
          <p>You're successfully logged in. Manage your profile and view system statistics below.</p>
        </section>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <h3>Total Users</h3>
            <p className="stat-value">{users.length}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <h3>Member Since</h3>
            <p className="stat-value">{new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <h3>Account Status</h3>
            <p className="stat-value" style={{ color: '#10b981' }}>Active</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔐</div>
            <h3>Security</h3>
            <p className="stat-value" style={{ color: '#3b82f6' }}>Verified</p>
          </div>
        </div>

        <section className="users-section">
          <div className="section-header">
            <h3>All Users</h3>
            <button 
              className="toggle-btn"
              onClick={() => setShowStats(!showStats)}
            >
              {showStats ? '▼ Hide' : '▶ Show'}
            </button>
          </div>
          
          {showStats && (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
