import { useRef, useEffect, type ReactNode } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

interface LayoutProps {
  children: ReactNode
  sidebarOpen: boolean
  onToggleSidebar: () => void
  onCloseSidebar: () => void
  activeSection: string
  onNavigate: (id: string) => void
  onCategoryFilter?: (category: string) => void
  darkMode: boolean
  onToggleDark: () => void
  onLogout: () => void
}

export default function Layout({
  children,
  sidebarOpen,
  onToggleSidebar,
  onCloseSidebar,
  activeSection,
  onNavigate,
  onCategoryFilter,
  darkMode,
  onToggleDark,
  onLogout,
}: LayoutProps) {
  const mainRef = useRef<HTMLElement>(null)

  // Reset scroll position on page change
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
  }, [activeSection])

  return (
    <div className="flex min-h-screen bg-[var(--bg-body)] text-[var(--text-secondary)]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={onCloseSidebar}
        activeSection={activeSection}
        onNavigate={onNavigate}
        onCategoryFilter={onCategoryFilter}
        onLogout={onLogout}
      />

      <div className="flex flex-1 flex-col lg:pl-64">
        <Navbar
          onToggleSidebar={onToggleSidebar}
          darkMode={darkMode}
          onToggleDark={onToggleDark}
          activeSection={activeSection}
          onLogout={onLogout}
        />

        <main ref={mainRef} className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  )
}
