import { useEffect, useState } from 'react';
import { api } from '../lib/apiClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../components/LoadingScreen';


export function Dashboard() {
  const { signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  async function loadProfile() {
      const { profileComplete, profile } = await api.getMe();
      if (!profileComplete) {
        navigate('/complete-profile');
        return;
      }
      setProfile(profile);
      setLoading(false);
    }

  useEffect(() => {

    loadProfile();
  }, []);

  if (loading) {
    return <LoadingScreen/>;
  }

  return (
    <div>
      <h1>Good morning, {profile?.full_name ?? '...'}</h1>
      <h2>{profile?.username}</h2>
      <h2>{profile?.categories}</h2>
      <button onClick={signOut}>Log out</button>
    </div>
  );
}
