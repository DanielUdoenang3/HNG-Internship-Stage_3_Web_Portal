import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profiles from './pages/Profiles'
import ProfileDetail from './pages/ProfileDetail'
import Search from './pages/Search'
import Account from './pages/Account'
import AuthCallback from './pages/AuthCallback'
import NotFound from './pages/NotFound'

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profiles" element={<Profiles />} />
        <Route path="profiles/:id" element={<ProfileDetail />} />
        <Route path="search" element={<Search />} />
        <Route path="account" element={<Account />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
