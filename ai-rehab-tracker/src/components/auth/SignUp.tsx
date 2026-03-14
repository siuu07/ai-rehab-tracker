import { useState } from "react"
import { supabase } from "../../supabaseClient"

// SignUp.tsx
interface SignUpProps {
  onSuccess: () => void
  onSwitchToLogin: () => void  // if user wants to login instead
}

export function SignUp({ onSuccess, onSwitchToLogin }: SignUpProps) {
  // State for email, password, error message, loading
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      onSuccess()
      setLoading(false)
    }
  }
    return (
      <div className="card">
        <h2>Sign Up</h2>

        {/* Show error if it exists */}
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSignUp}>
          {/* Email input */}
          <div>
            <label>Email: </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Password input */}
          <div>
            <label>Password: </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Submit button */}
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Sign Up'}
          </button>

          {/* Link to login */}
          <p>
            Already have an account?{' '}
            <span
              onClick={onSwitchToLogin}
              style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Log in
            </span>
          </p>
        </form>
      </div>
    )
}