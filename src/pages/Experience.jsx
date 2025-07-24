import React, { useState, useEffect } from 'react';
import { fetchExperience, createExperience, updateExperience, deleteExperience } from '../api';
import { fetchReferences, createReference, updateReference, deleteReference } from '../api';

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

const initialReferee = { name: '', email: '', phone: '', note: '' };

const ReferenceForm = ({ expId, onSaved, reference, onCancel }) => {
  const [form, setForm] = useState(reference || { name: '', email: '', phone: '', note: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    let res;
    if (reference && reference.id) {
      res = await updateReference(reference.id, form);
    } else {
      res = await createReference(expId, form);
    }
    setLoading(false);
    if (res.error) setError(res.error);
    else onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4 mb-4 border border-blue-100 transition-all duration-300 hover:shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter name"
            required
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">Phone</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-1">Note</label>
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Enter note"
          className="border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
        />
      </div>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <div className="flex gap-3 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refForms, setRefForms] = useState({});
  const [refs, setRefs] = useState({});
  const [referee, setReferee] = useState(initialReferee);

    const loadExperience = async () => {
      setLoading(true);
      try {
        const data = await fetchExperience();
        setExperience(data);
      } catch (err) {
        setError("Failed to load experience");
      } finally {
        setLoading(false);
      }
    };

  const loadReferences = async (expId) => {
    const data = await fetchReferences(expId);
    setRefs(r => ({ ...r, [expId]: data }));
  };

  useEffect(() => {
    loadExperience();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
        <div className="text-gray-700 text-lg mt-2">Loading experience...</div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleRefereeChange = (e) => {
    const { name, value } = e.target;
    setReferee(r => ({ ...r, [name]: value }));
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
      if (!editId && referee.name) {
        await createReference(res.id, referee);
        setReferee(initialReferee);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    setError('');
    setLoading(true);
    try {
      const res = await deleteExperience(id);
      if (res.error) {
        setError(res.error);
      } else {
        loadExperience();
      }
    } catch (err) {
      setError('Failed to delete experience.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRef = (expId) => setRefForms(f => ({ ...f, [expId]: null }));
  const handleEditRef = (expId, ref) => setRefForms(f => ({ ...f, [expId]: ref }));
  const handleRefSaved = (expId) => {
    setRefForms(f => ({ ...f, [expId]: undefined }));
    loadReferences(expId);
  };
  const handleDeleteRef = async (expId, refId) => {
    await deleteReference(refId);
    loadReferences(expId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-800 tracking-tight">Manage Experience</h2>
      <button
        onClick={() => { setShowForm((v) => !v); setEditId(null); setForm(initialForm); setReferee(initialReferee); }}
        className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-md font-semibold transition-all duration-200 hover:shadow-lg"
      >
        {showForm ? 'Cancel' : 'Add Experience'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-4 mb-8 border border-blue-100 transition-all duration-300 hover:shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter title"
                required
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Company</label>
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Enter company"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter location"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Order</label>
              <input
                type="number"
                name="order"
                value={form.order}
                onChange={handleChange}
                placeholder="Enter order"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="current"
                checked={form.current}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-400 border-gray-300 rounded"
              />
              <label className="text-sm font-semibold text-gray-700">Current</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-400 border-gray-300 rounded"
              />
              <label className="text-sm font-semibold text-gray-700">Active</label>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
            />
          </div>
          {!editId && (
            <div className="bg-blue-50 p-4 rounded-xl shadow-md flex flex-col gap-4">
              <div className="font-semibold text-blue-700">Referee (optional)</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Name</label>
                  <input
                    name="name"
                    value={referee.name}
                    onChange={handleRefereeChange}
                    placeholder="Enter name"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <input
                    name="email"
                    value={referee.email}
                    onChange={handleRefereeChange}
                    placeholder="Enter email"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Phone</label>
                  <input
                    name="phone"
                    value={referee.phone}
                    onChange={handleRefereeChange}
                    placeholder="Enter phone"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Note</label>
                <textarea
                  name="note"
                  value={referee.note}
                  onChange={handleRefereeChange}
                  placeholder="Enter note"
                  className="border border-gray-300 rounded-lg px-3 py-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors duration-200"
                />
              </div>
            </div>
          )}
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            {loading ? (editId ? 'Updating...' : 'Saving...') : (editId ? 'Update Experience' : 'Save Experience')}
          </button>
        </form>
      )}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experience.map((exp) => (
          <li key={exp.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-blue-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="font-bold text-xl text-blue-800">{exp.title}</div>
            <div className="text-gray-700 font-medium">{exp.company}</div>
            <div className="text-sm text-gray-600">{exp.location}</div>
            <div className="text-xs text-gray-500">Active: {exp.is_active ? 'Yes' : 'No'}</div>
            <div className="text-xs text-gray-500">Current: {exp.current ? 'Yes' : 'No'}</div>
            <div className="text-xs text-gray-500">
              Start: {exp.start_date ? exp.start_date.split('T')[0] : ''} | End: {exp.end_date ? exp.end_date.split('T')[0] : ''}
            </div>
            <div className="text-gray-700">{exp.description}</div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(exp)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(exp.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Delete
              </button>
            </div>
            <div className="mt-4">
              <div className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                References
                <button
                  onClick={() => { handleAddRef(exp.id); }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Add
                </button>
              </div>
              <div>
                {refForms[exp.id] !== undefined ? (
                  <ReferenceForm
                    expId={exp.id}
                    reference={refForms[exp.id]}
                    onSaved={() => handleRefSaved(exp.id)}
                    onCancel={() => setRefForms(f => ({ ...f, [exp.id]: undefined }))}
                  />
                ) : null}
                <ul className="flex flex-col gap-2">
                  {(refs[exp.id] || exp.references || []).map(ref => (
                    <li key={ref.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex flex-col gap-1">
                      <div className="font-semibold text-gray-800">{ref.name}</div>
                      <div className="text-sm text-gray-600">{ref.email} {ref.phone && `| ${ref.phone}`}</div>
                      <div className="text-sm text-gray-500">{ref.note}</div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditRef(exp.id, ref)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRef(exp.id, ref.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Experience; 