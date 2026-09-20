import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MAIN_NAV, PLACEHOLDER_GROUPS } from '../../config/navigation';
import { useState } from 'react';
import { api } from '../../lib/apiClient';
import { AddWorkspaceModal } from '../workspace/AddWorkspaceModal';
import { ConfirmDialog } from '../common/ConfirmDialog';

export function Sidebar({ profile, workspaces, workspacesError, onWorkspaceCreated, onWorkspaceDeleted }) {
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

  async function deleteworkspace(id) {
    await api.deleteWorkspace(id);
    onWorkspaceDeleted(id);
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
        items={workspaces.map((workspace) => ({ id: workspace.id, label: workspace.name }))}
        addLabel="+ New workspace"
        onAdd={createworkspace}
        onDelete={deleteworkspace}
        loadError={workspacesError}
      />
      <SidebarSection
        title="Groups"
        items={PLACEHOLDER_GROUPS.map((name) => ({ id: name, label: name }))}
      />

      <div className="sidebar-footer">
        <span className="sidebar-version">v{__APP_VERSION__}</span>
      </div>
    </aside>
  );
}

function SidebarSection({ title, items, addLabel, onAdd, onDelete, loadError }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  async function handleCreate(name) {
    const created = await onAdd(name);
    setStatus({ type: 'success', message: `Successfully created "${created.name}"` });
    return created;
  }

  async function handleConfirmDelete() {
    await onDelete(pendingDelete.id);
    setPendingDelete(null);
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
            <li key={item.id} className="sidebar-section-item">
              <span className="sidebar-section-item-label">{item.label}</span>
              {onDelete && (
                <button
                  type="button"
                  className="sidebar-section-delete"
                  aria-label={`Delete ${item.label}`}
                  onClick={() => setPendingDelete(item)}
                >
                  <TrashIcon />
                </button>
              )}
            </li>
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

      {onDelete && (
        <ConfirmDialog
          open={pendingDelete !== null}
          message={`Are you sure you want to delete "${pendingDelete?.label}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path
        d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6M5.5 6l.6 10a1.5 1.5 0 0 0 1.5 1.4h4.8a1.5 1.5 0 0 0 1.5-1.4l.6-10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
