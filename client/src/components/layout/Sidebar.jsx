import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MAIN_NAV } from '../../config/navigation';
import { useState } from 'react';
import { api } from '../../lib/apiClient';
import { AddWorkspaceModal } from '../workspace/AddWorkspaceModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { CreateGroupModal } from '../groups/CreateGroupModal';
import { JoinGroupModal } from '../groups/JoinGroupModal';

export function Sidebar({
  profile,
  workspaces,
  workspacesError,
  onWorkspaceCreated,
  onWorkspaceDeleted,
  groups,
  groupsError,
  onGroupCreated,
  onGroupJoined,
}) {
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

  async function creategroup(name, description) {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new Error('Group name is required');
    }
    const { group } = await api.createGroup({ name: trimmed, description: description || undefined });
    onGroupCreated(group);
    return group;
  }

  async function joingroup(inviteCode) {
    const { group } = await api.joinGroup(inviteCode);
    onGroupJoined(group);
    return group;
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
      <GroupsSection
        groups={groups}
        groupsError={groupsError}
        onCreate={creategroup}
        onJoin={joingroup}
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
          message={`Are you sure you want to delete "${pendingDelete?.label}" workspace?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}

function GroupsSection({ groups, groupsError, onCreate, onJoin }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [status, setStatus] = useState(null);

  async function handleCreate(name, description) {
    const created = await onCreate(name, description);
    setStatus({ type: 'success', message: `Successfully created "${created.name}"` });
    return created;
  }

  async function handleJoin(inviteCode) {
    const joined = await onJoin(inviteCode);
    setStatus({ type: 'success', message: `Successfully joined "${joined.name}"` });
    return joined;
  }

  return (
    <div className="sidebar-section sidebar-card">
      <p className="sidebar-section-title">Groups</p>

      {groupsError ? (
        <p className="sidebar-section-status sidebar-section-status--error">
          Could not load groups: {groupsError}
        </p>
      ) : (
        <ul className="sidebar-section-list">
          {groups.map((group) => (
            <li key={group.id} className="sidebar-section-item">
              <span className="sidebar-section-item-label">{group.name}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="sidebar-section-actions">
        <button
          type="button"
          className="sidebar-section-add"
          onClick={() => { setCreateOpen(true); setStatus(null); }}
        >
          + New group
        </button>
        <button
          type="button"
          className="sidebar-section-add"
          onClick={() => { setJoinOpen(true); setStatus(null); }}
        >
          + Join group
        </button>
      </div>

      {status && (
        <p className={`sidebar-section-status sidebar-section-status--${status.type}`}>
          {status.message}
        </p>
      )}

      <CreateGroupModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
      <JoinGroupModal
        open={joinOpen}
        onClose={() => setJoinOpen(false)}
        onJoin={handleJoin}
      />
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
