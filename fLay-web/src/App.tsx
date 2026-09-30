import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import { Sidebar } from './components/layout/Sidebar'

import { Dashboard } from './pages/Dashboard'
import { Proofs } from './pages/Proofs'
import { Bank } from './pages/Bank'
import { Settings } from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen">
        <Sidebar />

        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/comprovantes"
            element={<Proofs />}
          />

          <Route
            path="/banco"
            element={<Bank />}
          />

          <Route
            path="/configuracoes"
            element={<Settings />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App