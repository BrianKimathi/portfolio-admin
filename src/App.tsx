import { useState, useEffect, useCallback } from 'react'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Skills from './pages/Skills'
import Categories from './pages/Categories'
import Contacts from './pages/Contacts'
import Messages from './pages/Messages'
import PersonalInfo from './pages/PersonalInfo'

interface Props {
  categoryFilter?: string
  onClearCategoryFilter?: () => void
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('portfolio_logged_in') === 'true')
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('portfolio_dark_mode')
    return saved !== null ? saved === 'true' : true
  })
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('portfolio_dark_mode', String(darkMode))
  }, [darkMode])

  const handleLogin = useCallback(() => {
    localStorage.setItem('portfolio_logged_in', 'true')
    setLoggedIn(true)
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('portfolio_logged_in')
    localStorage.removeItem('portfolio_dark_mode')
    setLoggedIn(false)
    setActiveSection('dashboard')
  }, [])

  const handleNavigate = (section: string) => {
    setActiveSection(section)
    if (section !== 'skills') setCategoryFilter(undefined)
  }

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />
  }

  const pageProps: Props = {
    categoryFilter,
    onClearCategoryFilter: () => setCategoryFilter(undefined),
  }

  const pages: Record<string, (props?: Props) => React.ReactNode> = {
    dashboard: () => <Dashboard />,
    projects: () => <Projects />,
    skills: (p) => <Skills categoryFilter={p?.categoryFilter} onClearFilter={p?.onClearCategoryFilter} />,
    categories: () => <Categories />,
    contacts: () => <Contacts />,
    messages: () => <Messages />,
    personal: () => <PersonalInfo />,
  }

  const renderPage = pages[activeSection]

  return (
    <Layout
      sidebarOpen={sidebarOpen}
      onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      onCloseSidebar={() => setSidebarOpen(false)}
      activeSection={activeSection}
      onNavigate={handleNavigate}
      onCategoryFilter={setCategoryFilter}
      darkMode={darkMode}
      onToggleDark={() => setDarkMode((prev) => !prev)}
      onLogout={handleLogout}
    >
      {renderPage ? renderPage(pageProps) : <Dashboard />}
    </Layout>
  )
}
