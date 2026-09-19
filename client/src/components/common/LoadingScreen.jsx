const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  minHeight: '60vh',
};

const spinnerStyle = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  border: '3px solid #d9dee5',
  borderTopColor: '#2f6fed',
  animation: 'loading-screen-spin 0.8s linear infinite',
};

const textStyle = {
  color: '#5b6b7d',
  fontSize: '0.9rem',
};

export function LoadingScreen({ message = 'Loading…' }) {
  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes loading-screen-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={spinnerStyle} />
      <p style={textStyle}>{message}</p>
    </div>
  );
}
