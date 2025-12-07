import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { apiRequest } from './api';
import type {
  AuthResponse,
  ListResponse,
  MenuCategoryDto,
  MenuResponse,
  OrderSummary,
  OrdersResponse,
  Student,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';
const FALLBACK_API_BASE_URL =
  import.meta.env.VITE_FALLBACK_API_BASE_URL?.trim() ??
  'https://xandera-backend.onrender.com/v1';
const API_BASE_URLS = [API_BASE_URL, FALLBACK_API_BASE_URL].filter(
  (value, index, array) => value && array.indexOf(value) === index,
);
const DEMO_SCHOOL_CODE = import.meta.env.VITE_DEMO_SCHOOL_CODE ?? '';
const PORTAL_TAGLINE = import.meta.env.VITE_PORTAL_TAGLINE?.trim() ?? '';
const SCHOOL_NAME =
  import.meta.env.VITE_DEFAULT_SCHOOL_NAME?.trim() ||
  'Saraswathi Vidyalaya Secondary School';

interface CartLine {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
}

function App() {
  const [tokens, setTokens] = useState<AuthResponse | null>(() => {
    const raw = localStorage.getItem('xandera.parent.tokens');
    return raw ? (JSON.parse(raw) as AuthResponse) : null;
  });
  const [schoolCode] = useState(
    DEMO_SCHOOL_CODE ? DEMO_SCHOOL_CODE.toUpperCase() : '',
  );
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'enter' | 'verify'>('enter');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [serviceDate, setServiceDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [menu, setMenu] = useState<MenuCategoryDto[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const trimmedSchoolName = SCHOOL_NAME;
  const loginTitle = trimmedSchoolName || 'Parents Sign-In';

  const identifier = useMemo(() => {
    if (schoolCode.trim()) {
      return { school_code: schoolCode.trim().toUpperCase() };
    }
    return null;
  }, [schoolCode]);

  useEffect(() => {
    if (!tokens) return;
    void fetchStudents();
    void fetchOrders();
  }, [tokens]);

  useEffect(() => {
    if (tokens && !tokens.school_id) {
      setTokens(null);
      localStorage.removeItem('xandera.parent.tokens');
      setError('Session expired. Please sign in again.');
    }
  }, [tokens]);

  useEffect(() => {
    if (!tokens || !selectedStudentId) return;
    void fetchMenu();
  }, [tokens, selectedStudentId, serviceDate]);

  const authorizedFetch = async <T,>(path: string) => {
    if (API_BASE_URLS.length === 0) throw new Error('API base URL missing');
    if (!tokens) throw new Error('Not authenticated');
    return apiRequest<T>(API_BASE_URLS, path, {
      token: tokens.access_token,
    });
  };

  const handleSendOtp = async () => {
    setError('');
    setStatus('');
    if (!identifier || mobile.trim().length !== 10) {
      setError('Enter a 10-digit mobile number.');
      return;
    }
    if (API_BASE_URLS.length === 0) {
      setError('API base URL missing.');
      return;
    }
    try {
      setIsSubmitting(true);
      await apiRequest(API_BASE_URLS, '/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          mobile,
          country_code: '+91',
          user_type: 'parent',
          ...identifier,
        }),
      });
      setStatus('OTP sent. Use 000000 on demo environments.');
      setStep('verify');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    setStatus('');
    if (!identifier) {
      setError('Missing school configuration.');
      return;
    }
    if (!otp || otp.length !== 6) {
      setError('Enter 6-digit OTP.');
      return;
    }
    if (API_BASE_URLS.length === 0) {
      setError('API base URL missing.');
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await apiRequest<AuthResponse>(
        API_BASE_URLS,
        '/auth/verify-otp',
        {
          method: 'POST',
          body: JSON.stringify({
            mobile,
            otp,
            user_type: 'parent',
            ...identifier,
          }),
        },
      );
      setTokens(response);
      localStorage.setItem('xandera.parent.tokens', JSON.stringify(response));
      setStatus('Welcome back!');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setTokens(null);
    localStorage.removeItem('xandera.parent.tokens');
    setStudents([]);
    setMenu([]);
    setOrders([]);
    setCart([]);
    setSelectedStudentId('');
    setStatus('');
    setError('');
    setStep('enter');
  };

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const response = await authorizedFetch<ListResponse<Student[]>>(
        '/parent/students',
      );
      setStudents(response.data);
      if (response.data.length > 0) {
        setSelectedStudentId(response.data[0].student_id);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchMenu = async () => {
    const activeSchoolId = tokens?.school_id;
    if (!activeSchoolId) {
      setError('Missing school configuration. Contact your school admin.');
      return;
    }
    try {
      setLoadingMenu(true);
      const params = new URLSearchParams({
        service_date: serviceDate,
        school_id: activeSchoolId,
      });
      const response = await authorizedFetch<MenuResponse>(
        `/parent/menu?${params.toString()}`,
      );
      setMenu(response.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingMenu(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const month = new Date().toISOString().slice(0, 7);
      const response = await authorizedFetch<OrdersResponse>(
        `/parent/orders?month=${month}`,
      );
      setOrders(response.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingOrders(false);
    }
  };

  const addToCart = (line: CartLine) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menu_item_id === line.menu_item_id);
      if (existing) {
        return prev.map((item) =>
          item.menu_item_id === line.menu_item_id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, line];
    });
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.menu_item_id !== menuItemId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.menu_item_id === menuItemId ? { ...item, quantity } : item,
      ),
    );
  };

  const totalAmount = cart.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0,
  );

  const handlePlaceOrder = async () => {
    if (!selectedStudentId) {
      setError('Select a student first.');
      return;
    }
    if (cart.length === 0) {
      setError('Add items to cart before ordering.');
      return;
    }
    try {
      setError('');
      setStatus('Placing order…');
      const idempotency = crypto.randomUUID();
      await apiRequest(API_BASE_URLS, '/parent/orders', {
        method: 'POST',
        body: JSON.stringify({
          student_id: selectedStudentId,
          service_date: serviceDate,
          items: cart.map((line) => ({
            menu_item_id: line.menu_item_id,
            quantity: line.quantity,
          })),
        }),
        token: tokens?.access_token,
        headers: {
          'Idempotency-Key': idempotency,
        },
      });
      setCart([]);
      setStatus('Order placed! Check order history for updates.');
      await fetchOrders();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!tokens) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <h1>{loginTitle}</h1>
          <p className="muted">
            Enter your registered mobile number. Use OTP{' '}
            <strong>000000</strong> on demo environments.
          </p>
          <label>Mobile number</label>
          <input
            type="tel"
            value={mobile}
            maxLength={10}
            onChange={(event) => setMobile(event.target.value.replace(/[^0-9]/g, ''))}
            placeholder="9876543210"
          />
          {step === 'verify' && (
            <>
              <label>OTP</label>
              <input
                type="tel"
                value={otp}
                maxLength={6}
                onChange={(event) => setOtp(event.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
              />
            </>
          )}
          {error && <p className="error-text">{error}</p>}
          {status && <p className="success-text">{status}</p>}
          <button
            onClick={step === 'enter' ? handleSendOtp : handleVerifyOtp}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Please wait…'
              : step === 'enter'
              ? 'Send OTP'
              : 'Verify & Continue'}
          </button>
          {step === 'verify' && (
            <button className="link" onClick={() => setStep('enter')}>
              ← Change mobile number
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          {PORTAL_TAGLINE && <p className="eyebrow">{PORTAL_TAGLINE}</p>}
          <h1>{SCHOOL_NAME}</h1>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main className="page-content">
        <section className="panel">
          <h2>Your Children</h2>
          {loadingStudents && <p className="muted">Loading students…</p>}
          {students.length === 0 && !loadingStudents && (
            <p className="muted">
              No students linked to this account yet. Contact your school admin.
            </p>
          )}
          {students.length > 0 && (
            <select
              value={selectedStudentId}
              onChange={(event) => setSelectedStudentId(event.target.value)}
            >
              {students.map((student) => (
                <option key={student.student_id} value={student.student_id}>
                  {student.name} ({student.class ?? 'Class'} {student.section ?? ''})
                </option>
              ))}
            </select>
          )}
        </section>

        <section className="panel">
          <h2>Menu</h2>
          <div className="menu-toolbar">
            <label>Date</label>
            <input
              type="date"
              value={serviceDate}
              onChange={(event) => setServiceDate(event.target.value)}
            />
            <button onClick={fetchMenu}>Refresh menu</button>
          </div>
          {loadingMenu && <p className="muted">Loading menu…</p>}
          {!loadingMenu && menu.length === 0 && (
            <p className="muted">
              Menu not published yet. Please check with your school admin.
            </p>
          )}
          <div className="menu-grid">
            {menu.map((category) => (
              <div key={category.category_id} className="menu-card">
                <h3>
                  {category.name}{' '}
                  <span className="chip">{category.type}</span>
                </h3>
                <p className="muted">{category.description}</p>
                <ul>
                  {category.items.map((item) => (
                    <li key={item.item_id}>
                      <div>
                        <strong>{item.name}</strong>
                        {item.description && <p>{item.description}</p>}
                      </div>
                      <div className="menu-actions">
                        <span>₹{item.price.toFixed(2)}</span>
                        <button
                          onClick={() =>
                            addToCart({
                              menu_item_id: item.item_id,
                              name: item.name,
                              price: item.price,
                              quantity: 1,
                            })
                          }
                        >
                          Add
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Cart</h2>
          {cart.length === 0 && <p className="muted">No items yet.</p>}
          {cart.length > 0 && (
            <div className="cart-list">
              {cart.map((line) => (
                <div key={line.menu_item_id} className="cart-line">
                  <div>
                    <strong>{line.name}</strong>
                    <p className="muted">₹{line.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-qty">
                    <button onClick={() => updateQuantity(line.menu_item_id, line.quantity - 1)}>
                      −
                    </button>
                    <span>{line.quantity}</span>
                    <button onClick={() => updateQuantity(line.menu_item_id, line.quantity + 1)}>
                      +
                    </button>
                  </div>
                </div>
              ))}
              <div className="cart-total">
                <span>Total</span>
                <strong>₹{totalAmount.toFixed(2)}</strong>
              </div>
              <button className="primary" onClick={handlePlaceOrder}>
                Place order
              </button>
              <p className="muted small">
                After placing the order, you’ll receive confirmations via WhatsApp or email.
              </p>
            </div>
          )}
        </section>

        <section className="panel">
          <h2>Recent Orders</h2>
          {loadingOrders && <p className="muted">Loading orders…</p>}
          {!loadingOrders && orders.length === 0 && (
            <p className="muted">No orders yet.</p>
          )}
          <ul className="orders-list">
            {orders.map((order) => (
              <li key={order.order_id}>
                <div>
                  <strong>{order.service_date}</strong>
                  <p className="muted">
                    {order.items.length} items • ₹{order.total_amount.toFixed(2)}
                  </p>
                </div>
                <div className="order-status">
                  <span className={`chip ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <span className={`chip ${order.payment_status.toLowerCase()}`}>
                    {order.payment_status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {error && <div className="toast error">{error}</div>}
      {status && <div className="toast success">{status}</div>}
    </div>
  );
}

export default App;
