import React, { useState, useEffect } from 'react';
import { fetchProfile, updateProfile } from '../api';

const initialProfile = {
  name: '',
  title: '',
  bio: '',
  email: '',
  phone: '',
  location: '',
  github: '',
  linkedin: '',
  twitter: '',
  website: '',
  avatar: '',
  cv_url: '',
  cv: null,
};

const ProfileEdit = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await fetchProfile();
        setProfile((prev) => ({ ...prev, ...data, cv: null }));
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="loading-spinner" />
        <div className="loading-text">Loading profile...</div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfile((p) => ({ ...p, cv: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const data = { ...profile };
    if (!data.cv) delete data.cv;
    const res = await updateProfile(data);
    setLoading(false);
    if (res.error) setError(res.error);
    else setSuccess('Profile updated!');
    // Refetch to update cv_url
    fetchProfile().then((data) => {
      setProfile((prev) => ({ ...prev, ...data, cv: null }));
    });
  };

  return (
    <div className="w-full max-w-full p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-700">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-xl flex flex-col gap-6 border border-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Name</label>
            <input name="name" value={profile.name} onChange={handleChange} className="border rounded px-3 py-2" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Title</label>
            <input name="title" value={profile.title} onChange={handleChange} className="border rounded px-3 py-2" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-semibold">Bio</label>
            <textarea name="bio" value={profile.bio} onChange={handleChange} className="border rounded px-3 py-2" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Email</label>
            <input name="email" value={profile.email} onChange={handleChange} className="border rounded px-3 py-2" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Phone</label>
            <input name="phone" value={profile.phone} onChange={handleChange} className="border rounded px-3 py-2" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Location</label>
            <input name="location" value={profile.location} onChange={handleChange} className="border rounded px-3 py-2" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">GitHub</label>
            <input name="github" value={profile.github} onChange={handleChange} className="border rounded px-3 py-2" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">LinkedIn</label>
            <input name="linkedin" value={profile.linkedin} onChange={handleChange} className="border rounded px-3 py-2" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Twitter</label>
            <input name="twitter" value={profile.twitter} onChange={handleChange} className="border rounded px-3 py-2" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Website</label>
            <input name="website" value={profile.website} onChange={handleChange} className="border rounded px-3 py-2" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Avatar URL</label>
            <input name="avatar" value={profile.avatar} onChange={handleChange} className="border rounded px-3 py-2" />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-semibold">CV Upload</label>
            <input type="file" name="cv" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="border rounded px-3 py-2" />
            {profile.cv_url && (
              <a href={`http://localhost:5000${profile.cv_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-1">View Uploaded CV</a>
            )}
          </div>
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center">{success}</div>}
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded">
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit; 