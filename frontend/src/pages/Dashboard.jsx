const cards = [
  { title: 'Disasters', description: 'Manage disaster scenarios', count: '—' },
  { title: 'Shelters', description: 'Shelters and demands', count: '—' },
  { title: 'Warehouses', description: 'Warehouses and inventory', count: '—' },
  { title: 'Resources', description: 'Resource categories', count: '—' },
]

export default function Dashboard({ health, loading, error }) {
  const connected = health?.database?.status === 'connected'

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-slate-800">Welcome to SUTRA</h2>
      <p className="mt-1 text-sm text-slate-500">
        Smart Unified Transport and Relief Allocation — decision support for
        disaster relief planning.
      </p>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-slate-700">System status</h3>
        {loading && <p className="mt-2 text-sm text-slate-400">Checking…</p>}
        {error && (
          <p className="mt-2 text-sm text-red-500">
            Backend unreachable: {error.message}
          </p>
        )}
        {health && (
          <dl className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-slate-400">Backend</dt>
              <dd className="text-sm font-medium text-slate-800">
                {health.status === 'ok' ? 'Running' : 'Degraded'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Database</dt>
              <dd className="text-sm font-medium text-slate-800">
                {connected ? 'Connected' : 'Disconnected'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">Backend version</dt>
              <dd className="text-sm font-medium text-slate-800">
                {health.application?.version ?? '—'}
              </dd>
            </div>
          </dl>
        )}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm font-semibold text-slate-700">{card.title}</p>
            <p className="mt-1 text-xs text-slate-400">{card.description}</p>
            <p className="mt-3 text-2xl font-bold text-slate-300">{card.count}</p>
          </div>
        ))}
      </section>

      <p className="mt-6 text-xs text-slate-400">
        Data pages, maps, charts and optimisation are coming in later phases.
      </p>
    </div>
  )
}
