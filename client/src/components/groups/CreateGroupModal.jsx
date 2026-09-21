import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function CreateGroupModal({ open, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [createdGroup, setCreatedGroup] = useState(null);
  const [copied, setCopied] = useState(false);

  // This component stays mounted between opens (the parent only toggles
  // `open`), so state from a previous create would otherwise leak into
  // the next time it's shown.
  useEffect(() => {
    if (open) {
      setName('');
      setDescription('');
      setSubmitting(false);
      setError(null);
      setCreatedGroup(null);
      setCopied(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Group name is required');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const group = await onCreate(trimmed, description.trim());
      setCreatedGroup(group);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(createdGroup.invite_code);
      setCopied(true);
    } catch {
      // Clipboard access can be blocked (permissions, insecure context); the
      // code is still shown on screen, so this is a nice-to-have, not fatal.
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return createPortal(
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.card} role="dialog" aria-modal="true" aria-labelledby="create-group-title">
        {createdGroup ? (
          <>
            <h2 id="create-group-title" style={styles.title}>Group created</h2>
            <p style={styles.helpText}>
              Share this invite code with anyone you want to join "{createdGroup.name}":
            </p>
            <p style={styles.inviteCode}>{createdGroup.invite_code}</p>
            <div style={styles.actions}>
              <button type="button" style={styles.cancel} onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy code'}
              </button>
              <button type="button" style={styles.submit} onClick={onClose}>Done</button>
            </div>
          </>
        ) : (
          <>
            <h2 id="create-group-title" style={styles.title}>New group</h2>
            <form style={styles.form} onSubmit={handleSubmit}>
              <input
                autoFocus
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Group name"
              />
              <textarea
                style={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={3}
              />
              {error && <p style={styles.error}>{error}</p>}
              <div style={styles.actions}>
                <button type="button" style={styles.cancel} onClick={onClose}>Cancel</button>
                <button type="submit" style={styles.submit} disabled={submitting}>
                  {submitting ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </>
        )}
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
  textarea: {
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  helpText: {
    margin: '0 0 0.75rem',
    fontSize: '0.85rem',
    color: '#5b6b7d',
  },
  inviteCode: {
    margin: 0,
    padding: '0.75rem',
    background: '#f4f5f7',
    border: '1px dashed #d9dee5',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: '1.2rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
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
    marginTop: '1rem',
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
