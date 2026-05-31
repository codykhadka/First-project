import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import CryptoJS from 'crypto-js';
import '../../css/pages/Dashboard.css';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [amount, setAmount] = useState('100');

  useEffect(() => {
    // Check for payment status in URL
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    if (status === 'success') {
      alert('Payment Successful!');
      window.history.replaceState({}, document.title, '/dashboard');
    } else if (status === 'failure') {
      alert('Payment Failed or Canceled!');
      window.history.replaceState({}, document.title, '/dashboard');
    }

    // Load mock users data
    const mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];
    setUsers(mockUsers.map(u => ({ ...u, password: undefined })));
  }, []);

  const handleEsewaPayment = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    // eSewa test credentials
    const merchant_code = 'EPAYTEST';
    const secret = '8gBm/:&EnhH.1/q';
    const transaction_uuid = `test-${Date.now()}`;
    const total_amount = amount;
    const tax_amount = 0;
    const product_service_charge = 0;
    const product_delivery_charge = 0;
    const success_url = window.location.origin + '/dashboard?status=success';
    const failure_url = window.location.origin + '/dashboard?status=failure';
    
    // Generate HMAC SHA256 signature
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${merchant_code}`;
    const hash = CryptoJS.HmacSHA256(message, secret);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    // Create a form dynamically and submit it
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

    const fields = {
      amount,
      tax_amount,
      total_amount,
      transaction_uuid,
      product_code: merchant_code,
      product_service_charge,
      product_delivery_charge,
      success_url,
      failure_url,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
      signature
    };

    Object.keys(fields).forEach(key => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handleKhaltiPayment = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    alert(`Khalti Checkout simulation for Rs. ${amount}.\n(Note: Real Khalti v2 requires backend initiation to prevent CORS errors).`);
  };

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

        <section className="payment-section">
          <h3>Make a Payment</h3>
          <div className="payment-form">
            <div className="payment-amount-input">
              <label htmlFor="amount">Amount (NPR)</label>
              <input 
                type="number" 
                id="amount"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="Enter amount"
                min="10"
              />
            </div>
            <div className="payment-buttons">
              <button className="payment-btn esewa-btn" onClick={handleEsewaPayment}>
                💳 Pay with eSewa
              </button>
              <button className="payment-btn khalti-btn" onClick={handleKhaltiPayment}>
                🟣 Pay with Khalti
              </button>
            </div>
          </div>
        </section>

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
