import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { api } from '../../lib/apiClient';
import { LoadingScreen } from '../common/LoadingScreen';
import { Sidebar } from './Sidebar';
import './layout.css';

export function AppLayout() {
  const [profile, setProfile] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [workspacesError, setWorkspacesError] = useState(null);
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

      try {
        const { workspaces } = await api.getworkspaces();
        setWorkspaces(workspaces);
      } catch (err) {
        setWorkspacesError(err.message);
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  function handleWorkspaceCreated(workspace) {
    setWorkspaces((prev) => [...prev, workspace]);
  }

  function handleWorkspaceDeleted(id) {
    setWorkspaces((prev) => prev.filter((workspace) => workspace.id !== id));
  }

  return (
    <div className="app-shell">
      <Sidebar
        profile={profile}
        workspaces={workspaces}
        workspacesError={workspacesError}
        onWorkspaceCreated={handleWorkspaceCreated}
        onWorkspaceDeleted={handleWorkspaceDeleted}
      />
      <main className="app-content">
        <Outlet context={profile} />
      </main>
    </div>
  );
}
