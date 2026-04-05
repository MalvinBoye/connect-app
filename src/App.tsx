import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { AuthProvider, useAuth } from './lib/AuthContext'
import SplashScreen from './components/SplashScreen'
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
      <div style={{ width: 20, height: 20, border: '1px solid var(--brown-border)', borderTop: '1px solid var(--sage)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
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
  const [splashDone, setSplashDone] = useState(false)

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell">
          {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
