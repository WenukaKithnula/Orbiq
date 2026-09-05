import { useEffect, useState } from 'react';
import { api } from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { signOut } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.getMe().then((res) => setProfile(res.profile));
  }, []);

  return (
    <div>
      <h1>Good morning, {profile?.full_name ?? '...'}</h1>
      <button onClick={signOut}>Log out</button>
    </div>
  );
}
