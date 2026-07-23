import { useState } from 'react'
import * as Icons from './Icons'

interface NavbarProps {
  onToggleSidebar: () => void
  darkMode: boolean
  onToggleDark: () => void
  activeSection: string
  onLogout: () => void
}

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  skills: 'Skills',
  categories: 'Categories',
  contacts: 'Contacts',
  messages: 'Messages',
  personal: 'Personal Info',
}

export default function Navbar({ onToggleSidebar, darkMode, onToggleDark, activeSection, onLogout }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const notifications = [
    { id: 1, text: 'New message from Sarah', time: '2m ago', unread: true },
    { id: 2, text: 'New project uploaded', time: '15m ago', unread: true },
    { id: 3, text: 'Contact form submission', time: '1h ago', unread: false },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-[var(--border)] bg-[var(--bg-body)]/80 px-4 backdrop-blur-xl md:px-6">
      {/* Mobile hamburger */}
      <button
        onClick={onToggleSidebar}
        className="-ml-2 flex h-10 w-10 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Icons.MenuIcon className="h-5 w-5" />
      </button>

      {/* Page title */}
      <h1 className="text-base font-semibold text-[var(--text-primary)] md:text-lg">
        {pageTitles[activeSection] || 'Dashboard'}
      </h1>

      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden md:block">
        <Icons.SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search..."
          className="h-9 w-56 rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all duration-200 focus:w-72 focus:border-primary-500/30 focus:bg-primary-500/[0.03]"
        />
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={onToggleDark}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
        aria-label="Toggle theme"
      >
        {darkMode ? (
          <Icons.SunIcon className="h-4.5 w-4.5" />
        ) : (
          <Icons.MoonIcon className="h-4.5 w-4.5" />
        )}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false) }}
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
          aria-label="Notifications"
        >
          <Icons.BellIcon className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white">
              {unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
            <div className="absolute right-0 top-full z-50 mt-2 w-80 animate-fade-in overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-md)]">
              <div className="border-b border-[var(--border)] px-4 py-3">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Notifications</p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <button key={n.id} className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--bg-surface-hover)]">
                    <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.unread ? 'bg-primary-400' : 'bg-[var(--text-muted)]'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${n.unread ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                        {n.text}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--text-muted)]">{n.time}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-[var(--border)] p-2">
                <button className="w-full rounded-lg px-3 py-2 text-center text-xs font-medium text-primary-400 transition-colors hover:bg-primary-500/10">
                  View all notifications
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => { setShowProfile(!showProfile); setShowNotifications(false) }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-indigo-400 text-xs font-bold text-white shadow-sm transition-shadow hover:shadow-md hover:shadow-primary-500/20"
          aria-label="Profile"
        >
          BK
        </button>

        {showProfile && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
            <div className="absolute right-0 top-full z-50 mt-2 w-56 animate-fade-in overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-md)]">
              <div className="px-4 py-4">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Brian Kimathi</p>
                <p className="text-xs text-[var(--text-muted)]">brian@example.com</p>
              </div>
              <div className="border-t border-[var(--border)] p-2">
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]">
                  <Icons.UserIcon className="h-4 w-4" />
                  Profile
                </button>
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]">
                  <Icons.SettingsIcon className="h-4 w-4" />
                  Settings
                </button>
              </div>
              <div className="border-t border-[var(--border)] p-2">
                <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger/80 transition-colors hover:bg-danger/10 hover:text-danger">
                  <Icons.LogoutIcon className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
