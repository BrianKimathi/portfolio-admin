import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (registerMode) {
      // Registration flow
      try {
        const res = await fetch(`${API_URL}/admin/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
          setSuccess('Registration successful! You can now log in.');
          setRegisterMode(false);
        } else {
          setError(data.error || 'Registration failed');
        }
      } catch (err) {
        setLoading(false);
        setError('Registration failed');
      }
    } else {
      // Login flow
      const success = await login({ username, password });
      setLoading(false);
      if (!success) setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-4 text-center">{registerMode ? 'Register Admin' : 'Admin Login'}</h2>
        <input
          type="text"
          placeholder="Username (email)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center">{success}</div>}
        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded">
          {loading ? (registerMode ? 'Registering...' : 'Logging in...') : (registerMode ? 'Register' : 'Login')}
        </button>
        <button
          type="button"
          className="text-blue-600 hover:underline text-sm mt-2"
          onClick={() => { setRegisterMode((v) => !v); setError(''); setSuccess(''); }}
        >
          {registerMode ? 'Already have an account? Login' : 'No account? Register as admin'}
        </button>
      </form>
    </div>
  );
};

export default Login; 