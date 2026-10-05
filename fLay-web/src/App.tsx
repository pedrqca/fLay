import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'

import { Sidebar } from './components/layout/Sidebar'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { LoadingScreen } from './components/LoadingScreen'

import { Dashboard } from './pages/Dashboard'
import { Proofs } from './pages/Proofs'
import { WeeklyHistory } from './pages/WeeklyHistory'

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <LoadingScreen />

      <div className="flex min-h-screen bg-[#FAF9F6]">
        <Sidebar />

        <main className="flex-1 min-w-0 w-full overflow-x-hidden pt-20 md:pt-0">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
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
                path="/historico"
                element={<WeeklyHistory />}
              />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App