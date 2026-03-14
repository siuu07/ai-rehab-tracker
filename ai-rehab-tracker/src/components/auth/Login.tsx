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

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error('Login failed:', error.message)
    } else {
      onSuccess()
    }
  }
  
  // Same JSX structure, just change text
  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
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
      <button type="submit">Login</button>
      <p>
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignUp}>
          Sign Up
        </button>
      </p>
    </form>
  )
}