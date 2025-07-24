import React, { useEffect, useState } from 'react';
import { fetchStats } from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_projects: 0,
    total_skills: 0,
    total_education: 0,
    total_certifications: 0,
    total_contacts: 0,
    projects_by_month: [],
    skills_by_month: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="loading-spinner" />
        <div className="loading-text">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center text-white">
          <div className="text-3xl md:text-4xl font-bold">{stats.total_projects}</div>
          <div className="mt-2 font-semibold">Projects</div>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center text-white">
          <div className="text-3xl md:text-4xl font-bold">{stats.total_skills}</div>
          <div className="mt-2 font-semibold">Skills</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center text-white">
          <div className="text-3xl md:text-4xl font-bold">{stats.total_education}</div>
          <div className="mt-2 font-semibold">Education</div>
        </div>
        <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center text-white">
          <div className="text-3xl md:text-4xl font-bold">{stats.total_certifications}</div>
          <div className="mt-2 font-semibold">Certifications</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center text-white">
          <div className="text-3xl md:text-4xl font-bold">{stats.total_contacts}</div>
          <div className="mt-2 font-semibold">Contacts</div>
        </div>
      </div>
      <div className="bg-white rounded shadow p-2 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Growth Over Time</h2>
        {/* Simple SVG chart as a placeholder */}
        <svg viewBox="0 0 400 120" className="w-full h-32">
          {/* Projects line */}
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth="3"
            points={stats.projects_by_month.map((d, i) => `${i * 80},${100 - d.count * 10}`).join(' ')}
          />
          {/* Skills line */}
          <polyline
            fill="none"
            stroke="#16a34a"
            strokeWidth="3"
            points={stats.skills_by_month.map((d, i) => `${i * 80},${110 - d.count * 10}`).join(' ')}
          />
          {/* X-axis labels */}
          {stats.projects_by_month.map((d, i) => (
            <text key={i} x={i * 80} y={115} fontSize="12" textAnchor="middle">{d.month}</text>
          ))}
        </svg>
        <div className="flex gap-4 mt-4">
          <span className="flex items-center gap-2"><span className="w-4 h-1 bg-blue-600 inline-block" /> Projects</span>
          <span className="flex items-center gap-2"><span className="w-4 h-1 bg-green-600 inline-block" /> Skills</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 