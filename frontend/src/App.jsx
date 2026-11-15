import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import Sidebar from './components/Sidebar.jsx'
import TopNav from './components/TopNav.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { apiGet } from './lib/api.js'

export default function App() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    apiGet('/health')
      .then((data) => {
        if (!cancelled) setHealth(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const status = health?.status === 'ok' ? 'ok' : 'down'

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav status={status} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard health={health} loading={loading} error={error} />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  )
}
