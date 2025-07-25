import React, { useState, useEffect } from 'react';
import { fetchCertifications, createCertification, updateCertification, deleteCertification } from '../api';

const initialForm = {
  title: '',
  institution: '',
  description: '',
  date_awarded: '',
  order: 0,
  is_active: true,
  certificate: null,
  certificate_url: '',
};

const CERT_IMAGE_BASE = 'https://portfolio-backend-x6q9.onrender.com';

const Certifications = () => {
  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCerts = async () => {
    setLoading(true);
    try {
      const data = await fetchCertifications();
      setCerts(data);
    } catch (err) {
      setError("Failed to load certifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCerts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="loading-spinner" />
        <div className="loading-text">Loading certifications...</div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    setForm((f) => ({ ...f, certificate: e.target.files[0] }));
  };

  const handleEdit = (cert) => {
    setEditId(cert.id);
    setShowForm(true);
    setForm({ ...cert, date_awarded: cert.date_awarded ? cert.date_awarded.split('T')[0] : '', certificate: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    let res;
    if (editId) {
      res = await updateCertification(editId, form);
    } else {
      res = await createCertification(form);
    }
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setShowForm(false);
      setForm(initialForm);
      setEditId(null);
      setSuccess(editId ? 'Certification updated!' : 'Certification added!');
      loadCerts();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    setError('');
    setLoading(true);
    try {
      const res = await deleteCertification(id);
      if (res.error) {
        setError(res.error);
      } else {
        loadCerts();
      }
    } catch (err) {
      setError('Failed to delete certification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-700">Manage Certifications</h2>
      <button
        onClick={() => { setShowForm((v) => !v); setEditId(null); setForm(initialForm); }}
        className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded shadow-lg font-semibold"
      >
        {showForm ? 'Cancel' : 'Add Certification'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-xl flex flex-col gap-4 mb-8 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="border rounded px-3 py-2" />
            <input name="institution" value={form.institution} onChange={handleChange} placeholder="Institution" className="border rounded px-3 py-2" />
            <input type="date" name="date_awarded" value={form.date_awarded} onChange={handleChange} className="border rounded px-3 py-2" />
            <input type="number" name="order" value={form.order} onChange={handleChange} placeholder="Order" className="border rounded px-3 py-2 w-full" />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} /> Active
            </label>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="font-semibold">Certificate Upload</label>
              <input type="file" name="certificate" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="border rounded px-3 py-2" />
              {form.certificate_url && (
                <a href={`http://localhost:5000${form.certificate_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-1">View Uploaded Certificate</a>
              )}
            </div>
          </div>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="border rounded px-3 py-2" />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button type="submit" disabled={loading} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 rounded shadow-lg">
            {loading ? (editId ? 'Updating...' : 'Saving...') : (editId ? 'Update Certification' : 'Save Certification')}
          </button>
        </form>
      )}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((cert) => (
          <li key={cert.id} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-6 flex flex-col gap-3 border border-blue-200 hover:shadow-2xl transition-shadow">
            <div className="font-bold text-xl text-blue-800">{cert.title}</div>
            <div className="text-gray-700">{cert.institution}</div>
            <div className="text-xs text-gray-500">Awarded: {cert.date_awarded ? cert.date_awarded.split('T')[0] : ''}</div>
            <div className="text-xs text-gray-500">Active: {cert.is_active ? 'Yes' : 'No'}</div>
            <div className="text-gray-700">{cert.description}</div>
            {cert.certificate_url && (
              <a href={cert.certificate_url.startsWith('http') ? cert.certificate_url : CERT_IMAGE_BASE + cert.certificate_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-1">View Certificate</a>
            )}
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(cert)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow">Edit</button>
              <button onClick={() => handleDelete(cert.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Certifications; 