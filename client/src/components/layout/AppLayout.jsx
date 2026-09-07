import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { api } from '../../lib/apiClient';
import { LoadingScreen } from '../LoadingScreen';
import { Sidebar } from './Sidebar';
import './layout.css';

export function AppLayout() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      const { profileComplete, profile } = await api.getMe();
      if (!profileComplete) {
        navigate('/complete-profile');
        return;
      }
      setProfile(profile);
      setLoading(false);
    }

    loadProfile();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app-shell">
      <Sidebar profile={profile}/> 
      <main className="app-content">
        <Outlet context={profile} />
      </main>
    </div>
  );
}
