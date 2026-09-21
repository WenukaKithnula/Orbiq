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
  const [groups, setGroups] = useState([]);
  const [groupsError, setGroupsError] = useState(null);
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

      try {
        const { groups } = await api.getGroups();
        setGroups(groups);
      } catch (err) {
        setGroupsError(err.message);
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

  function handleGroupCreated(group) {
    setGroups((prev) => [...prev, group]);
  }

  function handleGroupJoined(group) {
    setGroups((prev) => (prev.some((g) => g.id === group.id) ? prev : [...prev, group]));
  }

  return (
    <div className="app-shell">
      <Sidebar
        profile={profile}
        workspaces={workspaces}
        workspacesError={workspacesError}
        onWorkspaceCreated={handleWorkspaceCreated}
        onWorkspaceDeleted={handleWorkspaceDeleted}
        groups={groups}
        groupsError={groupsError}
        onGroupCreated={handleGroupCreated}
        onGroupJoined={handleGroupJoined}
      />
      <main className="app-content">
        <Outlet context={profile} />
      </main>
    </div>
  );
}
