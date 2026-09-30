import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import { Sidebar } from './components/layout/Sidebar'
import { LoadingScreen } from './components/LoadingScreen' // Verifique se o caminho está correto

import { Dashboard } from './pages/Dashboard'
import { Proofs } from './pages/Proofs'

function App() {
  return (
    <BrowserRouter>
      {/* TELA DE CARREGAMENTO */}
      <LoadingScreen />

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
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App