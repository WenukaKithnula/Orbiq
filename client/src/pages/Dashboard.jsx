import { useEffect, useState } from 'react';
import { api } from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


export function Dashboard() {
  const { signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.getMe().then(({ profileComplete, profile }) => {
      if (!profileComplete) {
        navigate('/complete-profile');
        return;
      }
      setProfile(profile);
    });
  }, []);

  return (
    <div>
      <h1>Good morning, {profile?.full_name ?? '...'}</h1>
      <h2>{profile.username}</h2>
      <button onClick={signOut}>Log out</button>
    </div>
  );
}
