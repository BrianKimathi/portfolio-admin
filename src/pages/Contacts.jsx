import React, { useState, useEffect } from 'react';
import { fetchContacts, markContactRead, deleteContact } from '../api';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadContacts = async () => {
      setLoading(true);
      try {
        const data = await fetchContacts();
        setContacts(data);
      } catch (err) {
        setError("Failed to load contacts");
      } finally {
        setLoading(false);
      }
    };
    loadContacts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <div className="loading-spinner" />
        <div className="loading-text">Loading contacts...</div>
      </div>
    );
  }

  const handleMarkRead = async (id) => {
    setLoading(true);
    setError('');
    setSuccess('');
    const res = await markContactRead(id);
    setLoading(false);
    if (res.error) setError(res.error);
    else {
      setSuccess('Marked as read!');
      loadContacts();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    const res = await deleteContact(id);
    setLoading(false);
    if (res.error) setError(res.error);
    else {
      setSuccess('Contact deleted!');
      loadContacts();
    }
  };

  return (
    <div className="w-full max-w-5xl">
      <h2 className="text-3xl font-extrabold mb-8 text-blue-700">Contact Messages</h2>
      {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
      {success && <div className="text-green-600 text-sm text-center mb-4">{success}</div>}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <li key={contact.id} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-6 flex flex-col gap-3 border border-blue-200 hover:shadow-2xl transition-shadow">
            <div className="font-bold text-xl text-blue-800">{contact.name}</div>
            <div className="text-gray-700">{contact.email}</div>
            <div className="text-sm text-gray-600">{contact.message}</div>
            <div className="text-xs text-gray-500">Read: {contact.read ? 'Yes' : 'No'}</div>
            <div className="text-xs text-gray-500">Created: {contact.created_at ? contact.created_at.split('T')[0] : ''}</div>
            <div className="flex gap-2 mt-2">
              {!contact.read && <button onClick={() => handleMarkRead(contact.id)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow">Mark as Read</button>}
              <button onClick={() => handleDelete(contact.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contacts; 