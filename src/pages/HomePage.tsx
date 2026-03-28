import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useWorkouts } from '../hooks/useWorkouts';
import { useSessionHistory } from '../hooks/useSessionHistory';

export default function HomePage() {
  const { currentUser } = useCurrentUser();
  const { workouts } = useWorkouts();
  const { getLastSessionForWorkout } = useSessionHistory();
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const diff = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Dnes';
    if (diff === 1) return 'Včera';
    if (diff < 7) return `Před ${diff} dny`;
    return d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="page-content" style={{ paddingTop: 'max(24px, calc(env(safe-area-inset-top) + 16px))' }}>
      <div style={{ marginBottom: 28 }}>
        <h1>Ahoj, {currentUser?.name}! 👋</h1>
        <p className="text-muted" style={{ marginTop: 6 }}>Připraven na trénink?</p>
      </div>

      <h3 style={{ marginBottom: 14, color: 'var(--text2)', fontWeight: 500, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
        Tréninky
      </h3>

      {workouts.map((workout) => {
        const lastSession = currentUser
          ? getLastSessionForWorkout(currentUser.id, workout.id)
          : null;
        const exerciseCount = workout.exercises.length;

        return (
          <div
            key={workout.id}
            className="card"
            style={{ cursor: 'pointer', marginBottom: 12 }}
            onClick={() => navigate(`/workout/${workout.id}`)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: 22, marginBottom: 6 }}>{workout.name}</h2>
                <p className="text-muted" style={{ fontSize: 14 }}>
                  {exerciseCount} cviků
                </p>
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: 'var(--blue-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--blue)',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                →
              </div>
            </div>

            {lastSession && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: 13, color: 'var(--text3)' }}>
                  Naposledy: <span style={{ color: 'var(--text2)' }}>{formatDate(lastSession.date)}</span>
                </p>
              </div>
            )}
            {!lastSession && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <p style={{ fontSize: 13, color: 'var(--text3)' }}>Zatím neodcvičeno</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
