import { useMemo, useState } from 'react';
import './index.css';

const summaryCards = [
  { label: 'Orders Today', value: '152' },
  { label: 'Google Pay (₹)', value: '8,200' },
  { label: 'Cash (₹)', value: '3,100' },
  { label: 'Students Pending', value: '34' },
];

const topItems = [
  { name: 'Lemon Rice', count: 120 },
  { name: 'Veg Biriyani', count: 80 },
  { name: 'Plain Dosa', count: 40 },
];

const announcements = [
  {
    title: 'Special of the Day',
    body: 'Mini Idli with Sambar and chutney.',
  },
  {
    title: 'Cut-off Reminder',
    body: 'Parents must place orders before 09:00 AM.',
  },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const DEMO_SCHOOL_ID = import.meta.env.VITE_DEMO_SCHOOL_ID ?? '';

function App() {
  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem('xandera.authToken'),
  );
  const [schoolId, setSchoolId] = useState(DEMO_SCHOOL_ID);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'enter' | 'verify'>('enter');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headers = useMemo(
    () => ({
      'Content-Type': 'application/json',
    }),
    [],
  );

  const handleSendOtp = async () => {
    setError('');
    setStatus('');
    if (!schoolId || mobile.trim().length !== 10) {
      setError('Enter a 10-digit mobile number and school ID.');
      return;
    }
    if (!API_BASE_URL) {
      setError('API base URL is not configured.');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          mobile,
          country_code: '+91',
          school_id: schoolId,
          user_type: 'parent',
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Unable to send OTP.');
      }
      setStatus('OTP sent. Enter 000000 on demo environments.');
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
    if (!otp || otp.length !== 6) {
      setError('Enter the 6-digit OTP (000000 for demo).');
      return;
    }
    if (!API_BASE_URL) {
      setError('API base URL is not configured.');
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          mobile,
          otp,
          school_id: schoolId,
          user_type: 'parent',
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Could not verify OTP.');
      }
      const data = await res.json();
      const token = data?.access_token;
      if (!token) {
        throw new Error('Missing access token in response.');
      }
      localStorage.setItem('xandera.authToken', token);
      setAuthToken(token);
      setStatus('Logged in successfully.');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('xandera.authToken');
    setAuthToken(null);
    setMobile('');
    setOtp('');
    setStep('enter');
    setStatus('');
    setError('');
  };

  const renderLogin = () => (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-slate-900">Admin Sign-In</h1>
        <p className="mt-2 text-sm text-slate-500">
          Use the mobile number imported for your school. For demos, the OTP is{' '}
          <span className="font-semibold text-primary">000000</span>.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">School ID</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-primary focus:outline-none"
              type="text"
              value={schoolId}
              onChange={(event) => setSchoolId(event.target.value)}
              placeholder="e.g. 1e5b9d92-8b91-4c4f-a90f-6f1d6c8fd123"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Mobile</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-primary focus:outline-none"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={mobile}
              onChange={(event) => setMobile(event.target.value.replace(/[^0-9]/g, ''))}
              placeholder="9876543210"
            />
          </div>

          {step === 'verify' && (
            <div>
              <label className="text-sm font-medium text-slate-700">OTP</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 tracking-widest focus:border-primary focus:outline-none"
                type="tel"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/[^0-9]/g, ''))}
                placeholder="000000"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          {status && <p className="text-sm text-green-600">{status}</p>}

          <button
            type="button"
            onClick={step === 'enter' ? handleSendOtp : handleVerifyOtp}
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70"
          >
            {isSubmitting
              ? 'Please wait...'
              : step === 'enter'
              ? 'Send OTP'
              : 'Verify & Sign In'}
          </button>

          {step === 'verify' && (
            <button
              type="button"
              className="w-full text-sm font-medium text-primary"
              onClick={() => {
                setOtp('');
                setStep('enter');
                setStatus('');
              }}
            >
              ← Enter a different number
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              XAndera Admin Portal
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">Saraswathi Vidyalaya</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              Switch School
            </button>
            <button
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Top Items</h2>
              <button className="text-sm font-medium text-primary">Export summary</button>
            </div>
            <ul className="mt-4 space-y-3">
              {topItems.map((item) => (
                <li key={item.name} className="flex items-center justify-between">
                  <span className="text-slate-700">{item.name}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                    {item.count}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Announcements</h2>
            <div className="mt-4 space-y-4">
              {announcements.map((item) => (
                <article key={item.title} className="rounded-md border border-slate-100 p-4">
                  <h3 className="text-sm font-semibold text-slate-800">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{item.body}</p>
                </article>
              ))}
            </div>
            <button className="mt-4 w-full rounded-md border border-dashed border-slate-300 py-2 text-sm font-medium text-slate-600">
              Publish new announcement
            </button>
          </div>
        </section>
      </main>
    </div>
  );

  return authToken ? renderDashboard() : renderLogin();
}

export default App;
