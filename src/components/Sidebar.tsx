import { useState } from 'react'
import * as Icons from './Icons'
import Modal from './Modal'
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
  { id: 'skills', label: 'Skills', icon: Icons.SkillsIcon },
  { id: 'categories', label: 'Categories', icon: Icons.FolderIcon },
  { id: 'contacts', label: 'Contacts', icon: Icons.ContactsIcon },
  { id: 'messages', label: 'Messages', icon: Icons.MessagesIcon },
]

const secondaryNav: NavItem[] = [
  { id: 'personal', label: 'Personal Info', icon: Icons.UserIcon },
]

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  activeSection: string
  onNavigate: (id: string) => void
  onCategoryFilter?: (category: string) => void
  onLogout: () => void
}

export default function Sidebar({ isOpen, onClose, activeSection, onNavigate, onCategoryFilter, onLogout }: SidebarProps) {
  const [skills, setSkills] = useLocalStorage<Skill[]>('portfolio_skills', [])
  const [categories, setCategories] = useLocalStorage<SkillCategory[]>('portfolio_categories', [])

  // Category CRUD state
  const [showCatModal, setShowCatModal] = useState(false)
  const [catFormName, setCatFormName] = useState('')
  const [catFormIcon, setCatFormIcon] = useState('🌟')
  const [editingCatId, setEditingCatId] = useState<string | null>(null)

  const resetCatForm = () => {
    setCatFormName('')
    setCatFormIcon('🌟')
    setEditingCatId(null)
  }

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!catFormName.trim()) return
    if (editingCatId) {
      setCategories((prev) => prev.map((c) => (c.id === editingCatId ? { ...c, name: catFormName.trim(), icon: catFormIcon } : c)))
    } else {
      setCategories((prev) => [...prev, { id: generateId(), name: catFormName.trim(), icon: catFormIcon }])
    }
    resetCatForm()
  }

  const handleDeleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id)
    if (cat) setSkills((prev) => prev.filter((s) => s.category !== cat.name))
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  const handleEditCategory = (cat: SkillCategory) => {
    setCatFormName(cat.name)
    setCatFormIcon(cat.icon)
    setEditingCatId(cat.id)
  }

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

          {/* Categories Section */}
          {categories.length > 0 && (
            <>
              <div className="mb-1.5 flex items-center justify-between px-3">
                <button
                  onClick={() => { handleNav('categories') }}
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Skill Categories
                </button>
                <button
                  onClick={() => { resetCatForm(); setShowCatModal(true) }}
                  className="flex h-5 w-5 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                  title="Manage categories"
                >
                  <Icons.PlusIcon className="h-3.5 w-3.5" />
                </button>
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

                      {/* Hover actions */}
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <span
                          onClick={(e) => { e.stopPropagation(); handleEditCategory(cat); setShowCatModal(true) }}
                          className="flex h-5 w-5 items-center justify-center rounded text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        >
                          <Icons.EditIcon className="h-3 w-3" />
                        </span>
                        <span
                          onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id) }}
                          className="flex h-5 w-5 items-center justify-center rounded text-[var(--text-muted)] hover:text-danger"
                        >
                          <Icons.TrashIcon className="h-3 w-3" />
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {/* Empty state for categories */}
          {categories.length === 0 && (
            <div className="mb-3 px-3">
              <div className="mb-1.5 flex items-center justify-between">
                <button
                  onClick={() => { handleNav('categories') }}
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  Skill Categories
                </button>
                <button
                  onClick={() => { resetCatForm(); setShowCatModal(true) }}
                  className="flex h-5 w-5 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                  title="Add category"
                >
                  <Icons.PlusIcon className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                onClick={() => { resetCatForm(); setShowCatModal(true) }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-sidebar-hover)] hover:text-[var(--text-secondary)]"
              >
                <Icons.PlusIcon className="h-3.5 w-3.5" />
                <span>Create category</span>
              </button>
            </div>
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

      {/* ═══ Category Management Modal ═══ */}
      <Modal isOpen={showCatModal} onClose={() => setShowCatModal(false)} title={editingCatId ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Emoji Icon</label>
            <input
              type="text"
              value={catFormIcon}
              onChange={(e) => setCatFormIcon(e.target.value)}
              placeholder="🌟"
              maxLength={2}
              className="w-16 text-center rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-2 py-2.5 text-lg outline-none transition-colors focus:border-primary-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
              Category Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={catFormName}
              onChange={(e) => setCatFormName(e.target.value)}
              placeholder="e.g. Frontend, Backend..."
              className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30 focus:bg-primary-500/[0.03]"
              autoFocus
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowCatModal(false)}
              className="rounded-xl border border-[var(--border-input)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-600 active:scale-[0.97]"
            >
              {editingCatId ? 'Update' : 'Add'} Category
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}
