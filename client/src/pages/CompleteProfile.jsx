import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/apiClient';

const PURPOSE_OPTIONS = [
  { key: 'personal', label: 'Personal productivity' },
  { key: 'work', label: 'Work & career' },
  { key: 'school', label: 'School & studying' },
  { key: 'fitness', label: 'Fitness & health' },
  { key: 'mix', label: 'A mix of everything' },
];

function PurposeCard({ label, selected, onClick }) {
  return (
    <div
      className={`purpose-card${selected ? ' selected' : ''}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
}

export function CompleteProfile() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await api.createProfile({ fullName, username, timezone ,purpose});
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  console.log(purpose);

  return (
    <form onSubmit={handleSubmit}>
      <h1>Complete your profile</h1>
      <input placeholder="Full name" value={fullName}
             onChange={(e) => setFullName(e.target.value)} required />
      <input placeholder="Username" value={username}
             onChange={(e) => setUsername(e.target.value)} required />

      <p>What brings you here?</p>
      <div className="purpose-grid">
        {PURPOSE_OPTIONS.map((option) => (
          <PurposeCard
            key={option.key}
            label={option.label}
            selected={purpose === option.key}
            onClick={() => setPurpose(option.key)}
          />
        ))}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Fill all to continue..</p>
      {(fullName !== '' && username !== '' && purpose !== '') &&
        <button type="submit">Continue to Dashboard</button>}
    </form>
  );
}
