import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useSessionHistory } from '../hooks/useSessionHistory';

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const { getUserSessions } = useSessionHistory();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const sessions = getUserSessions(currentUser.id);
  const totalVolume = sessions.reduce(
    (acc, s) => acc + s.sets.reduce((a, e) => a + e.sets.reduce((x, set) => x + set.weight * set.reps, 0), 0),
    0
  );

  const handleSwitch = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div className="page-content" style={{ paddingTop: 24 }}>
      {/* Avatar */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'var(--blue-light)',
            border: '3px solid var(--blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 36,
            margin: '0 auto 16px',
          }}
        >
          👤
        </div>
        <h1 style={{ fontSize: 28 }}>{currentUser.name}</h1>
      </div>

      {/* Stats */}
      <h3 style={{ marginBottom: 12, color: 'var(--text2)', fontWeight: 500, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
        Statistiky
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
        <div className="card" style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--blue)', marginBottom: 6 }}>
            {sessions.length}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>Tréninků celkem</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--gold)', marginBottom: 6 }}>
            {totalVolume >= 1000
              ? `${(totalVolume / 1000).toFixed(1)} t`
              : `${totalVolume} kg`}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)' }}>Celkový objem</div>
        </div>
      </div>

      {/* Switch user */}
      <button className="btn-secondary" onClick={handleSwitch}>
        Přepnout uživatele
      </button>

      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: 'var(--text3)' }}>GymLog · Všechna data jsou uložena lokálně</p>
      </div>
    </div>
  );
}
