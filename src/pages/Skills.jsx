import React, { useState, useEffect } from 'react';
import { fetchSkills, createSkill, updateSkill, deleteSkill } from '../api';

const initialForm = {
  name: '',
  icon: '',
  proficiency: '',
  category: '',
  order: 0,
  is_active: true,
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSkills = async () => {
    setLoading(true);
    try {
      const data = await fetchSkills();
      setSkills(data);
    } catch (err) {
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="loading-spinner" />
        <div className="loading-text">Loading skills...</div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEdit = (skill) => {
    setEditId(skill.id);
    setShowForm(true);
    setForm({ ...skill });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    let res;
    if (editId) {
      res = await updateSkill(editId, form);
    } else {
      res = await createSkill(form);
    }
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setShowForm(false);
      setForm(initialForm);
      setEditId(null);
      setSuccess(editId ? 'Skill updated!' : 'Skill added!');
      loadSkills();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    await deleteSkill(id);
    loadSkills();
  };

  return (
    <div className="w-full max-w-5xl">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-700">Manage Skills</h2>
      <button
        onClick={() => { setShowForm((v) => !v); setEditId(null); setForm(initialForm); }}
        className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded shadow-lg font-semibold"
      >
        {showForm ? 'Cancel' : 'Add Skill'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl flex flex-col gap-4 mb-8 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Skill Name" required className="border rounded px-3 py-2" />
            <input name="icon" value={form.icon} onChange={handleChange} placeholder="Icon URL or class" className="border rounded px-3 py-2" />
            <input name="proficiency" value={form.proficiency} onChange={handleChange} placeholder="Proficiency (e.g. Beginner, Intermediate, Expert)" className="border rounded px-3 py-2" />
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border rounded px-3 py-2" />
            <input type="number" name="order" value={form.order} onChange={handleChange} placeholder="Order" className="border rounded px-3 py-2 w-full" />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} /> Active
            </label>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button type="submit" disabled={loading} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 rounded shadow-lg">
            {loading ? (editId ? 'Updating...' : 'Saving...') : (editId ? 'Update Skill' : 'Save Skill')}
          </button>
        </form>
      )}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <li key={skill.id} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-6 flex flex-col gap-3 border border-blue-200 hover:shadow-2xl transition-shadow">
            <div className="font-bold text-xl text-blue-800">{skill.name}</div>
            <div className="text-gray-700">Category: {skill.category}</div>
            <div className="text-sm text-gray-600">Proficiency: {skill.proficiency}</div>
            <div className="text-xs text-gray-500">Active: {skill.is_active ? 'Yes' : 'No'}</div>
            <div className="text-xs text-gray-500">Order: {skill.order}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(skill)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow">Edit</button>
              <button onClick={() => handleDelete(skill.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Skills; 