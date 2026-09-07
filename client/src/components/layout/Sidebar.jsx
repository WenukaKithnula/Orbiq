import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MAIN_NAV, PLACEHOLDER_WORKSPACES, PLACEHOLDER_GROUPS } from '../../config/navigation';

export function Sidebar({ profile }) {
  const { user, signOut } = useAuth();
  const displayName = profile?.full_name || user?.email || '';
  const initial = displayName ? displayName[0].toUpperCase() : '?';

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
        placeholder="Ask Orbiq… (coming soon)"
        disabled
      />

      <nav className="sidebar-nav" aria-label="Primary">
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

      <SidebarSection title="Workspaces" items={PLACEHOLDER_WORKSPACES} addLabel="+ New workspace" />
      <SidebarSection title="Groups" items={PLACEHOLDER_GROUPS} />

      <div className="sidebar-footer">
        <span className="sidebar-version">v{__APP_VERSION__}</span>
      </div>
    </aside>
  );
}

function SidebarSection({ title, items, addLabel }) {
  return (
    <div className="sidebar-section">
      <p className="sidebar-section-title">{title}</p>
      <ul className="sidebar-section-list">
        {items.map((item) => (
          <li key={item} className="sidebar-section-item">{item}</li>
        ))}
      </ul>
      {addLabel && <p className="sidebar-section-add">{addLabel}</p>}
    </div>
  );
}
