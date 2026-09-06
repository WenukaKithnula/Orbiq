import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/apiClient';

const PURPOSE_OPTIONS = [
  { key: 'personal', label: 'Personal productivity' },
  { key: 'work', label: 'Work & career' },
  { key: 'school', label: 'School & studying' },
  { key: 'fitness', label: 'Fitness & health' },
  { key: 'mix', label: 'A mix of everything' },
];

const STARTER_CATEGORIES = ['School', 'Work', 'Fitness', 'Personal'];

const REFERRAL_SOURCES = ['Friend', 'Social media', 'Search', 'Other'];

const FEATURES = [
  { icon: '◉', label: 'Workspaces for every part of life' },
  { icon: '◇', label: 'Habits & streaks that stick' },
  { icon: '✦', label: 'AI Task Planner does the scheduling' },
  { icon: '◎', label: 'Focus Groups to work alongside friends' },
];

const pageStyle = {
  display: 'flex',
  minHeight: '100vh',
};

const panelStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '28px',
  padding: '48px 40px',
  background: 'linear-gradient(160deg, #fff4e8 0%, #ffe4e0 100%)',
  textAlign: 'center',
};

const panelTitleStyle = {
  fontSize: '25.6px',
  color: '#3a2a20',
  margin: 0,
};

const panelTextStyle = {
  color: '#6b5648',
  maxWidth: 320,
  lineHeight: 1.5,
  margin: 0,
};

const featureListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14.4px',
  alignItems: 'flex-start',
  background: 'rgba(255,255,255,0.55)',
  borderRadius: 14,
  padding: '20px 24px',
  maxWidth: 320,
};

const featureRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10.4px',
  color: '#4a3a2e',
  fontSize: '14.08px',
  textAlign: 'left',
};

const featureIconStyle = {
  color: '#d97a4a',
  fontSize: '16px',
  flexShrink: 0,
};

const formSideStyle = {
  flex: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px',
  overflowY: 'auto',
};

const formStyle = {
  width: '100%',
  maxWidth: 'none',
  margin: '2px',
};

const sectionLabelStyle = {
  fontSize: '12.48px',
  fontWeight: 600,
  color: '#5b6472',
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
  margin: '24px 0 8px',
};

const hintStyle = {
  color: '#8a97a6',
  fontSize: '13.6px',
  margin: '8px 0 0',
};

const avatarRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  margin: '4px 0',
};

const avatarPreviewStyle = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  background: '#eaf1fe',
  border: '1px solid #2f6fed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#2f6fed',
  fontSize: '19.2px',
  flexShrink: 0,
  overflow: 'hidden',
};

const chipGridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  margin: '4px 0 4px',
};

const checkboxRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '14.08px',
  color: '#2b2f36',
  margin: '12px 0',
};

export function CompleteProfile() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [purpose, setPurpose] = useState('');
  const [categories, setCategories] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);
  const [referralSource, setReferralSource] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function toggleCategory(cat) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) setAvatarPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // Note: avatarFile itself isn't uploaded yet -- that needs a file
      // storage step (e.g. Supabase Storage) wired up separately before
      // avatarUrl can be sent here for real.
      await api.createProfile({
        fullName,
        username,
        timezone,
        purpose,
        starterCategories: categories,
        referralSource: referralSource || null,
        emailNotifications,
        
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = fullName !== '' && username !== '' && purpose !== '';

  return (
    <div style={pageStyle}>
      <style>{`
        @media (max-width: 720px) {
          .complete-profile-panel { display: none; }
        }
      `}</style>

      <div className="complete-profile-panel" style={panelStyle}>
        <img src="/images/orbiq.png" alt="Orbiq" style={{ width: 180, maxWidth: '70%' }} />
        <h2 style={panelTitleStyle}>Let's get you set up</h2>
        <p style={panelTextStyle}>
          A couple of quick details and you're in  Orbiq helps you plan your
          days and build habits that actually stick, together with the people
          who matter.
        </p>
        <div style={featureListStyle}>
          {FEATURES.map((f) => (
            <div key={f.label} style={featureRowStyle}>
              <span style={featureIconStyle}>{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={formSideStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <h1>Complete your profile</h1>
          <p style={hintStyle}>This helps Orbiq feel like yours from day one.</p>

          <p style={sectionLabelStyle}>About you</p>
          <div style={avatarRowStyle}>
            <div style={avatarPreviewStyle}>
              {avatarPreviewUrl
                ? <img src={avatarPreviewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : (fullName ? fullName[0].toUpperCase() : '+')}
            </div>
            <label style={{ fontSize: '13.6px', color: '#5b6472' }}>
              Add a photo (optional)
              <input type="file" accept="image/*" onChange={handleAvatarChange}
                     style={{ display: 'block', marginTop: 4 }} />
            </label>
          </div>
          <input placeholder="Full name" value={fullName}
                 onChange={(e) => setFullName(e.target.value)} required />
          <input placeholder="Username" value={username}
                 onChange={(e) => setUsername(e.target.value)} required />

          <p style={sectionLabelStyle}>What brings you here?</p>
          <div className="purpose-grid">
            {PURPOSE_OPTIONS.map((option) => (
              <PurposeCard
                key={option.key}
                label={option.label}
                selected={purpose === option.key}
                onClick={() => setPurpose(option.key)}
              />
            ))}
          </div>

          <p style={sectionLabelStyle}>What are you juggling? (optional, pick any)</p>
          <div style={chipGridStyle}>
            {STARTER_CATEGORIES.map((cat) => (
              <Chip key={cat} label={cat} selected={categories.includes(cat)}
                    onClick={() => toggleCategory(cat)} />
            ))}
          </div>

          <p style={sectionLabelStyle}>Just a couple more things</p>
          <select value={referralSource} onChange={(e) => setReferralSource(e.target.value)}>
            <option value="">How'd you hear about us? (optional)</option>
            {REFERRAL_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <label style={checkboxRowStyle}>
            <input type="checkbox" checked={emailNotifications}
                   onChange={(e) => setEmailNotifications(e.target.checked)} />
            Also email me reminders (in-app notifications are always on)
          </label>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {canSubmit
            ? <button type="submit" disabled={submitting}>
                {submitting ? 'Setting things up...' : 'Continue to Dashboard'}
              </button>
            : <p style={hintStyle}>Fill in your name, username, and purpose to continue.</p>}
        </form>
      </div>
    </div>
  );
}

function PurposeCard({ label, selected, onClick }) {
  return (
    <div
      className={`purpose-card${selected ? ' selected' : ''}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
}

function Chip({ label, selected, onClick }) {
  return (
    <div
      className={`chip${selected ? ' selected' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {label}
    </div>
  );
}