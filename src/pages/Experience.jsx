import React, { useState, useEffect } from 'react';
import { fetchExperience, createExperience, updateExperience, deleteExperience } from '../api';

const initialForm = {
  title: '',
  company: '',
  description: '',
  start_date: '',
  end_date: '',
  current: false,
  location: '',
  order: 0,
  is_active: true,
};

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadExperience();
  }, []);

  const loadExperience = async () => {
    const data = await fetchExperience();
    setExperience(data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEdit = (exp) => {
    setEditId(exp.id);
    setShowForm(true);
    setForm({ ...exp });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    let res;
    if (editId) {
      res = await updateExperience(editId, form);
    } else {
      res = await createExperience(form);
    }
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setShowForm(false);
      setForm(initialForm);
      setEditId(null);
      setSuccess(editId ? 'Experience updated!' : 'Experience added!');
      loadExperience();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    await deleteExperience(id);
    loadExperience();
  };

  return (
    <div className="w-full max-w-5xl">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-700">Manage Experience</h2>
      <button
        onClick={() => { setShowForm((v) => !v); setEditId(null); setForm(initialForm); }}
        className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded shadow-lg font-semibold"
      >
        {showForm ? 'Cancel' : 'Add Experience'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl flex flex-col gap-4 mb-8 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="border rounded px-3 py-2" />
            <input name="company" value={form.company} onChange={handleChange} placeholder="Company" className="border rounded px-3 py-2" />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="border rounded px-3 py-2" />
            <input type="number" name="order" value={form.order} onChange={handleChange} placeholder="Order" className="border rounded px-3 py-2 w-full" />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="current" checked={form.current} onChange={handleChange} /> Current
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} /> Active
            </label>
            <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="border rounded px-3 py-2" />
            <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="border rounded px-3 py-2" />
          </div>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="border rounded px-3 py-2" />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button type="submit" disabled={loading} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 rounded shadow-lg">
            {loading ? (editId ? 'Updating...' : 'Saving...') : (editId ? 'Update Experience' : 'Save Experience')}
          </button>
        </form>
      )}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experience.map((exp) => (
          <li key={exp.id} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-6 flex flex-col gap-3 border border-blue-200 hover:shadow-2xl transition-shadow">
            <div className="font-bold text-xl text-blue-800">{exp.title}</div>
            <div className="text-gray-700">{exp.company}</div>
            <div className="text-sm text-gray-600">{exp.location}</div>
            <div className="text-xs text-gray-500">Active: {exp.is_active ? 'Yes' : 'No'}</div>
            <div className="text-xs text-gray-500">Current: {exp.current ? 'Yes' : 'No'}</div>
            <div className="text-xs text-gray-500">Start: {exp.start_date ? exp.start_date.split('T')[0] : ''} | End: {exp.end_date ? exp.end_date.split('T')[0] : ''}</div>
            <div className="text-gray-700">{exp.description}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(exp)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow">Edit</button>
              <button onClick={() => handleDelete(exp.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Experience; 