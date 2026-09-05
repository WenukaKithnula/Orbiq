import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div>
      <nav>
        <span>AppName</span>
        <Link to="/login">Log In</Link>
        <Link to="/signup">Sign Up</Link>
      </nav>
      <h1>Plan your days. Build real habits.</h1>
      <Link to="/signup">Get started free</Link>
    </div>
  );
}
