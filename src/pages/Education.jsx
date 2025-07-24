import React, { useState, useEffect } from 'react';
import { fetchEducation, createEducation, updateEducation, deleteEducation } from '../api';

const initialForm = {
  degree: '',
  institution: '',
  description: '',
  start_date: '',
  end_date: '',
  current: false,
  gpa: '',
  order: 0,
  is_active: true,
};

const Education = () => {
  const [education, setEducation] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadEducation();
  }, []);

  const loadEducation = async () => {
    const data = await fetchEducation();
    setEducation(data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEdit = (edu) => {
    setEditId(edu.id);
    setShowForm(true);
    setForm({ ...edu });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    let res;
    if (editId) {
      res = await updateEducation(editId, form);
    } else {
      res = await createEducation(form);
    }
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setShowForm(false);
      setForm(initialForm);
      setEditId(null);
      setSuccess(editId ? 'Education updated!' : 'Education added!');
      loadEducation();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this education?')) return;
    await deleteEducation(id);
    loadEducation();
  };

  return (
    <div className="w-full max-w-5xl">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-700">Manage Education</h2>
      <button
        onClick={() => { setShowForm((v) => !v); setEditId(null); setForm(initialForm); }}
        className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded shadow-lg font-semibold"
      >
        {showForm ? 'Cancel' : 'Add Education'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl flex flex-col gap-4 mb-8 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="degree" value={form.degree} onChange={handleChange} placeholder="Degree" required className="border rounded px-3 py-2" />
            <input name="institution" value={form.institution} onChange={handleChange} placeholder="Institution" className="border rounded px-3 py-2" />
            <input name="gpa" value={form.gpa} onChange={handleChange} placeholder="GPA" className="border rounded px-3 py-2" />
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
            {loading ? (editId ? 'Updating...' : 'Saving...') : (editId ? 'Update Education' : 'Save Education')}
          </button>
        </form>
      )}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {education.map((edu) => (
          <li key={edu.id} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-6 flex flex-col gap-3 border border-blue-200 hover:shadow-2xl transition-shadow">
            <div className="font-bold text-xl text-blue-800">{edu.degree}</div>
            <div className="text-gray-700">{edu.institution}</div>
            <div className="text-sm text-gray-600">GPA: {edu.gpa}</div>
            <div className="text-xs text-gray-500">Active: {edu.is_active ? 'Yes' : 'No'}</div>
            <div className="text-xs text-gray-500">Current: {edu.current ? 'Yes' : 'No'}</div>
            <div className="text-xs text-gray-500">Start: {edu.start_date ? edu.start_date.split('T')[0] : ''} | End: {edu.end_date ? edu.end_date.split('T')[0] : ''}</div>
            <div className="text-gray-700">{edu.description}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(edu)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow">Edit</button>
              <button onClick={() => handleDelete(edu.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Education; 