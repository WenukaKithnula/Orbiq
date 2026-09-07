import { useOutletContext } from 'react-router-dom';

export function Dashboard() {
 const profile = useOutletContext();

  return (
    <div>
      <h1>Good morning, {profile?.full_name ?? '...'}</h1>
      <h2>{profile?.username}</h2>
      <h2>{profile?.categories}</h2>
    </div>
  );
}
