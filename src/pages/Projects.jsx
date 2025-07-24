import React, { useState, useEffect } from 'react';
import { fetchProjects, createProject, updateProject, deleteProject, getImageUrl } from '../api';

const initialForm = {
  title: '',
  description: '',
  github_url: '',
  live_url: '',
  technologies: '',
  featured: false,
  order: 0,
  is_active: true,
  images: [],
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="loading-spinner" />
        <div className="loading-text">Loading projects...</div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setForm((f) => ({ ...f, images: Array.from(e.target.files) }));
  };

  const handleEdit = (project) => {
    setEditId(project.id);
    setShowForm(true);
    setForm({
      ...project,
      images: [], // Don't prefill images
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!editId && (form.images.length < 1 || form.images.length > 6)) {
      setError('Please select 1-6 images.');
      setLoading(false);
      return;
    }
    let res;
    if (editId) {
      res = await updateProject(editId, form);
    } else {
      res = await createProject(form);
    }
    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      setShowForm(false);
      setForm(initialForm);
      setEditId(null);
      loadProjects();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await deleteProject(id);
    loadProjects();
  };

  return (
    <div className="w-full max-w-full p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-700">Manage Projects</h2>
      <button
        onClick={() => { setShowForm((v) => !v); setEditId(null); setForm(initialForm); }}
        className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded shadow-lg font-semibold"
      >
        {showForm ? 'Cancel' : 'Add Project'}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl flex flex-col gap-4 mb-8 border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="border rounded px-3 py-2" />
            <input name="github_url" value={form.github_url} onChange={handleChange} placeholder="GitHub URL" className="border rounded px-3 py-2" />
            <input name="live_url" value={form.live_url} onChange={handleChange} placeholder="Live URL" className="border rounded px-3 py-2" />
            <input name="technologies" value={form.technologies} onChange={handleChange} placeholder="Technologies (comma separated)" className="border rounded px-3 py-2" />
            <input type="number" name="order" value={form.order} onChange={handleChange} placeholder="Order" className="border rounded px-3 py-2 w-full" />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Featured
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} /> Active
            </label>
          </div>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="border rounded px-3 py-2" />
          <input type="file" name="images" accept="image/*" multiple onChange={handleFileChange} className="border rounded px-3 py-2" />
          <div className="flex gap-2 flex-wrap">
            {form.images && form.images.map((file, idx) => (
              <img key={idx} src={URL.createObjectURL(file)} alt="preview" className="w-16 h-16 object-cover rounded border-2 border-blue-300" />
            ))}
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" disabled={loading} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 rounded shadow-lg">
            {loading ? (editId ? 'Updating...' : 'Saving...') : (editId ? 'Update Project' : 'Save Project')}
          </button>
        </form>
      )}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <li key={project.id} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-6 flex flex-col gap-3 border border-blue-200 hover:shadow-2xl transition-shadow">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {project.images && project.images.map((url, idx) => (
                <img key={idx} src={getImageUrl(url)} alt="project" className="w-16 h-16 object-cover rounded-lg border-2 border-blue-300" />
              ))}
            </div>
            <div className="font-bold text-xl text-blue-800">{project.title}</div>
            <div className="text-gray-700">{project.description}</div>
            <div className="flex gap-2 text-sm">
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub</a>
              <span>|</span>
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Live</a>
            </div>
            <div className="text-sm text-gray-600">Technologies: {project.technologies}</div>
            <div className="text-xs text-gray-500">Featured: {project.featured ? 'Yes' : 'No'} | Order: {project.order} | Active: {project.is_active ? 'Yes' : 'No'}</div>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(project)} className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow">Edit</button>
              <button onClick={() => handleDelete(project.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects; 