import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);

  // This component stays mounted between opens (the parent only toggles
  // `open`), so state from a previous confirm/cancel would otherwise leak
  // into the next time it's shown for a different item.
  useEffect(() => {
    if (open) {
      setConfirming(false);
      setError(null);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  async function handleConfirm() {
    setConfirming(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirming(false);
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onCancel();
  }

  return createPortal(
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.card} role="alertdialog" aria-modal="true" aria-describedby="confirm-dialog-message">
        <p id="confirm-dialog-message" style={styles.message}>{message}</p>
        {error && <p style={styles.error}>{error}</p>}
        <div style={styles.actions}>
          <button type="button" style={styles.cancel} onClick={onCancel}>No</button>
          <button type="button" style={styles.danger} disabled={confirming} onClick={handleConfirm}>
            {confirming ? 'Deleting…' : 'Yes'}
          </button>
        </div>
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
  message: {
    margin: 0,
    fontSize: '1.05rem',
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
  danger: {
    background: '#d64545',
    color: '#fff',
    border: 'none',
  },
};
