import { useState } from 'react';
import { createPortal } from 'react-dom';

export function AddWorkspaceModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!open) {
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Workspace name is required');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onCreate(trimmed);
      setName('');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return createPortal(
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.card} role="dialog" aria-modal="true" aria-labelledby="add-workspace-title">
        <h2 id="add-workspace-title" style={styles.title}>New workspace</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Workspace name"
          />
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.actions}>
            <button type="button" style={styles.cancel} onClick={onClose}>Cancel</button>
            <button type="submit" style={styles.submit} disabled={submitting}>
              {submitting ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(30, 42, 56, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '1.5rem',
    width: 320,
    maxWidth: 'calc(100vw - 2rem)',
    boxShadow: '0 12px 32px rgba(30, 42, 56, 0.25)',
  },
  title: {
    margin: '0 0 1rem',
    fontSize: '1.05rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  error: {
    margin: '0.5rem 0 0',
    color: '#d64545',
    fontSize: '0.85rem',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
  },
  cancel: {
    background: 'none',
    border: '1px solid #d9dee5',
    color: '#5b6b7d',
  },
  submit: {
    background: 'rgb(235, 177, 110)',
  },
};
