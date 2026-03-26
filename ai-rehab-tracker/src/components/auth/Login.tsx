import { useState } from 'react'
import { supabase } from '../../supabaseClient'

interface LoginProps {
  onSuccess: () => void
  onSwitchToSignUp: () => void
}

export function Login({ onSuccess, onSwitchToSignUp }: LoginProps) {
  // Same state as SignUp
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault()
  setError(null)  // ← ADD: Clear previous errors
  
  if (!email || !password) {  // ← ADD: Validation
    setError('Please fill in all fields')
    return
  }
  
  setLoading(true)
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    setError(error.message)  // ← CHANGE: Set error to state, not console
    setLoading(false)        // ← ADD: Stop loading
  } else {
    onSuccess()
    setLoading(false)        // ← ADD: Stop loading
  }
}
  
  // Same JSX structure, just change text
  return (
  <div className="card">
    <h2>Login</h2>
    {error && <p style={{ color: 'red' }}>{error}</p>}  {/* ← ADD THIS LINE */}
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
      <p>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignUp}>
          Sign Up
        </button>
      </p>
    </form>
  </div>
)
}