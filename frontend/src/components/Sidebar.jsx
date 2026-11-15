const links = [
  { label: 'Dashboard', to: '/' },
  { label: 'Disasters', to: '/disasters', soon: true },
  { label: 'Shelters', to: '/shelters', soon: true },
  { label: 'Warehouses', to: '/warehouses', soon: true },
  { label: 'Resources', to: '/resources', soon: true },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white p-4 md:flex">
      <div className="mb-6 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-sm font-bold text-white">
          SU
        </span>
        <div>
          <p className="text-sm font-bold text-slate-800">SUTRA</p>
          <p className="text-xs text-slate-500">Relief Allocation</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.to}
            className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            {link.label}
            {link.soon && (
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                soon
              </span>
            )}
          </a>
        ))}
      </nav>

      <p className="mt-auto text-xs text-slate-400">
        Smart Unified Transport and Relief Allocation
      </p>
    </aside>
  )
}
