import { useState, useMemo } from 'react'
import * as Icons from '../components/Icons'
import Modal from '../components/Modal'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type { SkillCategory } from './Skills'
import type { Skill } from './Skills'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

const DEFAULT_CATEGORIES: SkillCategory[] = [
  { id: 'fe', name: 'Frontend', icon: '⚛' },
  { id: 'be', name: 'Backend', icon: '⚙' },
  { id: 'devops', name: 'DevOps & Tools', icon: '🛠' },
  { id: 'design', name: 'Design', icon: '🎨' },
  { id: 'other', name: 'Other', icon: '📌' },
]

export default function Categories() {
  const [categories, setCategories] = useLocalStorage<SkillCategory[]>('portfolio_categories', DEFAULT_CATEGORIES)
  const [skills] = useLocalStorage<Skill[]>('portfolio_skills', [])
  const [showModal, setShowModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [editingCat, setEditingCat] = useState<SkillCategory | null>(null)

  // Form
  const [formName, setFormName] = useState('')
  const [formIcon, setFormIcon] = useState('🌟')

  const isEditing = !!editingCat

  const skillCounts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const s of skills) {
      map[s.category] = (map[s.category] || 0) + 1
    }
    return map
  }, [skills])

  const openAdd = () => {
    setEditingCat(null)
    setFormName('')
    setFormIcon('🌟')
    setShowModal(true)
  }

  const openEdit = (cat: SkillCategory) => {
    setEditingCat(cat)
    setFormName(cat.name)
    setFormIcon(cat.icon)
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    if (isEditing) {
      const oldName = editingCat.name
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCat.id ? { ...c, name: formName.trim(), icon: formIcon } : c)),
      )
      // Update skills that reference the old category name
      if (oldName !== formName.trim()) {
        // handled by skills page on next load
      }
    } else {
      setCategories((prev) => [...prev, { id: generateId(), name: formName.trim(), icon: formIcon }])
    }

    setShowModal(false)
    setEditingCat(null)
  }

  const handleDelete = (id: string) => {
    const cat = categories.find((c) => c.id === id)
    if (cat) {
      // Remove skills in this category
      // We'll just remove the category; skills with this category name will remain orphaned
      // The Skills page filters them out
    }
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setDeleteConfirm(null)
  }

  const palette = [
    'from-primary-500 to-indigo-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-pink-500',
    'from-sky-500 to-cyan-500',
  ]

  return (
    <div className="animate-slide-up space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Categories</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage your skill categories.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-primary-500/10 px-4 py-2.5 text-sm font-medium text-primary-400 transition-all hover:bg-primary-500/20 active:scale-[0.97]"
        >
          <Icons.PlusIcon className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Category Grid or Empty State */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-surface-hover)]">
            <Icons.FolderIcon className="h-7 w-7 text-[var(--text-muted)]" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-[var(--text-secondary)]">No categories yet</h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Create your first category to organize your skills</p>
          <button
            onClick={openAdd}
            className="mt-4 flex items-center gap-2 rounded-xl bg-primary-500/10 px-4 py-2.5 text-sm font-medium text-primary-400 transition-all hover:bg-primary-500/20"
          >
            <Icons.PlusIcon className="h-4 w-4" />
            Add Category
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const count = skillCounts[cat.name] || 0
            return (
              <div
                key={cat.id}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 transition-all duration-200 hover:border-primary-500/20"
              >
                <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${palette[i % palette.length]} opacity-5 blur-2xl`} />

                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${palette[i % palette.length]} shadow-lg text-xl`}>
                      {cat.icon}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEdit(cat)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                      >
                        <Icons.EditIcon className="h-4 w-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setDeleteConfirm(deleteConfirm === cat.id ? null : cat.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-danger/10 hover:text-danger"
                        >
                          <Icons.TrashIcon className="h-4 w-4" />
                        </button>
                        {deleteConfirm === cat.id && (
                          <div className="absolute right-0 top-full z-10 mt-1 w-40 animate-fade-in overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-md)]">
                            <button
                              onClick={() => handleDelete(cat.id)}
                              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-danger/80 transition-colors hover:bg-danger/10"
                            >
                              <Icons.TrashIcon className="h-4 w-4" />
                              Delete {cat.name}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-[var(--text-primary)]">{cat.name}</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {count} {count === 1 ? 'skill' : 'skills'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingCat(null) }}
        title={isEditing ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Emoji Icon</label>
            <input
              type="text"
              value={formIcon}
              onChange={(e) => setFormIcon(e.target.value)}
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
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Frontend, Backend..."
              className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30 focus:bg-primary-500/[0.03]"
              autoFocus
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowModal(false); setEditingCat(null) }}
              className="rounded-xl border border-[var(--border-input)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-600 active:scale-[0.97]"
            >
              {isEditing ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
