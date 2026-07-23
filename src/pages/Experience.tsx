import { useState, useMemo } from 'react'
import * as Icons from '../components/Icons'
import Modal from '../components/Modal'
import { useLocalStorage } from '../hooks/useLocalStorage'

export interface Experience {
  id: string
  company: string
  position: string
  description: string
  startDate: string
  endDate: string
  current: boolean
  location: string
  technologies: string[]
  logo?: string
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

const DEFAULT_EXPERIENCE: Experience[] = [
  {
    id: '1',
    company: 'Tech Corp',
    position: 'Senior Full Stack Developer',
    description: 'Led development of customer-facing web applications serving 50k+ users. Architected microservices migration and mentored junior developers.',
    startDate: '2022-03',
    endDate: '',
    current: true,
    location: 'Remote',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    id: '2',
    company: 'StartupXYZ',
    position: 'Full Stack Developer',
    description: 'Built and shipped the core product from MVP to production. Implemented real-time features with WebSockets and designed the REST API.',
    startDate: '2020-01',
    endDate: '2022-02',
    current: false,
    location: 'Nairobi, Kenya',
    technologies: ['React', 'Python', 'Django', 'Docker', 'Redis'],
  },
  {
    id: '3',
    company: 'Agency Co.',
    position: 'Junior Developer',
    description: 'Developed responsive websites and web applications for various clients. Collaborated with design team on UI/UX improvements.',
    startDate: '2018-06',
    endDate: '2019-12',
    current: false,
    location: 'Nairobi, Kenya',
    technologies: ['JavaScript', 'HTML/CSS', 'PHP', 'WordPress'],
  },
]

function formatDateRange(start: string, end: string, current: boolean) {
  const fmt = (d: string) => {
    if (!d) return ''
    const [y, m] = d.split('-')
    const date = new Date(Number(y), Number(m) - 1)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
  }
  return `${fmt(start)} — ${current ? 'Present' : fmt(end)}`
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useLocalStorage<Experience[]>('portfolio_experience', DEFAULT_EXPERIENCE)
  const [showModal, setShowModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [editing, setEditing] = useState<Experience | null>(null)

  // Form state
  const [formCompany, setFormCompany] = useState('')
  const [formPosition, setFormPosition] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formStart, setFormStart] = useState('')
  const [formEnd, setFormEnd] = useState('')
  const [formCurrent, setFormCurrent] = useState(false)
  const [formLocation, setFormLocation] = useState('')
  const [formTech, setFormTech] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')
  const [formLogo, setFormLogo] = useState('')

  const isEditing = !!editing

  // Sort: current first, then by start date descending
  const sorted = useMemo(
    () =>
      [...experiences].sort((a, b) => {
        if (a.current && !b.current) return -1
        if (!a.current && b.current) return 1
        return b.startDate.localeCompare(a.startDate)
      }),
    [experiences],
  )

  const openAdd = () => {
    setEditing(null)
    setFormCompany('')
    setFormPosition('')
    setFormDesc('')
    setFormStart('')
    setFormEnd('')
    setFormCurrent(false)
    setFormLocation('')
    setFormTech([])
    setTechInput('')
    setFormLogo('')
    setShowModal(true)
  }

  const openEdit = (exp: Experience) => {
    setEditing(exp)
    setFormCompany(exp.company)
    setFormPosition(exp.position)
    setFormDesc(exp.description)
    setFormStart(exp.startDate)
    setFormEnd(exp.endDate)
    setFormCurrent(exp.current)
    setFormLocation(exp.location)
    setFormTech([...exp.technologies])
    setFormLogo(exp.logo || '')
    setShowModal(true)
  }

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const val = techInput.trim()
    if ((e.key === 'Enter' || e.key === ',') && val && !formTech.includes(val)) {
      e.preventDefault()
      setFormTech((prev) => [...prev, val])
      setTechInput('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formCompany.trim() || !formPosition.trim()) return

    if (isEditing) {
      setExperiences((prev) =>
        prev.map((exp) =>
          exp.id === editing.id
            ? {
                ...exp,
                company: formCompany.trim(),
                position: formPosition.trim(),
                description: formDesc.trim(),
                startDate: formStart,
                endDate: formCurrent ? '' : formEnd,
                current: formCurrent,
                location: formLocation.trim(),
                technologies: formTech,
                logo: formLogo.trim() || undefined,
              }
            : exp,
        ),
      )
    } else {
      setExperiences((prev) => [
        {
          id: generateId(),
          company: formCompany.trim(),
          position: formPosition.trim(),
          description: formDesc.trim(),
          startDate: formStart,
          endDate: formCurrent ? '' : formEnd,
          current: formCurrent,
          location: formLocation.trim(),
          technologies: formTech,
          logo: formLogo.trim() || undefined,
        },
        ...prev,
      ])
    }

    setShowModal(false)
    setEditing(null)
  }

  const handleDelete = (id: string) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id))
    setDeleteConfirm(null)
  }

  return (
    <div className="animate-slide-up space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Experience</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage your work history and professional experience.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl bg-primary-500/10 px-4 py-2.5 text-sm font-medium text-primary-400 transition-all hover:bg-primary-500/20 active:scale-[0.97]"
        >
          <Icons.PlusIcon className="h-4 w-4" />
          Add Experience
        </button>
      </div>

      {/* Experience List */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-surface-hover)]">
            <Icons.BriefcaseIcon className="h-7 w-7 text-[var(--text-muted)]" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-[var(--text-secondary)]">No experience yet</h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Add your work experience to showcase your career</p>
          <button onClick={openAdd}
            className="mt-4 flex items-center gap-2 rounded-xl bg-primary-500/10 px-4 py-2.5 text-sm font-medium text-primary-400 transition-all hover:bg-primary-500/20">
            <Icons.PlusIcon className="h-4 w-4" />
            Add Experience
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((exp) => (
            <div
              key={exp.id}
              className="group relative rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 transition-all duration-200 hover:border-primary-500/20"
            >
              {/* Current badge */}
              {exp.current && (
                <div className="absolute right-5 top-5">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Current
                  </span>
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* Logo / initial */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/10 to-indigo-500/10 border border-[var(--border)]">
                  {exp.logo ? (
                    <img src={exp.logo} alt="" className="h-full w-full rounded-xl object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  ) : (
                    <span className="text-lg font-bold text-[var(--text-muted)]">{exp.company[0]}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-[var(--text-primary)]">{exp.position}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">{exp.company}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => openEdit(exp)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                      >
                        <Icons.EditIcon className="h-4 w-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setDeleteConfirm(deleteConfirm === exp.id ? null : exp.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-all hover:bg-danger/10 hover:text-danger"
                        >
                          <Icons.TrashIcon className="h-4 w-4" />
                        </button>
                        {deleteConfirm === exp.id && (
                          <div className="absolute right-0 top-full z-10 mt-1 w-44 animate-fade-in overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-md)]">
                            <button onClick={() => handleDelete(exp.id)}
                              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-danger/80 transition-colors hover:bg-danger/10">
                              <Icons.TrashIcon className="h-4 w-4" />
                              Delete {exp.position}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <Icons.CalendarIcon className="h-3.5 w-3.5" />
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </span>
                    {exp.location && (
                      <span className="flex items-center gap-1">
                        <Icons.MapPinIcon className="h-3.5 w-3.5" />
                        {exp.location}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {exp.description && (
                    <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">{exp.description}</p>
                  )}

                  {/* Technologies */}
                  {exp.technologies.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {exp.technologies.map((t) => (
                        <span key={t} className="rounded-lg bg-[var(--bg-surface-hover)] px-2 py-1 text-[11px] font-medium text-[var(--text-muted)]">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditing(null) }} title={isEditing ? 'Edit Experience' : 'Add Experience'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Company <span className="text-danger">*</span></label>
              <input type="text" value={formCompany} onChange={(e) => setFormCompany(e.target.value)} placeholder="e.g. Google, Tesla..."
                className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30" required />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Position <span className="text-danger">*</span></label>
              <input type="text" value={formPosition} onChange={(e) => setFormPosition(e.target.value)} placeholder="e.g. Senior Full Stack Developer"
                className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Location</label>
              <input type="text" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} placeholder="e.g. Remote"
                className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Logo URL</label>
              <input type="url" value={formLogo} onChange={(e) => setFormLogo(e.target.value)} placeholder="https://..."
                className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Start Date <span className="text-danger">*</span></label>
              <input type="month" value={formStart} onChange={(e) => setFormStart(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-primary-500/30" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">End Date</label>
              <input type="month" value={formEnd} onChange={(e) => setFormEnd(e.target.value)}
                disabled={formCurrent}
                className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-primary-500/30 disabled:opacity-30 disabled:cursor-not-allowed" />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2.5 rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-3 cursor-pointer transition-colors hover:bg-[var(--bg-surface-hover)]">
                <input type="checkbox" checked={formCurrent} onChange={(e) => setFormCurrent(e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--border-input)] bg-[var(--bg-input)] text-primary-500 focus:ring-primary-500" />
                <span className="text-sm text-[var(--text-primary)]">I currently work here</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Description</label>
            <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Describe your role and achievements..." rows={3}
              className="w-full resize-none rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Technologies</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formTech.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-lg bg-primary-500/10 px-2 py-1 text-[11px] font-medium text-primary-400">
                  {t}
                  <button type="button" onClick={() => setFormTech((prev) => prev.filter((x) => x !== t))} className="hover:text-primary-300"><Icons.CloseIcon className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={handleAddTech}
              placeholder="Type and press Enter to add..."
              className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); setEditing(null) }}
              className="rounded-xl border border-[var(--border-input)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)]">Cancel</button>
            <button type="submit"
              className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-600 active:scale-[0.97]">
              {isEditing ? 'Save Changes' : 'Add Experience'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
