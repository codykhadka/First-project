import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CryptoJS from 'crypto-js';
import '../../css/pages/Home.css';

const BOOKS = [
  {
    id: 1,
    title: 'The Silent Library',
    author: 'Aria Mendel',
    price: 18.0,
    category: 'Fiction',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    description: 'A haunting tale of a librarian who discovers that the books in her care whisper secrets from alternate lives.',
  },
  {
    id: 2,
    title: 'Atoms of Thought',
    author: 'Dr. Niko Park',
    price: 22.5,
    category: 'Science',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    description: 'An accessible journey through quantum mechanics and how the smallest particles shape human consciousness.',
  },
  {
    id: 3,
    title: 'Roads of Provence',
    author: 'Camille Roux',
    price: 26.0,
    category: 'Travel',
    cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    description: 'Wander through lavender fields and ancient villages with this beautifully illustrated travel memoir.',
  },
  {
    id: 4,
    title: 'Whispers in Wind',
    author: 'Maya Okafor',
    price: 15.5,
    category: 'Poetry',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    description: 'A lyrical collection exploring migration, memory, and the music of forgotten languages.',
  },
  {
    id: 5,
    title: "Founder's Map",
    author: 'Leo Hart',
    price: 29.0,
    category: 'Business',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
    description: 'The definitive playbook for first-time entrepreneurs navigating the treacherous waters of startup life.',
  },
  {
    id: 6,
    title: 'The Last Orbit',
    author: 'Ren Takeda',
    price: 19.9,
    category: 'Fiction',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    description: 'A crew aboard a failing space station must decide who stays and who takes the last escape pod.',
  },
  {
    id: 7,
    title: 'Quiet Kitchens',
    author: 'Sofia Bell',
    price: 24.0,
    category: 'Cooking',
    cover: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=400',
    description: 'Meditative recipes from monastery kitchens around the world, where food becomes prayer.',
  },
  {
    id: 8,
    title: 'Mind in Motion',
    author: 'Iris Cole',
    price: 17.0,
    category: 'Science',
    cover: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
    description: 'How walking, running, and dancing rewire the brain — the neuroscience of physical movement.',
  },
];

const CATEGORIES = ['All', 'Fiction', 'Science', 'Travel', 'Poetry', 'Business', 'Cooking'];

const CATEGORY_ICONS = {
  All: '⊞',
  Fiction: '📖',
  Science: '🔬',
  Travel: '✈️',
  Poetry: '🪶',
  Business: '💼',
  Cooking: '👨‍🍳',
};

const ALLOWED_PAYMENT_FIELDS = new Set([
  'cardNumber', 'expiry', 'cvc', 'cardName',
  'username', 'password', 'khaltiPhone', 'khaltiPin', 'khaltiOtp',
  'address', 'phone',
]);

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [khaltiStep, setKhaltiStep] = useState(1);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardName: '',
    username: '',
    password: '',
    khaltiPhone: '',
    khaltiPin: '',
    khaltiOtp: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    // Check for eSewa sandbox redirect status
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    if (status === 'success') {
      setPaymentMethod('eSewa');
      setPaymentSuccess(true);
      setPaymentOpen(true);
      setCart([]);
      window.history.replaceState({}, document.title, '/');
    } else if (status === 'failure') {
      alert('eSewa transaction was cancelled or failed.');
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const handlePaymentDetailChange = (e) => {
    const { name, value } = e.target;
    if (!ALLOWED_PAYMENT_FIELDS.has(name)) return;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const filtered = useMemo(
    () =>
      BOOKS.filter(
        (b) =>
          (category === 'All' || b.category === category) &&
          (b.title.toLowerCase().includes(query.toLowerCase()) ||
            b.author.toLowerCase().includes(query.toLowerCase()))
      ),
    [category, query]
  );

  const total = cart.reduce((s, b) => s + b.price, 0);

  const addToCart = (book) => {
    setCart((c) => [...c, book]);
  };

  const removeFromCart = (index) => {
    setCart((c) => c.filter((_, i) => i !== index));
  };

  const openPayment = (method) => {
    setPaymentMethod(method);
    setPaymentSuccess(false);
    setPaymentLoading(false);
    setKhaltiStep(1);
    setPaymentDetails({
      cardNumber: '',
      expiry: '',
      cvc: '',
      cardName: '',
      username: '',
      password: '',
      khaltiPhone: '',
      khaltiPin: '',
      khaltiOtp: '',
      address: '',
      phone: '',
    });
    setPaymentOpen(true);
  };

  const handleEsewaPayment = () => {
    const amountInNpr = Math.round(total * 133);
    const merchant_code = 'EPAYTEST';
    const secret = '8gBm/:&EnhH.1/q';
    const transaction_uuid = `book-${Date.now()}`;
    const total_amount = amountInNpr;
    const tax_amount = 0;
    const product_service_charge = 0;
    const product_delivery_charge = 0;
    const success_url = window.location.origin + '/?status=success';
    const failure_url = window.location.origin + '/?status=failure';

    // Generate HMAC SHA256 signature
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${merchant_code}`;
    const hash = CryptoJS.HmacSHA256(message, secret);
    const signature = CryptoJS.enc.Base64.stringify(hash);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

    const fields = {
      amount: total_amount,
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

  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    if (paymentMethod === 'eSewa' || paymentMethod === 'Esewa') {
      setPaymentLoading(true);
      setTimeout(() => {
        handleEsewaPayment();
      }, 800);
      return;
    }

    if (paymentMethod === 'Khalti') {
      if (khaltiStep === 1) {
        if (!paymentDetails.khaltiPhone || paymentDetails.khaltiPhone.length !== 10) {
          alert('Please enter a valid 10-digit Khalti Mobile Number');
          return;
        }
        if (!paymentDetails.khaltiPin) {
          alert('Please enter your Khalti MPIN');
          return;
        }
        setPaymentLoading(true);
        setTimeout(() => {
          setPaymentLoading(false);
          setKhaltiStep(2);
        }, 1200);
      } else {
        if (!paymentDetails.khaltiOtp) {
          alert('Please enter the OTP sent to your mobile phone (simulate with 123456)');
          return;
        }
        setPaymentLoading(true);
        setTimeout(() => {
          setPaymentLoading(false);
          setPaymentSuccess(true);
          setCart([]);
        }, 1500);
      }
      return;
    }

    // Validation for Visa/Mastercard
    if (paymentMethod === 'Visa' || paymentMethod === 'Mastercard') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvc || !paymentDetails.cardName) {
        alert('Please fill in all card details');
        return;
      }
    } else if (paymentMethod === 'PayPal') {
      if (!paymentDetails.username || !paymentDetails.password) {
        alert('Please enter your PayPal credentials');
        return;
      }


      setPaymentLoading(true);
      setTimeout(() => {
        setPaymentLoading(false);
        setPaymentSuccess(true);
        setCart([]);
      }, 2000);
    }
  };

  return (
      <div className="inkwell-page">
        {/* ─── Header ─── */}
        <header className="ink-header">
          <div className="ink-header-inner">
            <h1 className="ink-logo">{t('appName')}</h1>
            <div className="ink-search-wrapper">
              <svg className="ink-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search books or authors…"
                className="ink-search"
              />
            </div>
            <div className="ink-header-actions">
              <button className="ink-btn-icon" onClick={() => navigate('/login')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <span>{t('login')}</span>
              </button>
              <button className="ink-btn-icon" onClick={() => setCartOpen(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                <span>{t('cart')}</span>
                {cart.length > 0 && <span className="ink-cart-badge">{cart.length}</span>}
              </button>
            </div>
          </div>
        </header>

        {/* ─── Hero ─── */}
        <section className="ink-hero">
          <h2>{t('heroTitle')}</h2>
          <p>{t('heroSubtitle')}</p>
        </section>

        {/* ─── Category pills ─── */}
        <section className="ink-categories">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`ink-pill ${category === c ? 'active' : ''}`}
            >
              <span className="ink-pill-icon">{CATEGORY_ICONS[c] ?? ''}</span>
              {c}
            </button>
          ))}
        </section>

        {/* ─── Book Grid ─── */}
        <section className="ink-grid">
          {filtered.map((b) => (
            <article
              key={b.id}
              className="ink-card"
              onClick={() => setSelectedBook(b)}
            >
              <div className="ink-card-img-wrapper">
                <img src={b.cover} alt={b.title} className="ink-card-img" />
              </div>
              <div className="ink-card-body">
                <h3 className="ink-card-title">{b.title}</h3>
                <p className="ink-card-author">{b.author}</p>
                <div className="ink-card-footer">
                  <span className="ink-card-price">${b.price.toFixed(2)}</span>
                  <button
                    className="ink-btn-add"
                    onClick={(e) => { e.stopPropagation(); addToCart(b); }}
                  >
                    {t('add')}
                  </button>
                </div>
                <div className="ink-card-payments">
                  {['Visa', 'Mastercard', 'Esewa', 'Khalti', 'PayPal'].map((m) => (
                    <button
                      key={m}
                      className="ink-pay-chip"
                      onClick={(e) => { e.stopPropagation(); addToCart(b); openPayment(m); }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ink-pay-chip-icon"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <p className="ink-empty">{t('noBooksFound')}</p>
          )}
        </section>

        {/* ─── Footer ─── */}
        <footer className="ink-footer">
          <span>© 2026 Inkwell Bookstore</span>

        </footer>

        {/* ─── Book Detail Modal ─── */}
        {selectedBook && (
          <div className="ink-overlay" onClick={() => setSelectedBook(null)}>
            <div className="ink-modal" onClick={(e) => e.stopPropagation()}>
              <button className="ink-modal-close" onClick={() => setSelectedBook(null)}>✕</button>
              <h3 className="ink-modal-title">{selectedBook.title}</h3>
              <p className="ink-modal-author">{selectedBook.author}</p>
              <img src={selectedBook.cover} alt={selectedBook.title} className="ink-modal-img" />
              <p className="ink-modal-desc">{selectedBook.description}</p>
              <div className="ink-modal-meta">
                <span className="ink-modal-price">${selectedBook.price.toFixed(2)}</span>
                <span className="ink-modal-cat">{selectedBook.category}</span>
              </div>
              <div className="ink-modal-payments">
                {['Visa', 'Mastercard', 'Esewa', 'Khalti', 'PayPal'].map((m) => (
                  <button key={m} className="ink-pay-chip" onClick={() => { addToCart(selectedBook); setSelectedBook(null); openPayment(m); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ink-pay-chip-icon"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                    {m}
                  </button>
                ))}
              </div>
              <button className="ink-btn-full" onClick={() => { addToCart(selectedBook); setSelectedBook(null); }}>{t('addToCart')}</button>
            </div>
          </div>
        )}

        {/* ─── Cart Drawer ─── */}
        {cartOpen && (
          <div className="ink-overlay" onClick={() => setCartOpen(false)}>
            <div className="ink-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="ink-drawer-header">
                <h3>Your Cart</h3>
                <button className="ink-modal-close" onClick={() => setCartOpen(false)}>✕</button>
              </div>
              <p className="ink-drawer-subtitle">
                {cart.length === 0 ? 'Your cart is empty.' : `${cart.length} item(s) · $${total.toFixed(2)}`}
              </p>
              <div className="ink-drawer-items">
                {cart.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="ink-drawer-item">
                    <img src={item.cover} alt={item.title} className="ink-drawer-item-img" />
                    <div className="ink-drawer-item-info">
                      <p className="ink-drawer-item-title">{item.title}</p>
                      <p className="ink-drawer-item-price">${item.price.toFixed(2)}</p>
                    </div>
                    <button className="ink-drawer-item-remove" onClick={() => removeFromCart(idx)}>✕</button>
                  </div>
                ))}
              </div>
              {cart.length > 0 && (
                <div style={{ marginTop: 'auto', borderTop: '1.5px solid #e8e4de', paddingTop: '16px' }}>
                  <div className="ink-drawer-total" style={{ borderTop: 'none', paddingTop: 0, marginBottom: '16px' }}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '8px' }}>
                    {['Visa', 'Mastercard'].map(m => (
                      <button key={m} className="ink-pay-chip" style={{ justifyContent: 'center' }} onClick={() => { setCartOpen(false); openPayment(m); }}>
                        {m}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '8px' }}>
                    {['Esewa', 'Khalti'].map(m => (
                      <button key={m} className="ink-pay-chip" style={{ justifyContent: 'center' }} onClick={() => { setCartOpen(false); openPayment(m); }}>
                        {m}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginBottom: '12px' }}>
                    {['PayPal'].map(m => (
                      <button key={m} className="ink-pay-chip" style={{ justifyContent: 'center' }} onClick={() => { setCartOpen(false); openPayment(m); }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}


        {/* ─── Payment Dialog ─── */}
        {paymentOpen && (
          <div className="ink-overlay" onClick={() => !paymentLoading && setPaymentOpen(false)}>
            <div className="ink-modal ink-modal-sm" onClick={(e) => e.stopPropagation()}>
              {!paymentLoading && <button className="ink-modal-close" onClick={() => setPaymentOpen(false)}>✕</button>}

              {paymentLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #e0dcd6',
                    borderTop: '3px solid #c0392b',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '16px'
                  }}></div>
                  <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                  <h3 className="ink-modal-title" style={{ fontSize: '18px', textAlign: 'center', paddingRight: 0 }}>
                    {paymentMethod === 'Esewa' || paymentMethod === 'eSewa' ? 'Redirecting to eSewa Sandbox...' : 'Processing Payment...'}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#a09a92', marginTop: '6px', textAlign: 'center' }}>
                    Please do not close this window or refresh the page.
                  </p>
                </div>
              ) : paymentSuccess ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontSize: '54px', marginBottom: '16px' }}>🎉</div>
                  <h3 className="ink-modal-title" style={{ textAlign: 'center', paddingRight: 0, marginBottom: '8px' }}>
                    Payment Successful!
                  </h3>
                  <p style={{ fontSize: '14px', color: '#5a554e', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                    Your purchase was completed using <strong>{paymentMethod}</strong>. Your order is now being processed and your books will be shipped soon.
                  </p>
                  <button className="ink-btn-full" onClick={() => setPaymentOpen(false)}>
                    Go Back to Store
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePaymentSubmit} className="ink-auth-form">
                  <h3 className="ink-modal-title">
                    Pay with {paymentMethod}
                  </h3>
                  <p className="ink-modal-author" style={{ marginBottom: '20px' }}>
                    {(paymentMethod === 'Esewa' || paymentMethod === 'eSewa' || paymentMethod === 'Khalti') ? (
                      <>Total due: <strong>Rs. {Math.round(total * 133)} NPR</strong> (approx. ${total.toFixed(2)} USD)</>
                    ) : (
                      <>Total due: <strong>${total.toFixed(2)} USD</strong> · {cart.length} item(s)</>
                    )}
                  </p>

                  {(paymentMethod === 'Visa' || paymentMethod === 'Mastercard') && (
                    <>
                      <input
                        name="cardName"
                        required
                        value={paymentDetails.cardName}
                        onChange={handlePaymentDetailChange}
                        placeholder="Cardholder Name"
                        className="ink-input"
                      />
                      <input
                        name="cardNumber"
                        required
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentDetailChange}
                        placeholder="Card Number (e.g. 4000 1234 5678 9010)"
                        className="ink-input"
                      />
                      <div className="ink-input-row">
                        <input
                          name="expiry"
                          required
                          value={paymentDetails.expiry}
                          onChange={handlePaymentDetailChange}
                          placeholder="MM / YY"
                          className="ink-input"
                        />
                        <input
                          name="cvc"
                          required
                          value={paymentDetails.cvc}
                          onChange={handlePaymentDetailChange}
                          placeholder="CVC"
                          className="ink-input"
                        />
                      </div>
                    </>
                  )}

                  {(paymentMethod === 'Esewa' || paymentMethod === 'eSewa') && (
                    <div style={{ background: '#faf8f5', padding: '16px', borderRadius: '12px', border: '1px dashed #e0dcd6', textAlign: 'center', marginBottom: '8px' }}>
                      <div style={{ fontSize: '28px', marginBottom: '8px' }}>💳</div>
                      <p style={{ fontSize: '13px', color: '#5a554e', lineHeight: '1.5', margin: 0 }}>
                        You will be securely redirected to the official <strong>eSewa Sandbox Payment Gateway</strong> to complete your test transaction.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'Khalti' && (
                    khaltiStep === 1 ? (
                      <>
                        <input
                          name="khaltiPhone"
                          required
                          type="tel"
                          value={paymentDetails.khaltiPhone}
                          onChange={handlePaymentDetailChange}
                          placeholder="Khalti Mobile Number (10 digits)"
                          className="ink-input"
                        />
                        <input
                          name="khaltiPin"
                          required
                          type="password"
                          value={paymentDetails.khaltiPin}
                          onChange={handlePaymentDetailChange}
                          placeholder="Khalti MPIN (4 digits)"
                          className="ink-input"
                        />
                      </>
                    ) : (
                      <>
                        <div style={{ background: 'rgba(142, 68, 173, 0.05)', padding: '12px', borderRadius: '8px', border: '1.5px solid rgba(142, 68, 173, 0.15)', fontSize: '13px', color: '#8e44ad', marginBottom: '8px', textAlign: 'center' }}>
                          OTP sent to {paymentDetails.khaltiPhone} (Simulated)
                        </div>
                        <input
                          name="khaltiOtp"
                          required
                          value={paymentDetails.khaltiOtp}
                          onChange={handlePaymentDetailChange}
                          placeholder="Enter 6-Digit OTP"
                          className="ink-input"
                        />
                      </>
                    )
                  )}

                  {paymentMethod === 'PayPal' && (
                    <>
                      <input
                        name="username"
                        required
                        type="email"
                        value={paymentDetails.username}
                        onChange={handlePaymentDetailChange}
                        placeholder="PayPal Email Address"
                        className="ink-input"
                      />
                      <input
                        name="password"
                        required
                        type="password"
                        value={paymentDetails.password}
                        onChange={handlePaymentDetailChange}
                        placeholder="PayPal Password"
                        className="ink-input"
                      />
                    </>
                  )}



                  <button type="submit" className="ink-btn-full">
                    {paymentMethod === 'Esewa' || paymentMethod === 'eSewa' ? (
                      `Proceed to eSewa Sandbox`
                    ) : paymentMethod === 'Khalti' ? (
                      khaltiStep === 1 ? 'Generate OTP' : `Verify & Pay Rs. ${Math.round(total * 133)}`
                    ) : (
                      `Pay $${total.toFixed(2)}`
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
};

export default Home;
