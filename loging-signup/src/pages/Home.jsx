import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

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

const Home = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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
    setPaymentOpen(true);
  };



  return (
    <div className="inkwell-page">
      {/* ─── Header ─── */}
      <header className="ink-header">
        <div className="ink-header-inner">
          <h1 className="ink-logo">Inkwell</h1>
          <div className="ink-search-wrapper">
            <svg className="ink-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search books or authors…"
              className="ink-search"
            />
          </div>
          <div className="ink-header-actions">
            <button className="ink-btn-icon" onClick={() => navigate('/login')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Login</span>
            </button>
            <button className="ink-btn-icon" onClick={() => setCartOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span>Cart</span>
              {cart.length > 0 && <span className="ink-cart-badge">{cart.length}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="ink-hero">
        <h2>Stories worth your shelf.</h2>
        <p>A small, curated bookstore. Hand-picked titles across fiction, science, travel, and more.</p>
      </section>

      {/* ─── Category pills ─── */}
      <section className="ink-categories">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`ink-pill ${category === c ? 'active' : ''}`}
          >
            <span className="ink-pill-icon">{CATEGORY_ICONS[c]}</span>
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
                  Add
                </button>
              </div>
              <div className="ink-card-payments">
                {['Visa', 'MC', 'PayPal'].map((m) => (
                  <button
                    key={m}
                    className="ink-pay-chip"
                    onClick={(e) => { e.stopPropagation(); addToCart(b); openPayment(m); }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ink-pay-chip-icon"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="ink-empty">No books match your search.</p>
        )}
      </section>

      {/* ─── Footer ─── */}
      <footer className="ink-footer">
        <span>© 2026 Inkwell Bookstore</span>
        <div className="ink-footer-payments">
          {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((m) => (
            <button key={m} className="ink-footer-pay" onClick={() => openPayment(m)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ink-footer-pay-icon"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              {m}
            </button>
          ))}
        </div>
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
              {['Visa', 'MC', 'Amex', 'PayPal'].map((m) => (
                <button key={m} className="ink-pay-chip" onClick={() => { addToCart(selectedBook); setSelectedBook(null); openPayment(m); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ink-pay-chip-icon"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  {m}
                </button>
              ))}
            </div>
            <button className="ink-btn-full" onClick={() => { addToCart(selectedBook); setSelectedBook(null); }}>Add to Cart</button>
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
              <div className="ink-drawer-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ─── Payment Dialog ─── */}
      {paymentOpen && (
        <div className="ink-overlay" onClick={() => setPaymentOpen(false)}>
          <div className="ink-modal ink-modal-sm" onClick={(e) => e.stopPropagation()}>
            <button className="ink-modal-close" onClick={() => setPaymentOpen(false)}>✕</button>
            <h3 className="ink-modal-title">
              {paymentSuccess ? 'Payment Successful' : `Pay with ${paymentMethod}`}
            </h3>
            <p className="ink-modal-author">
              {paymentSuccess
                ? `Your order has been placed using ${paymentMethod}.`
                : `Total due: $${total.toFixed(2)} · ${cart.length} item(s)`}
            </p>
            {!paymentSuccess ? (
              <div className="ink-auth-form">
                <input placeholder="Card number" className="ink-input" />
                <div className="ink-input-row">
                  <input placeholder="MM / YY" className="ink-input" />
                  <input placeholder="CVC" className="ink-input" />
                </div>
                <button className="ink-btn-full" onClick={() => { setPaymentSuccess(true); setCart([]); }}>
                  Pay ${total.toFixed(2)}
                </button>
              </div>
            ) : (
              <button className="ink-btn-full" onClick={() => setPaymentOpen(false)} style={{ marginTop: '16px' }}>
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
