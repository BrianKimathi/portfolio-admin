import * as Icons from '../components/Icons'

const contacts = [
  { name: 'Sarah Johnson', email: 'sarah@example.com', subject: 'Freelance Project Inquiry', date: '2h ago', read: false },
  { name: 'Alex Martinez', email: 'alex@example.com', subject: 'Collaboration Opportunity', date: '5h ago', read: false },
  { name: 'Emily Chen', email: 'emily@example.com', subject: 'Website Redesign', date: '1d ago', read: true },
  { name: 'Michael Brown', email: 'michael@example.com', subject: 'Job Opening', date: '2d ago', read: true },
  { name: 'Jessica Williams', email: 'jessica@example.com', subject: 'Speaking Event', date: '3d ago', read: true },
]

export default function Contacts() {
  return (
    <div className="animate-slide-up space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Contacts</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">People who have reached out to you.</p>
        </div>
        <button className="rounded-xl bg-[var(--bg-surface-hover)] px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]">
          <Icons.MailIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
        <div className="divide-y divide-[var(--border)]">
          {contacts.map((contact) => (
            <div
              key={contact.email}
              className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--bg-surface-hover)] ${!contact.read ? 'bg-primary-500/[0.02]' : ''}`}
            >
              <div className={`h-2 w-2 shrink-0 rounded-full ${!contact.read ? 'bg-primary-400' : 'bg-transparent'}`} />
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-indigo-400 text-sm font-bold text-white">
                {contact.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${!contact.read ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                    {contact.name}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">{contact.date}</span>
                </div>
                <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{contact.subject}</p>
                <p className="text-xs text-[var(--text-muted)]">{contact.email}</p>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]">
                <Icons.ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
