import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MAIN_NAV, PLACEHOLDER_GROUPS } from '../../config/navigation';
import { useState } from 'react';
import { api } from '../../lib/apiClient';
import { AddWorkspaceModal } from '../AddWorkspaceModal';

export function Sidebar({ profile, workspaces, workspacesError, onWorkspaceCreated }) {
  const { user, signOut } = useAuth();
  const [aiAgentPrompt , setaiAgentPrompt] = useState('');

  const displayName = profile?.full_name || user?.email || '';
  const initial = displayName ? displayName[0].toUpperCase() : '?';

  function aiagent(){
    return(
      <>

      </>
    )

  }

  async function createworkspace(name) {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error('Workspace name is required');
    }
    const { workspace } = await api.createWorkspace({ name: trimmed });
    onWorkspaceCreated(workspace);
    return workspace;
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-avatar">{initial}</div>
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">{profile?.full_name ?? 'Loading…'}</p>
          <p className="sidebar-user-email">{user?.email}</p>
        </div>
      </div>
      <div className="sidebar-header-actions">
        <NavLink to="/settings" className="sidebar-text-link">Settings</NavLink>
        <button type="button" className="sidebar-text-link" onClick={signOut}>Sign out</button>
      </div>

      <input
        type="text"
        className="sidebar-ai-input"
        placeholder="Ask Orbiq… ai"
        value ={aiAgentPrompt}
        onChange={(e)=>setaiAgentPrompt(e.target.value)}
      />
      {aiAgentPrompt!=='' && <button onClick={aiagent} className='agent-btn'>Ask ai</button>}


      <nav className="sidebar-nav sidebar-card" aria-label="Primary">
        {MAIN_NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-nav-link${isActive ? ' active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <SidebarSection
        title="Workspaces"
        items={workspaces.map((workspace) => workspace.name)}
        addLabel="+ New workspace"
        onAdd={createworkspace}
        loadError={workspacesError}
      />
      <SidebarSection title="Groups" items={PLACEHOLDER_GROUPS} />

      <div className="sidebar-footer">
        <span className="sidebar-version">v{__APP_VERSION__}</span>
      </div>
    </aside>
  );
}

function SidebarSection({ title, items, addLabel, onAdd, loadError }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleCreate(name) {
    const created = await onAdd(name);
    setStatus({ type: 'success', message: `Successfully created "${created.name}"` });
    return created;
  }

  return (
    <div className="sidebar-section sidebar-card">
      <p className="sidebar-section-title">{title}</p>

      {loadError ? (
        <p className="sidebar-section-status sidebar-section-status--error">
          Could not load {title.toLowerCase()}: {loadError}
        </p>
      ) : (
        <ul className="sidebar-section-list">
          {items.map((item) => (
            <li key={item} className="sidebar-section-item">{item}</li>
          ))}
        </ul>
      )}

      {addLabel && (
        <button
          type="button"
          className="sidebar-section-add"
          onClick={() => { setModalOpen(true); setStatus(null); }}
        >
          {addLabel}
        </button>
      )}

      {status && (
        <p className={`sidebar-section-status sidebar-section-status--${status.type}`}>
          {status.message}
        </p>
      )}

      {onAdd && (
        <AddWorkspaceModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
