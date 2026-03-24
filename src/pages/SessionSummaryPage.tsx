import { useParams, useNavigate } from 'react-router-dom';
import { useSessionHistory } from '../hooks/useSessionHistory';
import { useWorkouts } from '../hooks/useWorkouts';

export default function SessionSummaryPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { getSession } = useSessionHistory();
  const { workouts, getExercise } = useWorkouts();

  const session = sessionId ? getSession(sessionId) : null;
  const workout = session ? workouts.find((w) => w.id === session.workoutId) : null;

  if (!session || !workout) {
    return (
      <div className="page-content" style={{ paddingTop: 32, textAlign: 'center' }}>
        <p className="text-muted">Trénink nenalezen.</p>
        <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/')}>
          Zpět domů
        </button>
      </div>
    );
  }

  const duration = session.endTime
    ? Math.round(
        (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000
      )
    : null;

  const totalVolume = session.sets.reduce((acc, entry) => {
    return acc + entry.sets.reduce((a, s) => a + s.weight * s.reps, 0);
  }, 0);

  const date = new Date(session.date).toLocaleDateString('cs-CZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="page-content" style={{ paddingTop: 28 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <h1 style={{ fontSize: 24, marginBottom: 6 }}>Trénink dokončen!</h1>
        <p className="text-muted" style={{ fontSize: 14 }}>{date}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Trénink</div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{workout.name}</div>
        </div>
        {duration !== null && (
          <div className="card" style={{ textAlign: 'center', padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Délka</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{duration} min</div>
          </div>
        )}
        <div className="card" style={{ textAlign: 'center', padding: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Objem</div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>
            {totalVolume >= 1000
              ? `${(totalVolume / 1000).toFixed(1)} t`
              : `${totalVolume} kg`}
          </div>
        </div>
      </div>

      {/* Exercises */}
      <h3 style={{ marginBottom: 14, color: 'var(--text2)', fontWeight: 500 }}>Cviky</h3>

      {session.sets.map((entry) => {
        const ex = getExercise(entry.exerciseId);
        if (!ex) return null;
        const vol = entry.sets.reduce((a, s) => a + s.weight * s.reps, 0);

        return (
          <div key={entry.exerciseId} className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>{ex.emoji}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{ex.muscleGroup}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text3)' }}>{vol} kg obj.</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {entry.sets.map((s, i) => (
                <span key={i} className="chip">
                  {i + 1}. {s.reps}× {s.weight} kg
                </span>
              ))}
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 24 }}>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Zpět domů 🏠
        </button>
      </div>
    </div>
  );
}
