import { useState, useMemo } from 'react'
import * as Icons from '../components/Icons'
import Modal from '../components/Modal'
import { useLocalStorage } from '../hooks/useLocalStorage'

/* ─── Types ─── */
export interface SkillCategory {
  id: string
  name: string
  icon: string
}

export interface Skill {
  id: string
  name: string
  category: string
  level: number
  image?: string
}

const DEFAULT_CATEGORIES: SkillCategory[] = [
  { id: 'fe', name: 'Frontend', icon: '⚛' },
  { id: 'be', name: 'Backend', icon: '⚙' },
  { id: 'devops', name: 'DevOps & Tools', icon: '🛠' },
  { id: 'design', name: 'Design', icon: '🎨' },
  { id: 'other', name: 'Other', icon: '📌' },
]

const DEFAULT_SKILLS: Skill[] = [
  { id: '1', name: 'React', category: 'Frontend', level: 95 },
  { id: '2', name: 'TypeScript', category: 'Frontend', level: 90 },
  { id: '3', name: 'Next.js', category: 'Frontend', level: 85 },
  { id: '4', name: 'Tailwind CSS', category: 'Frontend', level: 92 },
  { id: '5', name: 'HTML/CSS', category: 'Frontend', level: 95 },
  { id: '6', name: 'Node.js', category: 'Backend', level: 88 },
  { id: '7', name: 'Python', category: 'Backend', level: 82 },
  { id: '8', name: 'PostgreSQL', category: 'Backend', level: 78 },
  { id: '9', name: 'MongoDB', category: 'Backend', level: 75 },
  { id: '10', name: 'GraphQL', category: 'Backend', level: 72 },
  { id: '11', name: 'Docker', category: 'DevOps & Tools', level: 80 },
  { id: '12', name: 'Git', category: 'DevOps & Tools', level: 90 },
  { id: '13', name: 'AWS', category: 'DevOps & Tools', level: 76 },
  { id: '14', name: 'CI/CD', category: 'DevOps & Tools', level: 82 },
  { id: '15', name: 'Linux', category: 'DevOps & Tools', level: 78 },
]

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

const gradientPalette = [
  'from-primary-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-sky-500 to-cyan-500',
]

interface SkillsProps {
  categoryFilter?: string
  onClearFilter?: () => void
}

export default function Skills({ categoryFilter, onClearFilter }: SkillsProps) {
  const [skills, setSkills] = useLocalStorage<Skill[]>('portfolio_skills', DEFAULT_SKILLS)
  const [categories] = useLocalStorage<SkillCategory[]>('portfolio_categories', DEFAULT_CATEGORIES)

  /* ─── UI State ─── */
  const [showAddModal, setShowAddModal] = useState(false)
  const [detailSkill, setDetailSkill] = useState<Skill | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)

  /* ─── Add/Edit Skill Form ─── */
  const [formName, setFormName] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formLevel, setFormLevel] = useState(50)
  const [formImage, setFormImage] = useState('')

  const isEditing = !!editingSkill

  /* ─── Manage Categories — handled via sidebar ─── */

  const filtered = useMemo(
    () => (categoryFilter ? skills.filter((s) => s.category === categoryFilter) : skills),
    [skills, categoryFilter],
  )

  const grouped = useMemo(() => {
    const map = new Map<string, Skill[]>()
    for (const s of filtered) {
      if (!map.has(s.category)) map.set(s.category, [])
      map.get(s.category)!.push(s)
    }
    return Array.from(map.entries())
  }, [filtered])

  /* ─── Resets ─── */
  const resetAddForm = () => {
    setFormName('')
    setFormCategory(categories[0]?.name || '')
    setFormLevel(50)
    setFormImage('')
    setEditingSkill(null)
  }

  const openAddModal = () => {
    resetAddForm()
    setShowAddModal(true)
  }

  const openEditModal = (skill: Skill) => {
    setEditingSkill(skill)
    setFormName(skill.name)
    setFormCategory(skill.category)
    setFormLevel(skill.level)
    setFormImage(skill.image || '')
    setShowAddModal(true)
    setDetailSkill(null)
  }

  /* ─── Handlers ─── */
  const handleSubmitSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formCategory) return

    if (isEditing) {
      setSkills((prev) =>
        prev.map((s) =>
          s.id === editingSkill.id
            ? { ...s, name: formName.trim(), category: formCategory, level: formLevel, image: formImage.trim() || undefined }
            : s
        )
      )
    } else {
      const skill: Skill = { id: generateId(), name: formName.trim(), category: formCategory, level: formLevel, image: formImage.trim() || undefined }
      setSkills((prev) => [...prev, skill])
    }

    setShowAddModal(false)
    setEditingSkill(null)
  }

  const handleDeleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id))
    setDeleteConfirm(null)
    setDetailSkill(null)
  }

  return (
    <div className="animate-slide-up space-y-6">
      {/* ─── Header ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Skills</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {categoryFilter
              ? `Showing skills in "${categoryFilter}"`
              : 'Manage your technical skills and proficiencies.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={openAddModal}
            className="flex items-center gap-2 rounded-xl bg-primary-500/10 px-4 py-2.5 text-sm font-medium text-primary-400 transition-all hover:bg-primary-500/20 active:scale-[0.97]">
            <Icons.PlusIcon className="h-4 w-4" />
            Add Skill
          </button>
        </div>
      </div>

      {/* Filter chip */}
      {categoryFilter && onClearFilter && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">Filtered by:</span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary-500/10 px-3 py-1.5 text-sm font-medium text-primary-400">
            {categories.find(c => c.name === categoryFilter)?.icon || '📌'} {categoryFilter}
            <button onClick={onClearFilter} className="hover:text-primary-300"><Icons.CloseIcon className="h-3.5 w-3.5" /></button>
          </span>
        </div>
      )}

      {/* ─── Skills Grid ─── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-surface-hover)]">
            <Icons.SkillsIcon className="h-7 w-7 text-[var(--text-muted)]" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-[var(--text-secondary)]">
            {categoryFilter ? `No skills in "${categoryFilter}"` : 'No skills yet'}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {categoryFilter ? 'Try a different category or' : 'Add your first skill to get started'}
          </p>
          <div className="flex gap-2 mt-4">
            {categoryFilter && onClearFilter && (
              <button onClick={onClearFilter}
                className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)]">View All</button>
            )}
            <button onClick={openAddModal}
              className="flex items-center gap-2 rounded-xl bg-primary-500/10 px-4 py-2.5 text-sm font-medium text-primary-400 transition-all hover:bg-primary-500/20">
              <Icons.PlusIcon className="h-4 w-4" /> Add Skill
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {grouped.map(([category, catSkills], ci) => (
            <div key={category} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 transition-all duration-200 hover:border-primary-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${gradientPalette[ci % gradientPalette.length]} shadow-lg`}>
                  <span className="text-sm">{categories.find((c) => c.name === category)?.icon || '📌'}</span>
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{category}</h3>
                <span className="text-xs text-[var(--text-muted)] ml-auto">{catSkills.length}</span>
              </div>
              <div className="space-y-0.5">
                {catSkills.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => setDetailSkill(skill)}
                    className="group/skill relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-[var(--bg-surface-hover)]"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradientPalette[ci % gradientPalette.length]}`}>
                      {skill.image ? (
                        <img src={skill.image} alt="" className="h-full w-full rounded-lg object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-white">{skill.name[0]}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--text-primary)] truncate">{skill.name}</span>
                        <span className="text-xs text-[var(--text-muted)] shrink-0 ml-2">{skill.level}%</span>
                      </div>
                      <div className="mt-1 h-1 overflow-hidden rounded-full bg-[var(--bg-surface-hover)]">
                        <div className={`h-full rounded-full bg-gradient-to-r ${gradientPalette[ci % gradientPalette.length]} transition-all duration-500`}
                          style={{ width: `${skill.level}%` }} />
                      </div>
                    </div>
                    <div className="shrink-0 opacity-0 group-hover/skill:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <button onClick={(e) => { e.stopPropagation(); setDeleteConfirm(deleteConfirm === skill.id ? null : skill.id) }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-danger/70">
                        <Icons.CloseIcon className="h-3.5 w-3.5" />
                      </button>
                      {deleteConfirm === skill.id && (
                        <div className="absolute right-0 top-full z-10 mt-1 animate-fade-in overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-md)]">
                          <button onClick={() => openEditModal(skill)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)]">
                            <Icons.EditIcon className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button onClick={() => handleDeleteSkill(skill.id)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger/80 whitespace-nowrap transition-colors hover:bg-danger/10">
                            <Icons.TrashIcon className="h-3.5 w-3.5" /> Delete {skill.name}
                          </button>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ Add / Edit Skill Modal ═══ */}
      <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); setEditingSkill(null) }} title={isEditing ? 'Edit Skill' : 'Add Skill'}>
        <form onSubmit={handleSubmitSkill} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Skill Name <span className="text-danger">*</span></label>
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. React, Docker, Figma..."
              className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30 focus:bg-primary-500/[0.03]" autoFocus required />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Category <span className="text-danger">*</span></label>
            <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-primary-500/30 focus:bg-primary-500/[0.03]">
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Proficiency: <span className="text-[var(--text-primary)]">{formLevel}%</span></label>
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-muted)]">0</span>
              <input type="range" min={0} max={100} value={formLevel} onChange={(e) => setFormLevel(Number(e.target.value))}
                className="flex-1 h-1.5 appearance-none rounded-full bg-[var(--bg-surface-hover)] outline-none
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500
                  [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-500/30 [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-primary-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer" />
              <span className="text-xs text-[var(--text-muted)]">100</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--bg-surface-hover)]">
              <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-200" style={{ width: `${formLevel}%` }} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Image URL (optional)</label>
            <input type="url" value={formImage} onChange={(e) => setFormImage(e.target.value)} placeholder="https://example.com/skill-icon.png"
              className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30 focus:bg-primary-500/[0.03]" />
            {formImage && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-[var(--bg-surface-hover)] p-2">
                <img src={formImage} alt="" className="h-8 w-8 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                <span className="text-xs text-[var(--text-muted)]">Preview</span>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowAddModal(false); setEditingSkill(null) }}
              className="rounded-xl border border-[var(--border-input)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)]">Cancel</button>
            <button type="submit"
              className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-600 active:scale-[0.97]">
              {isEditing ? 'Save Changes' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ═══ Skill Detail Modal ═══ */}
      <Modal isOpen={!!detailSkill && !showAddModal} onClose={() => setDetailSkill(null)} title={detailSkill?.name || 'Skill Details'}>
        {detailSkill && (() => {
          const cat = categories.find((c) => c.name === detailSkill.category)
          const ci = categories.findIndex((c) => c.name === detailSkill.category)
          const grad = gradientPalette[Math.max(0, ci) % gradientPalette.length]
          return (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${grad} shadow-lg`}>
                  {detailSkill.image ? (
                    <img src={detailSkill.image} alt="" className="h-full w-full rounded-2xl object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-white">{detailSkill.name[0]}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">{detailSkill.name}</h3>
                  <span className="text-sm text-[var(--text-secondary)]">{cat?.icon || '📌'} {detailSkill.category}</span>
                </div>
              </div>
              {detailSkill.image && (
                <div className="overflow-hidden rounded-xl border border-[var(--border)]">
                  <img src={detailSkill.image} alt={detailSkill.name} className="max-h-64 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
              )}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-[var(--text-primary)]">Proficiency</span>
                  <span className="text-sm text-[var(--text-secondary)]">{detailSkill.level}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-surface-hover)]">
                  <div className={`h-full rounded-full bg-gradient-to-r ${grad} transition-all duration-500`} style={{ width: `${detailSkill.level}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                <div className="flex gap-2">
                  <button onClick={() => handleDeleteSkill(detailSkill.id)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-danger/70 transition-colors hover:bg-danger/10 hover:text-danger">
                    <Icons.TrashIcon className="h-4 w-4" /> Delete
                  </button>
                  <button onClick={() => openEditModal(detailSkill)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]">
                    <Icons.EditIcon className="h-4 w-4" /> Edit
                  </button>
                </div>
                <button onClick={() => setDetailSkill(null)}
                  className="rounded-lg bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-400 transition-colors hover:bg-primary-500/20">Close</button>
              </div>
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}
