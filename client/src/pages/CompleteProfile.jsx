import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/apiClient';

export function CompleteProfile() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await api.createProfile({ fullName, username, timezone });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Complete your profile</h1>
      <input placeholder="Full name" value={fullName}
             onChange={(e) => setFullName(e.target.value)} required />
      <input placeholder="Username" value={username}
             onChange={(e) => setUsername(e.target.value)} required />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Continue to Dashboard</button>
    </form>
  );
}
