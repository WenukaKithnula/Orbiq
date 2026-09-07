import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const styles = {
  container: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '2rem 1.5rem',
    
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '4rem',
  },
  brand: {
    fontWeight: 700,
    marginRight: 'auto',
  },
  title: {
    fontSize: '2.5rem',
    lineHeight: 1.2,
    marginBottom: '2rem',
  },
  cta: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    background: '#2f6fed',
    color: 'white',
    textDecoration: 'none',
    borderRadius: 8,
    fontWeight: 600,
  },
};

export function Landing() {
  const { user } = useAuth();
  return (
    <div style={styles.container}>
      <nav style={styles.header}>
        <span style={styles.brand}>AppName</span>
        <Link to="/login">Log In</Link>
        <Link to="/signup">Sign Up</Link>
        {user && <p>{user.id}</p>}
      </nav>
      <h1 style={styles.title}>Plan your days. Build real habits.</h1>
      <Link to="/signup" style={styles.cta}>Get started free</Link>
      
    </div>
  );
}
