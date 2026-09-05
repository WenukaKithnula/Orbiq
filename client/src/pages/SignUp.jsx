import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function SignUp() {
  const { signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const { error } = await signUp(email, password);
    if (error) return setError(error.message);

    // New account, no profile row yet -> onward to profile completion
    navigate('/complete-profile');
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create your account</h1>
      <button type="button" onClick={signInWithGoogle}>Continue with Google</button>

      <input type="email" placeholder="Email" value={email}
             onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password}
             onChange={(e) => setPassword(e.target.value)} required />

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Create account</button>
    </form>
  );
}
