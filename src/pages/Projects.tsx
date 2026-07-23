import { useState } from 'react'
import * as Icons from '../components/Icons'
import Modal from '../components/Modal'
import { useLocalStorage } from '../hooks/useLocalStorage'

export interface Project {
  id: string
  title: string
  description: string
  status: 'Draft' | 'In Progress' | 'Published'
  tech: string[]
  liveUrl?: string
  repoUrl?: string
  updatedAt: string
}

const statusColors: Record<string, string> = {
  Published: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  Draft: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'In Progress': 'bg-primary-500/15 text-primary-400 border-primary-500/20',
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function formatDate(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs < 24) return `${hrs}h ago`
  if (days < 30) return `${days}d ago`
  return date.toLocaleDateString()
}

const defaultProjects: Project[] = [
  { id: '1', title: 'Portfolio Website', description: 'Personal portfolio built with React, TypeScript, and Tailwind CSS.', status: 'Published', tech: ['React', 'TypeScript', 'Tailwind'], liveUrl: 'https://briankimathi.dev', updatedAt: new Date(Date.now() - 172800000).toISOString() },
  { id: '2', title: 'E-commerce App', description: 'Full-stack e-commerce platform with Stripe integration.', status: 'Draft', tech: ['Next.js', 'Stripe', 'Prisma', 'PostgreSQL'], updatedAt: new Date(Date.now() - 604800000).toISOString() },
  { id: '3', title: 'Task Manager', description: 'Kanban-style task management with real-time collaboration.', status: 'Published', tech: ['React', 'Node.js', 'MongoDB', 'Socket.io'], updatedAt: new Date(Date.now() - 1814400000).toISOString() },
]

export default function Projects() {
  const [projects, setProjects] = useLocalStorage<Project[]>('portfolio_projects', defaultProjects)
  const [showModal, setShowModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [detailProject, setDetailProject] = useState<Project | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formStatus, setFormStatus] = useState<Project['status']>('Draft')
  const [formTech, setFormTech] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')
  const [formLiveUrl, setFormLiveUrl] = useState('')
  const [formRepoUrl, setFormRepoUrl] = useState('')

  const isEditing = !!editingProject

  const openAddModal = () => {
    setEditingProject(null)
    setFormTitle('')
    setFormDesc('')
    setFormStatus('Draft')
    setFormTech([])
    setTechInput('')
    setFormLiveUrl('')
    setFormRepoUrl('')
    setShowModal(true)
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setFormTitle(project.title)
    setFormDesc(project.description)
    setFormStatus(project.status)
    setFormTech([...project.tech])
    setFormLiveUrl(project.liveUrl || '')
    setFormRepoUrl(project.repoUrl || '')
    setTechInput('')
    setShowModal(true)
    setDetailProject(null)
  }

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const val = techInput.trim()
    if ((e.key === 'Enter' || e.key === ',') && val && !formTech.includes(val)) {
      e.preventDefault()
      setFormTech((prev) => [...prev, val])
      setTechInput('')
    }
  }
  const removeTech = (tech: string) => setFormTech((prev) => prev.filter((t) => t !== tech))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return

    if (isEditing) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProject.id
            ? { ...p, title: formTitle.trim(), description: formDesc.trim(), status: formStatus, tech: formTech, liveUrl: formLiveUrl.trim() || undefined, repoUrl: formRepoUrl.trim() || undefined, updatedAt: new Date().toISOString() }
            : p
        )
      )
    } else {
      const newProject: Project = {
        id: generateId(),
        title: formTitle.trim(),
        description: formDesc.trim(),
        status: formStatus,
        tech: formTech,
        liveUrl: formLiveUrl.trim() || undefined,
        repoUrl: formRepoUrl.trim() || undefined,
        updatedAt: new Date().toISOString(),
      }
      setProjects((prev) => [newProject, ...prev])
    }

    setShowModal(false)
    setEditingProject(null)
  }

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setDeleteConfirm(null)
    setDetailProject(null)
  }

  return (
    <div className="animate-slide-up space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Projects</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage your portfolio projects.</p>
        </div>
        <button onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-primary-500/10 px-4 py-2.5 text-sm font-medium text-primary-400 transition-all hover:bg-primary-500/20 active:scale-[0.97]">
          <Icons.PlusIcon className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--bg-surface-hover)]">
            <Icons.ProjectsIcon className="h-7 w-7 text-[var(--text-muted)]" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-[var(--text-secondary)]">No projects yet</h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Add your first project to get started</p>
          <button onClick={openAddModal}
            className="mt-4 flex items-center gap-2 rounded-xl bg-primary-500/10 px-4 py-2.5 text-sm font-medium text-primary-400 transition-all hover:bg-primary-500/20">
            <Icons.PlusIcon className="h-4 w-4" />
            Add Project
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setDetailProject(project)}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 text-left transition-all duration-200 hover:border-primary-500/20 hover:shadow-lg hover:shadow-primary-500/5"
            >
              <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-br from-primary-500/5 to-indigo-500/5 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-[var(--text-primary)] truncate group-hover:text-primary-400 transition-colors">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">{project.description}</p>
                    )}
                    <span className={`mt-2.5 inline-flex rounded-lg border px-2.5 py-0.5 text-[11px] font-medium ${statusColors[project.status] || ''}`}>
                      {project.status}
                    </span>
                  </div>
                  {/* Dropdown */}
                  <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(deleteConfirm === project.id ? null : project.id) }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]">
                      <Icons.MoreVerticalIcon className="h-4 w-4" />
                    </button>
                    {deleteConfirm === project.id && (
                      <div className="absolute right-0 top-full z-10 mt-1 w-36 animate-fade-in overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-[var(--shadow-md)]">
                        <button onClick={() => openEditModal(project)}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)]">
                          <Icons.EditIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button onClick={() => handleDelete(project.id)}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-danger/80 transition-colors hover:bg-danger/10">
                          <Icons.TrashIcon className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span key={t} className="rounded-lg bg-[var(--bg-surface-hover)] px-2 py-1 text-[11px] font-medium text-[var(--text-muted)]">{t}</span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-[var(--text-muted)]">{formatDate(new Date(project.updatedAt))}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingProject(null) }} title={isEditing ? 'Edit Project' : 'Add Project'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Project Title <span className="text-danger">*</span></label>
            <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. My Awesome Project"
              className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30 focus:bg-primary-500/[0.03]" autoFocus required />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Description</label>
            <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Briefly describe the project..." rows={3}
              className="w-full resize-none rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30 focus:bg-primary-500/[0.03]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Status</label>
              <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as Project['status'])}
                className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-primary-500/30 focus:bg-primary-500/[0.03]">
                <option value="Draft">Draft</option>
                <option value="In Progress">In Progress</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Live URL</label>
              <input type="url" value={formLiveUrl} onChange={(e) => setFormLiveUrl(e.target.value)} placeholder="https://..."
                className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30 focus:bg-primary-500/[0.03]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Repository URL</label>
            <input type="url" value={formRepoUrl} onChange={(e) => setFormRepoUrl(e.target.value)} placeholder="https://github.com/..."
              className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30 focus:bg-primary-500/[0.03]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Technologies</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formTech.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 rounded-lg bg-primary-500/10 px-2 py-1 text-[11px] font-medium text-primary-400">
                  {t}
                  <button type="button" onClick={() => removeTech(t)} className="hover:text-primary-300"><Icons.CloseIcon className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
            <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={handleAddTech}
              placeholder="Type and press Enter to add..."
              className="w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-primary-500/30 focus:bg-primary-500/[0.03]" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); setEditingProject(null) }}
              className="rounded-xl border border-[var(--border-input)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)]">Cancel</button>
            <button type="submit"
              className="rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-600 active:scale-[0.97]">
              {isEditing ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!detailProject && !showModal} onClose={() => setDetailProject(null)} title={detailProject?.title || 'Project Details'}>
        {detailProject && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className={`inline-flex rounded-lg border px-2.5 py-0.5 text-xs font-medium ${statusColors[detailProject.status] || ''}`}>
                {detailProject.status}
              </span>
              <span className="text-xs text-[var(--text-muted)]">Updated {formatDate(new Date(detailProject.updatedAt))}</span>
            </div>
            <div>
              <p className="text-sm text-[var(--text-primary)] font-medium mb-1">Description</p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {detailProject.description || 'No description provided.'}
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-primary)] font-medium mb-2">Technologies</p>
              <div className="flex flex-wrap gap-1.5">
                {detailProject.tech.map((t) => (
                  <span key={t} className="rounded-lg bg-primary-500/10 px-2.5 py-1.5 text-xs font-medium text-primary-400">{t}</span>
                ))}
                {detailProject.tech.length === 0 && <span className="text-sm text-[var(--text-muted)]">None listed</span>}
              </div>
            </div>
            {(detailProject.liveUrl || detailProject.repoUrl) && (
              <div className="space-y-2">
                <p className="text-sm text-[var(--text-primary)] font-medium">Links</p>
                <div className="flex flex-wrap gap-2">
                  {detailProject.liveUrl && (
                    <a href={detailProject.liveUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20">
                      <Icons.GlobeIcon className="h-3.5 w-3.5" /> Live Site
                    </a>
                  )}
                  {detailProject.repoUrl && (
                    <a href={detailProject.repoUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-primary-500/10 px-3 py-2 text-xs font-medium text-primary-400 transition-colors hover:bg-primary-500/20">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/></svg>
                      Repository
                    </a>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
              <div className="flex gap-2">
                <button onClick={() => handleDelete(detailProject.id)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-danger/70 transition-colors hover:bg-danger/10 hover:text-danger">
                  <Icons.TrashIcon className="h-4 w-4" /> Delete
                </button>
                <button onClick={() => openEditModal(detailProject)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]">
                  <Icons.EditIcon className="h-4 w-4" /> Edit
                </button>
              </div>
              <button onClick={() => setDetailProject(null)}
                className="rounded-lg bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-400 transition-colors hover:bg-primary-500/20">Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
