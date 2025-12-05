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

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              XAndera Admin Portal
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Saraswathi Vidyalaya
            </h1>
          </div>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Switch School
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div key={card.label} className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {card.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {card.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Top Items
              </h2>
              <button className="text-sm font-medium text-primary">
                Export summary
              </button>
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
            <h2 className="text-lg font-semibold text-slate-900">
              Announcements
            </h2>
            <div className="mt-4 space-y-4">
              {announcements.map((item) => (
                <article key={item.title} className="rounded-md border border-slate-100 p-4">
                  <h3 className="text-sm font-semibold text-slate-800">
                    {item.title}
                  </h3>
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
}

export default App;
