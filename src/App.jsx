import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfileEdit from './pages/ProfileEdit';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Experience from './pages/Experience';
import Education from './pages/Education';
import Contacts from './pages/Contacts';
import Certifications from './pages/Certifications';

const Sidebar = ({ setPage }) => (
  <nav className="flex flex-col gap-2 bg-gradient-to-b from-blue-900 to-indigo-900 text-white w-52 min-h-screen p-4 md:p-6 shadow-2xl rounded-r-3xl border-r border-blue-200">
    <button className="py-2 px-4 rounded-lg hover:bg-blue-800 text-left transition" onClick={() => setPage('dashboard')}>Dashboard</button>
    <button className="py-2 px-4 rounded-lg hover:bg-blue-800 text-left transition" onClick={() => setPage('profile')}>Profile</button>
    <button className="py-2 px-4 rounded-lg hover:bg-blue-800 text-left transition" onClick={() => setPage('projects')}>Projects</button>
    <button className="py-2 px-4 rounded-lg hover:bg-blue-800 text-left transition" onClick={() => setPage('skills')}>Skills</button>
    <button className="py-2 px-4 rounded-lg hover:bg-blue-800 text-left transition" onClick={() => setPage('experience')}>Experience</button>
    <button className="py-2 px-4 rounded-lg hover:bg-blue-800 text-left transition" onClick={() => setPage('education')}>Education</button>
    <button className="py-2 px-4 rounded-lg hover:bg-blue-800 text-left transition" onClick={() => setPage('certifications')}>Certifications</button>
    <button className="py-2 px-4 rounded-lg hover:bg-blue-800 text-left transition" onClick={() => setPage('contacts')}>Contacts</button>
  </nav>
);

const Navbar = ({ onLogout }) => (
  <header className="flex items-center justify-between bg-white shadow px-4 md:px-6 py-4 border-b">
    <div className="text-xl font-bold text-blue-800 tracking-wide">Portfolio Admin</div>
    <button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg shadow font-semibold" onClick={onLogout}>Logout</button>
  </header>
);

const Main = () => {
  const { user, login, logout } = useAuth();
  const [page, setPage] = useState('dashboard');

  if (!user) return <Login onLogin={login} />;

  let content;
  switch (page) {
    case 'profile':
      content = <ProfileEdit />;
      break;
    case 'projects':
      content = <Projects />;
      break;
    case 'skills':
      content = <Skills />;
      break;
    case 'experience':
      content = <Experience />;
      break;
    case 'education':
      content = <Education />;
      break;
    case 'certifications':
      content = <Certifications />;
      break;
    case 'contacts':
      content = <Contacts />;
      break;
    default:
      content = <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Navbar onLogout={logout} />
      <div className="flex flex-1">
        <Sidebar setPage={setPage} />
        <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 overflow-y-auto transition-all duration-300 max-w-full">{content}</main>
      </div>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Main />
  </AuthProvider>
);

export default App;
