import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import MembershipPage from './pages/MembershipPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ProfileInfo from './pages/ProfileInfo'
import ProfileSubscriptions from './pages/ProfileSubscriptions'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="app">
      <Header />

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<MembershipPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfileInfo />} />
            <Route path="subscriptions" element={<ProfileSubscriptions />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App