import { useState } from 'react'
import { Login } from './Login'
import { SignUp } from './SignUp'

interface AuthPageProps {
  onAuthSuccess: () => void
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  // State to track which view to show
  const [view, setView] = useState<'login' | 'signup'>('signup')
  
  // Conditionally render Login or SignUp based on view
  return (
    <div>
      {view === 'signup' ? (
        <SignUp 
          onSuccess={onAuthSuccess}
          onSwitchToLogin={() => setView('login')}
        />
      ) : (
        <Login 
          onSuccess={onAuthSuccess}
          onSwitchToSignUp={() => setView('signup')}
        />
      )}
    </div>
  )
}