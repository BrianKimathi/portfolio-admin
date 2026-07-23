import * as Icons from '../components/Icons'

export default function PersonalInfo() {
  return (
    <div className="animate-slide-up space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Personal Info</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Manage your profile and personal details.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-indigo-400 text-2xl font-bold text-white shadow-lg shadow-primary-500/20">
              BK
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">Brian Kimathi</h3>
            <p className="text-sm text-[var(--text-secondary)]">Full Stack Developer</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">brian@example.com</p>

            <div className="mt-6 flex justify-center gap-2">
              <button className="flex items-center gap-2 rounded-xl bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-400 transition-all hover:bg-primary-500/20">
                <Icons.EditIcon className="h-4 w-4" />
                Edit Photo
              </button>
            </div>
          </div>
        </div>

        {/* Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Basic Information</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)]">Full Name</label>
                <input type="text" defaultValue="Brian Kimathi"
                  className="mt-1.5 w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-primary-500/30 focus:bg-primary-500/[0.03]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)]">Email</label>
                <input type="email" defaultValue="brian@example.com"
                  className="mt-1.5 w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-primary-500/30 focus:bg-primary-500/[0.03]" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[var(--text-muted)]">Professional Title</label>
                <input type="text" defaultValue="Full Stack Developer & UI/UX Designer"
                  className="mt-1.5 w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-primary-500/30 focus:bg-primary-500/[0.03]" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[var(--text-muted)]">Bio / Description</label>
                <textarea rows={4}
                  defaultValue="Passionate full-stack developer with 5+ years of experience building modern web applications. Specializing in React, TypeScript, and Node.js with a keen eye for UI/UX design."
                  className="mt-1.5 w-full resize-none rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-primary-500/30 focus:bg-primary-500/[0.03]" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="rounded-xl border border-[var(--border-input)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)]">Cancel</button>
              <button className="rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-600">Save Changes</button>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Social Links</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)]">GitHub</label>
                <input type="text" defaultValue="github.com/briankimathi"
                  className="mt-1.5 w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-primary-500/30 focus:bg-primary-500/[0.03]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)]">LinkedIn</label>
                <input type="text" defaultValue="linkedin.com/in/briankimathi"
                  className="mt-1.5 w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-primary-500/30 focus:bg-primary-500/[0.03]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)]">Twitter / X</label>
                <input type="text" defaultValue="x.com/briankimathi"
                  className="mt-1.5 w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-primary-500/30 focus:bg-primary-500/[0.03]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)]">Website</label>
                <input type="text" defaultValue="briankimathi.dev"
                  className="mt-1.5 w-full rounded-xl border border-[var(--border-input)] bg-[var(--bg-input)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-primary-500/30 focus:bg-primary-500/[0.03]" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-600">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
