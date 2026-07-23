import { useMemo } from 'react'
import * as Icons from '../components/Icons'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Project } from './Projects'
import type { Skill } from './Skills'

interface StatCard {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const recentActivity = [
  { action: 'New message from Sarah Johnson', time: '2 minutes ago', type: 'message' as const },
  { action: 'Project "Portfolio v3" was updated', time: '1 hour ago', type: 'project' as const },
  { action: 'New skill "React Native" added', time: '3 hours ago', type: 'skill' as const },
  { action: 'Contact form submitted by Alex M.', time: '5 hours ago', type: 'contact' as const },
  { action: 'Profile information updated', time: '1 day ago', type: 'profile' as const },
  { action: 'Project "E-commerce App" published', time: '2 days ago', type: 'project' as const },
]

const typeColors: Record<string, string> = {
  message: 'bg-primary-500/20 text-primary-400',
  project: 'bg-indigo-500/20 text-indigo-400',
  skill: 'bg-emerald-500/20 text-emerald-400',
  contact: 'bg-amber-500/20 text-amber-400',
  profile: 'bg-rose-500/20 text-rose-400',
}

export default function Dashboard() {
  const [projects] = useLocalStorage<Project[]>('portfolio_projects', [])
  const [skills] = useLocalStorage<Skill[]>('portfolio_skills', [])

  const publishedCount = useMemo(() => projects.filter((p) => p.status === 'Published').length, [projects])
  const avgLevel = useMemo(() => {
    if (skills.length === 0) return 0
    return Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length)
  }, [skills])

  const stats: StatCard[] = [
    {
      label: 'Total Projects',
      value: String(projects.length),
      change: `${publishedCount} published`,
      trend: 'up',
      icon: Icons.ProjectsIcon,
      color: 'from-primary-500 to-indigo-500',
    },
    {
      label: 'Skills',
      value: String(skills.length),
      change: `Avg ${avgLevel}% proficiency`,
      trend: 'up',
      icon: Icons.SkillsIcon,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Messages',
      value: '48',
      change: '+12 this week',
      trend: 'up',
      icon: Icons.MessagesIcon,
      color: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Page Views',
      value: '2,847',
      change: '+18.2%',
      trend: 'up',
      icon: Icons.EyeIcon,
      color: 'from-rose-500 to-pink-500',
    },
  ]

  const readMessages = 42
  const totalMessages = 48

  return (
    <div className="animate-slide-up space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Welcome back, Brian 👋</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Here&apos;s what&apos;s happening with your portfolio today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 transition-all duration-300 hover:border-primary-500/20 hover:shadow-lg hover:shadow-primary-500/5"
            >
              <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${stat.color} opacity-5 blur-2xl transition-opacity duration-300 group-hover:opacity-10`} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.trend === 'up' ? (
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 15l-6-6-6 6" />
                      </svg>
                    ) : (
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    )}
                    {stat.change}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activity + Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Activity</h3>
          <div className="mt-4 space-y-1">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--bg-surface-hover)]"
              >
                <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold ${typeColors[item.type]}`}>
                  {item.type === 'message' ? '✉' : item.type === 'project' ? '📁' : item.type === 'skill' ? '⚡' : item.type === 'contact' ? '👤' : '🔧'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-secondary)]">{item.action}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Portfolio Overview</h3>
          <div className="mt-4 space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Projects Published</span>
                  <span className="font-medium text-[var(--text-primary)]">
                    {projects.length > 0 ? `${publishedCount}/${projects.length}` : '0/0'}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--bg-surface-hover)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${projects.length > 0 ? (publishedCount / projects.length) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Average Skill Proficiency</span>
                  <span className="font-medium text-[var(--text-primary)]">{avgLevel}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--bg-surface-hover)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${avgLevel}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Messages Read</span>
                  <span className="font-medium text-[var(--text-primary)]">{readMessages}/{totalMessages}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--bg-surface-hover)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${(readMessages / totalMessages) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface-hover)] p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Quick Tip</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                Keep your portfolio fresh! Add new projects and skills regularly to showcase your growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
