import { useState } from 'react'

interface LoginProps {
  onLogin: () => void
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password')
      return
    }
    setError('')
    onLogin()
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-body)]">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-indigo-300 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-300 blur-3xl" />
        </div>
        <div className="relative flex flex-col items-center justify-center w-full px-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm shadow-lg mb-6">
            <span className="text-2xl font-bold text-white">P</span>
          </div>
          <h1 className="text-3xl font-bold text-white text-center">Portfolio Admin</h1>
          <p className="mt-3 text-center text-white/60 text-sm max-w-sm leading-relaxed">
            Manage your projects, skills, contacts, and personal information from one place.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 w-full max-w-sm">
            {['📁', '⚡', '✉'].map((emoji, i) => (
              <div key={i} className="flex flex-col items-center gap-2 rounded-xl bg-white/5 px-4 py-4 backdrop-blur-sm">
                <span className="text-xl">{emoji}</span>
                <span className="text-[11px] font-medium text-white/50 text-center">
                  {['Projects', 'Skills', 'Messages'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="flex flex-col items-center lg:hidden mb-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-500 shadow-lg shadow-primary-500/20 mb-4">
              <span className="text-xl font-bold text-white">P</span>
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Portfolio Admin</h1>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Welcome back</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Sign in to manage your portfolio</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Email</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">📧</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="any@email.com"
                    className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] pl-9 pr-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30 focus:bg-primary-500/[0.03]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">🔒</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="any password"
                    className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] pl-9 pr-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30 focus:bg-primary-500/[0.03]"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-danger/80 bg-danger/5 rounded-lg px-3 py-2">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition-all hover:shadow-primary-500/30 hover:from-primary-600 hover:to-indigo-600 active:scale-[0.98]"
              >
                Sign In
              </button>
            </form>

            {/* Demo notice */}
            <div className="mt-6 rounded-xl border border-amber-500/15 bg-amber-500/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <span className="text-xs font-medium text-amber-400">Demo Mode</span>
              </div>
              <p className="mt-1 text-[11px] text-amber-400/60">
                Any email and password will work. Just sign in to explore.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-[var(--text-muted)]">
            Portfolio Admin Panel &mdash; Personal Project
          </p>
        </div>
      </div>
    </div>
  )
}
