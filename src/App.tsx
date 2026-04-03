import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import PhoneFrame from './components/PhoneFrame'
import AuthScreen from './screens/AuthScreen'
import ProfileSetupScreen from './screens/ProfileSetupScreen'
import IntentionalityScreen from './screens/IntentionalityScreen'
import ProfileCardScreen from './screens/ProfileCardScreen'
import ReflectionAcceptScreen from './screens/ReflectionAcceptScreen'
import ReflectionPassScreen from './screens/ReflectionPassScreen'
import TransparencyScreen from './screens/TransparencyScreen'
import MessagesScreen from './screens/MessagesScreen'
import CompletionScreen from './screens/CompletionScreen'
import ConversationScreen from './screens/ConversationScreen'
import MatchedScreen from './screens/MatchedScreen'

function AppRoutes() {
  const { user, profile, loading } = useAuth()

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 28, height: 28, border: '2px solid #e8e8e8', borderTop: '2px solid #2C5F5D', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  // Not logged in → auth screen
  if (!user) return (
    <Routes>
      <Route path="*" element={<AuthScreen />} />
    </Routes>
  )

  // Logged in but no profile → setup
  if (!profile) return (
    <Routes>
      <Route path="*" element={<ProfileSetupScreen />} />
    </Routes>
  )

  // Fully authenticated with profile
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/profile" replace />} />
      <Route path="/intentionality" element={<IntentionalityScreen />} />
      <Route path="/profile" element={<ProfileCardScreen />} />
      <Route path="/reflection-accept" element={<ReflectionAcceptScreen />} />
      <Route path="/reflection-pass" element={<ReflectionPassScreen />} />
      <Route path="/transparency" element={<TransparencyScreen />} />
      <Route path="/messages" element={<MessagesScreen />} />
      <Route path="/completion" element={<CompletionScreen />} />
      <Route path="/conversation" element={<ConversationScreen />} />
      <Route path="/matched" element={<MatchedScreen />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', paddingTop: 24, paddingBottom: 40, background: '#f0f0f0' }}>
          <PhoneFrame>
            <AppRoutes />
          </PhoneFrame>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
