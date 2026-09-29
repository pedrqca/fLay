import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './pages/Dashboard'

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <Dashboard />
    </div>
  )
}

export default App