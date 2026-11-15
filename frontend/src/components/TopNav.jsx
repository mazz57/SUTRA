export default function TopNav({ status }) {
  const connected = status === 'ok'

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-xs font-bold text-white md:hidden">
          SU
        </span>
        <h1 className="text-sm font-semibold text-slate-800">SUTRA Dashboard</h1>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`h-2 w-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-red-500'}`}
        />
        <span className="text-xs text-slate-600">
          {connected ? 'System online' : 'System offline'}
        </span>
      </div>
    </header>
  )
}
