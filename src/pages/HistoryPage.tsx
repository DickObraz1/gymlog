import { useState } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useSessionHistory } from '../hooks/useSessionHistory';
import { useWorkouts } from '../hooks/useWorkouts';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function HistoryPage() {
  const { currentUser } = useCurrentUser();
  const { getUserSessions, getExerciseHistory, deleteSession } = useSessionHistory();
  const { workouts, getExercise } = useWorkouts();
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [chartExerciseId, setChartExerciseId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!currentUser) return null;

  const sessions = getUserSessions(currentUser.id);

  const grouped: Record<string, typeof sessions> = {};
  for (const s of sessions) {
    if (!grouped[s.date]) grouped[s.date] = [];
    grouped[s.date].push(s);
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('cs-CZ', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const allExerciseIds = new Set<string>();
  for (const session of sessions) {
    for (const entry of session.sets) {
      allExerciseIds.add(entry.exerciseId);
    }
  }

  return (
    <div className="page-content" style={{ paddingTop: 24 }}>
      <h1 style={{ marginBottom: 20 }}>Historie</h1>

      {sessions.length === 0 && (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <p className="text-muted">Zatím žádné tréninky.</p>
        </div>
      )}

      {/* Exercise chart picker */}
      {allExerciseIds.size > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 12, color: 'var(--text2)', fontWeight: 500, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
            Pokrok v cviku
          </h3>
          <div style={{ overflowX: 'auto', display: 'flex', gap: 8, paddingBottom: 4 }}>
            {[...allExerciseIds].map((id) => {
              const ex = getExercise(id);
              if (!ex) return null;
              return (
                <button
                  key={id}
                  onClick={() => setChartExerciseId(chartExerciseId === id ? null : id)}
                  style={{
                    whiteSpace: 'nowrap',
                    padding: '8px 14px',
                    borderRadius: 100,
                    background: chartExerciseId === id ? 'var(--blue)' : 'var(--bg3)',
                    color: chartExerciseId === id ? 'white' : 'var(--text2)',
                    fontSize: 13,
                    fontWeight: 500,
                    minHeight: 36,
                  }}
                >
                  {ex.emoji} {ex.name}
                </button>
              );
            })}
          </div>

          {chartExerciseId && <ExerciseChart exerciseId={chartExerciseId} userId={currentUser.id} getExerciseHistory={getExerciseHistory} getExercise={getExercise} />}
        </div>
      )}

      {/* Session list */}
      <h3 style={{ marginBottom: 12, color: 'var(--text2)', fontWeight: 500, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
        Tréninky
      </h3>
      {Object.entries(grouped).map(([date, daySessions]) => (
        <div key={date} style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 8, paddingLeft: 2 }}>
            {formatDate(date)}
          </p>
          {daySessions.map((session) => {
            const workout = workouts.find((w) => w.id === session.workoutId);
            const totalVolume = session.sets.reduce(
              (acc, e) => acc + e.sets.reduce((a, s) => a + s.weight * s.reps, 0),
              0
            );
            const isExpanded = expandedSession === session.id;

            return (
              <div
                key={session.id}
                className="card"
                style={{ marginBottom: 8 }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{workout?.name ?? 'Trénink'}</div>
                    <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>
                      {session.sets.length} cviků · {totalVolume} kg objem
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(session.id); }}
                      style={{ color: 'var(--red)', fontSize: 18, padding: '4px 6px', lineHeight: 1 }}
                      title="Smazat trénink"
                    >
                      🗑
                    </button>
                    <span style={{ color: 'var(--text3)', fontSize: 18 }}>
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: 14, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                    {session.sets.map((entry) => {
                      const ex = getExercise(entry.exerciseId);
                      if (!ex) return null;
                      return (
                        <div key={entry.exerciseId} style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                            {ex.emoji} {ex.name}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                            {entry.sets.map((s, i) => (
                              <span key={i} className="chip">
                                {i + 1}. {s.reps}× {s.weight} kg
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
      {confirmDeleteId && (
        <div className="modal-overlay center" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 12 }}>Smazat trénink?</h3>
            <p className="text-muted" style={{ marginBottom: 20, fontSize: 15 }}>
              Tato akce je nevratná.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                Zrušit
              </button>
              <button
                className="btn-ghost"
                onClick={() => { deleteSession(confirmDeleteId); setConfirmDeleteId(null); }}
                style={{ color: 'var(--red)' }}
              >
                Smazat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExerciseChart({
  exerciseId,
  userId,
  getExerciseHistory,
  getExercise,
}: {
  exerciseId: string;
  userId: string;
  getExerciseHistory: (userId: string, exerciseId: string) => { date: string; maxWeight: number; totalVolume: number }[];
  getExercise: (id: string) => { name: string; emoji: string } | undefined;
}) {
  const data = getExerciseHistory(userId, exerciseId);
  const ex = getExercise(exerciseId);

  if (data.length < 2) {
    return (
      <div className="card" style={{ marginTop: 12, textAlign: 'center', padding: 20 }}>
        <p className="text-muted" style={{ fontSize: 14 }}>
          Potřeba alespoň 2 záznamy pro graf.
        </p>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' }),
    kg: d.maxWeight,
  }));

  return (
    <div className="card" style={{ marginTop: 12, padding: '16px 8px' }}>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12, paddingLeft: 8 }}>
        {ex?.emoji} {ex?.name} – max váha (kg)
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fill: 'var(--text3)', fontSize: 11 }} />
          <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8 }}
            labelStyle={{ color: 'var(--text2)' }}
            itemStyle={{ color: 'var(--blue)' }}
          />
          <Line
            type="monotone"
            dataKey="kg"
            stroke="var(--blue)"
            strokeWidth={2}
            dot={{ fill: 'var(--blue)', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
