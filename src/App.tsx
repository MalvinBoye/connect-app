import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import BottomNav from './components/BottomNav'
import AuthScreen from './screens/AuthScreen'
import ProfileSetupScreen from './screens/ProfileSetupScreen'
import ProfileCardScreen from './screens/ProfileCardScreen'
import ReflectionAcceptScreen from './screens/ReflectionAcceptScreen'
import ReflectionPassScreen from './screens/ReflectionPassScreen'
import TransparencyScreen from './screens/TransparencyScreen'
import MessagesScreen from './screens/MessagesScreen'
import ConnectionsScreen from './screens/ConnectionsScreen'
import DateIdeasScreen from './screens/DateIdeasScreen'
import CompletionScreen from './screens/CompletionScreen'
import MatchedScreen from './screens/MatchedScreen'
import MyProfileScreen from './screens/MyProfileScreen'

const HIDE_NAV = ['/messages', '/reflection-accept', '/reflection-pass', '/matched', '/transparency']

function AppRoutes() {
  const { user, profile, loading } = useAuth()
  const location = useLocation()
  const showNav = user && profile && !HIDE_NAV.includes(location.pathname)

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 28, height: 28, border: '2px solid #e8e8e8', borderTop: '2px solid #2C5F5D', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!user) return <Routes><Route path="*" element={<AuthScreen />} /></Routes>
  if (!profile) return <Routes><Route path="*" element={<ProfileSetupScreen />} /></Routes>

  return (
    <>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/profile" replace />} />
          <Route path="/profile" element={<ProfileCardScreen />} />
          <Route path="/reflection-accept" element={<ReflectionAcceptScreen />} />
          <Route path="/reflection-pass" element={<ReflectionPassScreen />} />
          <Route path="/transparency" element={<TransparencyScreen />} />
          <Route path="/messages" element={<MessagesScreen />} />
          <Route path="/connections" element={<ConnectionsScreen />} />
          <Route path="/date-ideas" element={<DateIdeasScreen />} />
          <Route path="/completion" element={<CompletionScreen />} />
          <Route path="/matched" element={<MatchedScreen />} />
          <Route path="/my-profile" element={<MyProfileScreen />} />
        </Routes>
      </div>
      {showNav && <BottomNav />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
