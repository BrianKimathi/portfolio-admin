import * as Icons from './Icons'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { Skill, SkillCategory } from '../pages/Skills'

export interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const primaryNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Icons.DashboardIcon },
  { id: 'projects', label: 'Projects', icon: Icons.ProjectsIcon },
  { id: 'experience', label: 'Experience', icon: Icons.BriefcaseIcon },
  { id: 'skills', label: 'Skills', icon: Icons.SkillsIcon },
  { id: 'categories', label: 'Categories', icon: Icons.FolderIcon },
  { id: 'contacts', label: 'Contacts', icon: Icons.ContactsIcon },
  { id: 'messages', label: 'Messages', icon: Icons.MessagesIcon },
]

const secondaryNav: NavItem[] = [
  { id: 'personal', label: 'Personal Info', icon: Icons.UserIcon },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeSection: string
  onNavigate: (id: string) => void
  onCategoryFilter?: (category: string) => void
  onLogout: () => void
}

export default function Sidebar({ isOpen, onClose, activeSection, onNavigate, onCategoryFilter, onLogout }: SidebarProps) {
  const [skills] = useLocalStorage<Skill[]>('portfolio_skills', [])
  const [categories] = useLocalStorage<SkillCategory[]>('portfolio_categories', [])

  const handleNav = (id: string) => {
    onNavigate(id)
    onClose()
  }

  const handleCategory = (catName: string) => {
    onNavigate('skills')
    if (onCategoryFilter) onCategoryFilter(catName)
    onClose()
  }

  const renderNavItem = (item: NavItem) => {
    const isActive = activeSection === item.id
    const Icon = item.icon
    return (
      <button
        key={item.id}
        onClick={() => handleNav(item.id)}
        className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-primary-500/10 text-primary-400'
            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar-hover)] hover:text-[var(--text-primary)]'
        }`}
      >
        {isActive && (
          <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary-400" />
        )}
        <Icon className={`h-5 w-5 shrink-0 transition-colors duration-200 ${isActive ? 'text-primary-400' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'}`} />
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge !== undefined && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-500/20 px-1.5 text-[11px] font-semibold text-primary-400">
            {item.badge}
          </span>
        )}
      </button>
    )
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--bg-sidebar)] transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[var(--border)] px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-indigo-500 shadow-lg shadow-primary-500/20">
            <span className="text-sm font-bold text-white">P</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[var(--text-primary)]">Portfolio</span>
            <span className="text-[11px] font-medium text-[var(--text-muted)]">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto min-h-0 px-3 pb-4 pt-2">
          <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Main Menu
          </div>
          <div className="mb-3 space-y-0.5">
            {primaryNav.map(renderNavItem)}
          </div>

          {/* Categories quick-filter list */}
          {categories.length > 0 && (
            <>
              <div className="mb-1.5 px-3">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Filter by Category
                </span>
              </div>
              <div className="mb-3 space-y-0.5">
                {categories.map((cat) => {
                  const count = skills.filter((s) => s.category === cat.name).length
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategory(cat.name)}
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        activeSection === 'skills'
                          ? 'text-primary-400'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar-hover)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span className="text-sm">{cat.icon || '📌'}</span>
                      <span className="flex-1 text-left truncate">{cat.name}</span>
                      <span className="text-xs text-[var(--text-muted)]">{count}</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          <div className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Settings
          </div>
          <div className="space-y-0.5">
            {secondaryNav.map(renderNavItem)}
          </div>
        </nav>

        {/* User profile */}
        <div className="shrink-0 border-t border-[var(--border)] p-3">
          <div className="flex items-center gap-3 rounded-xl bg-[var(--bg-surface-hover)] px-3 py-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-indigo-400 text-xs font-bold text-white shadow-sm">
              BK
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-[var(--text-primary)]">Brian Kimathi</p>
              <p className="truncate text-xs text-[var(--text-muted)]">Admin</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-red-400"
              title="Logout"
            >
              <Icons.LogoutIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
