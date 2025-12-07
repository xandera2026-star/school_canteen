import { useCallback, useEffect, useMemo, useState } from 'react';
import './index.css';
import { apiRequest } from './lib/api';
import type {
  DashboardResponse,
  DashboardMissingStudent,
  MenuCategory,
  MenuItem,
  ImportStats,
  ListResponse,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const DEMO_SCHOOL_CODE = import.meta.env.VITE_DEMO_SCHOOL_CODE ?? '';

type Announcement = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

const defaultAnnouncements: Announcement[] = [];

function App() {
  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem('xandera.authToken'),
  );
  const [schoolCode, setSchoolCode] = useState(
    DEMO_SCHOOL_CODE ? DEMO_SCHOOL_CODE.toUpperCase() : '',
  );
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'enter' | 'verify'>('enter');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dashboard, setDashboard] = useState<DashboardResponse['data'] | null>(
    null,
  );
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    defaultAnnouncements,
  );
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [menuError, setMenuError] = useState('');
  const [themePrimary, setThemePrimary] = useState('#2563EB');
  const [themeAccent, setThemeAccent] = useState('#F97316');
  const [themeLogoUrl, setThemeLogoUrl] = useState('');
  const [cutoffTime, setCutoffTime] = useState('09:00');
  const [cutoffTimezone, setCutoffTimezone] = useState('Asia/Kolkata');

  const announcementStorageKey = useMemo(() => {
    const key = schoolCode.trim();
    return key ? `xandera.announcements.${key}` : 'xandera.announcements';
  }, [schoolCode]);

  useEffect(() => {
    const stored = localStorage.getItem(announcementStorageKey);
    if (stored) {
      try {
        setAnnouncements(JSON.parse(stored));
      } catch {
        setAnnouncements(defaultAnnouncements);
      }
    } else {
      setAnnouncements(defaultAnnouncements);
    }
  }, [announcementStorageKey]);

  useEffect(() => {
    localStorage.setItem(announcementStorageKey, JSON.stringify(announcements));
  }, [announcementStorageKey, announcements]);

  const identifier = useMemo(() => {
    const code = schoolCode.trim().toUpperCase();
    return code ? { school_code: code } : null;
  }, [schoolCode]);

  const buildHeaders = useMemo(
    () => ({
      'Content-Type': 'application/json',
    }),
    [],
  );

  const handleSendOtp = async () => {
    setError('');
    setStatus('');
    if (!identifier || mobile.trim().length !== 10) {
      setError('Enter a 10-digit mobile number and school code.');
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
        headers: buildHeaders,
        body: JSON.stringify({
          mobile,
          country_code: '+91',
          user_type: 'parent',
          ...identifier,
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
    if (!identifier) {
      setError('Provide the school code used for login.');
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
        headers: buildHeaders,
        body: JSON.stringify({
          mobile,
          otp,
          user_type: 'parent',
          ...identifier,
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

  const handleLogout = useCallback(() => {
    localStorage.removeItem('xandera.authToken');
    setAuthToken(null);
    setMobile('');
    setOtp('');
    setStep('enter');
    setStatus('');
    setError('');
    setDashboard(null);
    setCategories([]);
    setMenuItems([]);
    setImportStats(null);
  }, []);

  const handleSwitchSchool = () => {
    const value = window.prompt(
      'Enter the next school code (like SVS1):',
      schoolCode,
    );
    if (!value) {
      return;
    }
    const nextCode = value.trim().toUpperCase();
    if (!nextCode) {
      return;
    }
    setSchoolCode(nextCode);
    handleLogout();
  };

  const authorizedRequest = useCallback(
    async <T,>(path: string) => {
      if (!API_BASE_URL) {
        throw new Error('API base URL missing');
      }
      return apiRequest<T>(API_BASE_URL, path, {
        token: authToken,
      });
    },
    [authToken],
  );

  const fetchDashboard = useCallback(async () => {
    try {
      setLoadingDashboard(true);
      const response = await authorizedRequest<DashboardResponse>(
        '/admin/dashboard',
      );
      setDashboard(response.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingDashboard(false);
    }
  }, [authorizedRequest]);

  const fetchMenuData = useCallback(async () => {
    try {
      setLoadingMenu(true);
      setMenuError('');
      const [categoryResponse, itemResponse] = await Promise.all([
        authorizedRequest<ListResponse<MenuCategory[]>>('/admin/menu-categories'),
        authorizedRequest<ListResponse<MenuItem[]>>('/admin/menu-items'),
      ]);
      setCategories(categoryResponse.data);
      setMenuItems(itemResponse.data);
    } catch (err) {
      setMenuError((err as Error).message);
    } finally {
      setLoadingMenu(false);
    }
  }, [authorizedRequest]);

  useEffect(() => {
    if (authToken) {
      void fetchDashboard();
      void fetchMenuData();
    }
  }, [authToken, fetchDashboard, fetchMenuData]);

  const handleStudentImport = async (file: File | null) => {
    if (!file) {
      setError('Please pick a CSV file first.');
      return;
    }
    if (!API_BASE_URL) {
      setError('API base URL missing.');
      return;
    }
    try {
      setError('');
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiRequest<ListResponse<ImportStats>>(
        API_BASE_URL,
        '/admin/students/import',
        {
          method: 'POST',
          body: formData,
          token: authToken,
          isFormData: true,
        },
      );
      setImportStats(response.data);
      setStatus(
        `Imported ${response.data.students_created} new students (processed ${response.data.processed} rows).`,
      );
      await fetchDashboard();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const downloadCsv = useCallback(
    async (path: string, filename: string) => {
      if (!authToken) {
        setError('You must be signed in to download files.');
        return;
      }
      try {
        const base = (API_BASE_URL ?? '').replace(/\/$/, '');
        const url = `${base}${path}` || path;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!response.ok) {
          let message = response.statusText || 'Unable to download file.';
          try {
            const errorBody = await response.json();
            message = errorBody?.message ?? message;
          } catch {
            const text = await response.text();
            if (text) {
              message = text;
            }
          }
          throw new Error(message);
        }
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (err) {
        setError((err as Error).message);
      }
    },
    [authToken],
  );

  const studentsPendingCount = dashboard?.missing_students.length ?? 0;
  const schoolDisplayName = dashboard?.school_name?.trim() ?? '';

  const handleDownloadTemplate = useCallback(() => {
    void downloadCsv('/admin/students/template', 'student_import_template.csv');
  }, [downloadCsv]);

  const handleExportStudents = useCallback(() => {
    const baseName = schoolDisplayName || schoolCode || 'students';
    const safeName =
      baseName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'students';
    void downloadCsv('/admin/students/export', `${safeName}-roster.csv`);
  }, [downloadCsv, schoolDisplayName, schoolCode]);

  const handleCreateCategory = async (payload: {
    name: string;
    type: string;
    description?: string;
  }) => {
    try {
      setMenuError('');
      await apiRequest(API_BASE_URL, '/admin/menu-categories', {
        method: 'POST',
        body: JSON.stringify(payload),
        token: authToken,
      });
      await fetchMenuData();
      setStatus('Category created successfully.');
    } catch (err) {
      setMenuError((err as Error).message);
    }
  };

  const handleUpdateTheme = async () => {
    try {
      await apiRequest(API_BASE_URL, '/admin/theme', {
        method: 'PUT',
        body: JSON.stringify({
          primary_color: themePrimary,
          accent_color: themeAccent,
          logo_url: themeLogoUrl || undefined,
        }),
        token: authToken,
      });
      setStatus('Theme updated for this school.');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleUpdateCutoff = async () => {
    try {
      await apiRequest(API_BASE_URL, '/admin/cutoff', {
        method: 'PUT',
        body: JSON.stringify({
          cutoff_time: `${cutoffTime}:00`,
          timezone: cutoffTimezone,
        }),
        token: authToken,
      });
      setStatus('Cut-off settings updated.');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleCreateMenuItem = async () => {
    const name = window.prompt('Item name');
    if (!name) return;
    const priceValue = window.prompt('Price in INR', '80');
    if (!priceValue) return;
    const categoryId =
      categories[0]?.category_id ??
      window.prompt('Category ID (use menu categories list)') ??
      '';
    if (!categoryId) {
      window.alert('Category is required.');
      return;
    }
    try {
      await apiRequest(API_BASE_URL, '/admin/menu-items', {
        method: 'POST',
        body: JSON.stringify({
          name,
          price: Number(priceValue),
          currency: 'INR',
          category_id: categoryId,
          is_active: true,
        }),
        token: authToken,
      });
      await fetchMenuData();
      setStatus(`Menu item "${name}" added.`);
    } catch (err) {
      setMenuError((err as Error).message);
    }
  };

  const handleAddAnnouncement = (title: string, body: string) => {
    const entry: Announcement = {
      id: crypto.randomUUID(),
      title,
      body,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [entry, ...prev]);
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
          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium text-slate-700">
                School Code
              </label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 uppercase focus:border-primary focus:outline-none"
                type="text"
                value={schoolCode}
                onChange={(event) =>
                  setSchoolCode(event.target.value.toUpperCase())
                }
                placeholder="e.g. SVS1"
              />
            </div>
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
                onChange={(event) =>
                  setOtp(event.target.value.replace(/[^0-9]/g, ''))
                }
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

  const renderAnnouncements = () => {
    const title = window.prompt('Announcement title');
    if (!title) return;
    const body = window.prompt('Announcement details');
    if (!body) return;
    handleAddAnnouncement(title, body);
  };

  const renderDashboard = () => (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              {schoolDisplayName || schoolCode || 'Your School'}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
              onClick={handleSwitchSchool}
            >
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

      <main className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            label="Orders Today"
            value={loadingDashboard ? '…' : dashboard?.orders_today ?? '--'}
          />
          <DashboardCard
            label="Google Pay (₹)"
            value={
              loadingDashboard ? '…' : dashboard?.gpay_total.toLocaleString() ?? '--'
            }
          />
          <DashboardCard
            label="Cash (₹)"
            value={
              loadingDashboard ? '…' : dashboard?.cash_total.toLocaleString() ?? '--'
            }
          />
          <DashboardCard
            label="Students Pending"
            value={loadingDashboard ? '…' : studentsPendingCount}
            hint="Active students who have not ordered yet today."
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Top Items
              </h2>
              <span className="text-sm text-slate-500">
                {dashboard?.date ?? ''}
              </span>
            </div>
            {loadingDashboard && <p className="mt-4 text-sm text-slate-500">Loading…</p>}
            {!loadingDashboard && (
              <ul className="mt-4 space-y-3">
                {dashboard?.top_items.map((item) => (
                  <li key={item.name} className="flex items-center justify-between">
                    <span className="text-slate-700">{item.name}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                      {item.count}
                    </span>
                  </li>
                ))}
                {dashboard?.top_items.length === 0 && (
                  <li className="rounded-md border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                    No orders yet for the selected date.
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Announcements</h2>
            <div className="mt-4 space-y-4">
              {announcements.map((item) => (
                <article key={item.id} className="rounded-md border border-slate-100 p-4">
                  <h3 className="text-sm font-semibold text-slate-800">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{item.body}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </article>
              ))}
            </div>
            <button
              className="mt-4 w-full rounded-md border border-dashed border-slate-300 py-2 text-sm font-medium text-slate-600"
              onClick={renderAnnouncements}
            >
              Publish new announcement
            </button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <StudentImportCard
            onImport={handleStudentImport}
            stats={importStats}
            pendingStudents={dashboard?.missing_students ?? []}
            onDownloadTemplate={handleDownloadTemplate}
            onExportStudents={handleExportStudents}
          />
          <MenuManager
            categories={categories}
            items={menuItems}
            loading={loadingMenu}
            error={menuError}
            onRefresh={fetchMenuData}
            onCreateCategory={handleCreateCategory}
            onCreateItem={handleCreateMenuItem}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <ThemeSettingsCard
            primary={themePrimary}
            accent={themeAccent}
            logoUrl={themeLogoUrl}
            onPrimaryChange={setThemePrimary}
            onAccentChange={setThemeAccent}
            onLogoChange={setThemeLogoUrl}
            onSave={handleUpdateTheme}
          />
          <CutoffSettingsCard
            cutoffTime={cutoffTime}
            timezone={cutoffTimezone}
            onCutoffChange={setCutoffTime}
            onTimezoneChange={setCutoffTimezone}
            onSave={handleUpdateCutoff}
          />
        </section>
      </main>
    </div>
  );

  return authToken ? renderDashboard() : renderLogin();
}

type DashboardCardProps = {
  label: string;
  value: string | number;
  hint?: string;
};

function DashboardCard({ label, value, hint }: DashboardCardProps) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

type StudentImportProps = {
  onImport: (file: File | null) => Promise<void>;
  stats: ImportStats | null;
  pendingStudents: DashboardMissingStudent[];
  onDownloadTemplate: () => void;
  onExportStudents: () => void;
};

function StudentImportCard({
  onImport,
  stats,
  pendingStudents,
  onDownloadTemplate,
  onExportStudents,
}: StudentImportProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Students</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600"
            onClick={onDownloadTemplate}
          >
            Download template
          </button>
          <button
            type="button"
            className="rounded-md bg-slate-900 px-3 py-1 text-sm font-medium text-white"
            onClick={onExportStudents}
          >
            Export roster
          </button>
        </div>
      </div>
      <div className="rounded-lg border border-dashed border-slate-300 p-4 space-y-3">
        <p className="text-sm text-slate-600">
          Upload the CSV provided by XAndera onboarding. Existing students will be updated,
          new ones will be created automatically.
        </p>
        <input
          type="file"
          accept=".csv"
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
        />
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          onClick={() => onImport(selectedFile)}
        >
          Import students
        </button>
        {stats && (
          <p className="text-xs text-slate-500">
            Last run processed {stats.processed} rows (created {stats.students_created} /
            updated {stats.students_updated} students).
          </p>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800">
          Students pending orders ({pendingStudents.length})
        </h3>
        <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-sm text-slate-600">
          {pendingStudents.map((student) => (
            <li
              key={student.student_id}
              className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2"
            >
              <span>{student.name}</span>
              <span className="text-xs text-slate-400">
                {student.class ?? ''} {student.section ?? ''}
              </span>
            </li>
          ))}
          {pendingStudents.length === 0 && (
            <li className="rounded-md border border-dashed border-slate-200 px-3 py-2 text-xs text-slate-400">
              Everyone has ordered today. 🎉
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

type MenuManagerProps = {
  categories: MenuCategory[];
  items: MenuItem[];
  loading: boolean;
  error: string;
  onRefresh: () => Promise<void>;
  onCreateCategory: (
    payload: { name: string; type: string; description?: string },
  ) => Promise<void>;
  onCreateItem: () => Promise<void>;
};

function MenuManager({
  categories,
  items,
  loading,
  error,
  onRefresh,
  onCreateCategory,
  onCreateItem,
}: MenuManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('veg');

  const handleCreate = () => {
    if (!newCategoryName.trim()) {
      window.alert('Category name is required.');
      return;
    }
    void onCreateCategory({
      name: newCategoryName.trim(),
      type: newCategoryType,
      description: '',
    });
    setNewCategoryName('');
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Menu</h2>
        <div className="flex gap-2">
          <button
            className="rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-600"
            onClick={onRefresh}
          >
            Refresh
          </button>
          <button
            className="rounded-md bg-slate-900 px-3 py-1 text-sm text-white"
            onClick={onCreateItem}
          >
            Add item
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && <p className="text-sm text-slate-500">Loading menu…</p>}

      <div className="space-y-3 rounded-lg border border-slate-200 p-4">
        <h3 className="text-sm font-semibold text-slate-800">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category.category_id}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {category.name} ({category.type})
            </span>
          ))}
          {categories.length === 0 && (
            <span className="text-xs text-slate-400">
              No categories yet. Add one below.
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm"
            placeholder="New category name"
            value={newCategoryName}
            onChange={(event) => setNewCategoryName(event.target.value)}
          />
          <select
            className="rounded-md border border-slate-200 px-3 py-2 text-sm"
            value={newCategoryType}
            onChange={(event) => setNewCategoryType(event.target.value)}
          >
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
            <option value="snacks">Snacks</option>
            <option value="special">Special</option>
          </select>
          <button
            className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            onClick={handleCreate}
          >
            Add category
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-800">Menu items</h3>
        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
          {items.map((item) => (
            <div
              key={item.item_id}
              className="flex items-center justify-between px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-500">{item.category_name}</p>
              </div>
              <div className="text-right text-sm text-slate-700">
                ₹{item.price.toFixed(2)}
                <p className="text-xs text-slate-400">
                  {item.is_active ? 'Active' : 'Hidden'}
                </p>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-slate-400">
              No items yet. Use “Add item” to seed your menu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type ThemeSettingsProps = {
  primary: string;
  accent: string;
  logoUrl: string;
  onPrimaryChange: (value: string) => void;
  onAccentChange: (value: string) => void;
  onLogoChange: (value: string) => void;
  onSave: () => void;
};

function ThemeSettingsCard({
  primary,
  accent,
  logoUrl,
  onPrimaryChange,
  onAccentChange,
  onLogoChange,
  onSave,
}: ThemeSettingsProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Branding</h2>
      <p className="text-sm text-slate-500">
        Configure the primary/secondary colors and logo that the parent app and admin
        portal will use for this school.
      </p>
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">Primary color</label>
        <input
          type="color"
          value={primary}
          onChange={(event) => onPrimaryChange(event.target.value)}
          className="h-10 w-20 cursor-pointer rounded border border-slate-200"
        />
      </div>
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">Accent color</label>
        <input
          type="color"
          value={accent}
          onChange={(event) => onAccentChange(event.target.value)}
          className="h-10 w-20 cursor-pointer rounded border border-slate-200"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Logo URL</label>
        <input
          type="url"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          value={logoUrl}
          onChange={(event) => onLogoChange(event.target.value)}
          placeholder="https://cdn.xandera.com/logos/saraswathi.png"
        />
      </div>
      <button
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        onClick={onSave}
      >
        Save theme
      </button>
    </div>
  );
}

type CutoffSettingsProps = {
  cutoffTime: string;
  timezone: string;
  onCutoffChange: (value: string) => void;
  onTimezoneChange: (value: string) => void;
  onSave: () => void;
};

function CutoffSettingsCard({
  cutoffTime,
  timezone,
  onCutoffChange,
  onTimezoneChange,
  onSave,
}: CutoffSettingsProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Cut-off & Timezone</h2>
      <p className="text-sm text-slate-500">
        Update the order submission cut-off and timezone for this school. Parents will be
        blocked from placing orders after this time each day.
      </p>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Cut-off time</label>
        <input
          type="time"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          value={cutoffTime}
          onChange={(event) => onCutoffChange(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Timezone</label>
        <input
          type="text"
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
          value={timezone}
          onChange={(event) => onTimezoneChange(event.target.value)}
          placeholder="Asia/Kolkata"
        />
      </div>
      <button
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        onClick={onSave}
      >
        Save cut-off
      </button>
    </div>
  );
}

export default App;
