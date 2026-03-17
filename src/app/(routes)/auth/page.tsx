'use client'

import { signIn, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function SignInPage() {
  const { data: session } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = async () => {
    const res = await signIn('credentials', { email, password, redirect: false })
  }

  if (session) {
    return <p>Logged in as {session.user?.email}</p>
  }

  return (
    <div>
      <h1>Sign In</h1>
      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  )
}
