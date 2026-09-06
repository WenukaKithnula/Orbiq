import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/apiClient';

export function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) return setError(error.message);

      // Returning user -- check whether they already have a profile
      try {
        const { profileComplete } = await api.getMe();
        navigate(profileComplete ? '/dashboard' : '/complete-profile');
      } catch (err) {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Welcome back</h1>
      <button type="button" onClick={signInWithGoogle}>Continue with Google</button>

      <input type="email" placeholder="Email" value={email}
             onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password}
             onChange={(e) => setPassword(e.target.value)} required />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={submitting}>{submitting ? 'Logging in…' : 'Log in'}</button>
      <p>Back to Landing Page <Link to="/">Home Page</Link></p>
    </form>
  );
}
