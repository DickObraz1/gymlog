import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useWorkouts } from '../hooks/useWorkouts';
import { useSessionHistory } from '../hooks/useSessionHistory';
import Celebration from '../components/Celebration';
import type { SetEntry } from '../types';

type View = 'picker' | 'logger';

export default function ActiveWorkoutPage() {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const { workouts, getExercise } = useWorkouts();
  const {
    startSession,
    updateSessionSets,
    completeSession,
    getLastExerciseEntry,
    getPersonalBest,
  } = useSessionHistory();

  const workout = workouts.find((w) => w.id === workoutId);
  const sessionRef = useRef<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [view, setView] = useState<View>('picker');
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [showInstructions, setShowInstructions] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [sessionSets, setSessionSets] = useState<Record<string, SetEntry[]>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const startTimeRef = useRef<Date>(new Date());

  useEffect(() => {
    if (!workout || !currentUser || sessionRef.current) return;
    const session = startSession(currentUser.id, workout.id);
    sessionRef.current = session.id;
    setSessionId(session.id);
    startTimeRef.current = new Date();
  }, [workout, currentUser, startSession]);

  const handleSelectExercise = useCallback((exerciseId: string) => {
    setActiveExerciseId(exerciseId);
    setView('logger');
  }, []);

  const handleDone = useCallback(
    (exerciseId: string, sets: SetEntry[]) => {
      if (!sessionId || !currentUser) return;

      // Check for PR
      const prevBest = getPersonalBest(currentUser.id, exerciseId);
      const newBest = Math.max(...sets.map((s) => s.weight), 0);
      if (newBest > prevBest && newBest > 0) {
        setShowCelebration(true);
      }

      updateSessionSets(sessionId, exerciseId, sets);
      setSessionSets((prev) => ({ ...prev, [exerciseId]: sets }));
      setCompletedExercises((prev) => new Set([...prev, exerciseId]));
      setView('picker');
      setActiveExerciseId(null);
    },
    [sessionId, currentUser, getPersonalBest, updateSessionSets]
  );

  const handleFinish = () => {
    if (!sessionId) return;
    completeSession(sessionId);
    navigate(`/session/${sessionId}`, { replace: true });
  };

  if (!workout || !currentUser) {
    return <div className="page-content"><p>Trénink nenalezen.</p></div>;
  }

  const totalExercises = workout.exercises.length;
  const doneCount = completedExercises.size;

  return (
    <>
      <Celebration show={showCelebration} onDone={() => setShowCelebration(false)} />

      {/* Top progress bar */}
      <div style={{ padding: '12px 16px 0', background: 'var(--bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <button
            className="btn-ghost"
            style={{ padding: '4px 0', color: 'var(--text2)', fontSize: 14 }}
            onClick={() => {
              if (view === 'logger') {
                setView('picker');
                setActiveExerciseId(null);
              } else {
                setShowFinishDialog(true);
              }
            }}
          >
            {view === 'logger' ? '← Zpět' : '✕'}
          </button>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{workout.name}</span>
          <span style={{ fontSize: 13, color: 'var(--text2)' }}>
            {doneCount} / {totalExercises}
          </span>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${totalExercises > 0 ? (doneCount / totalExercises) * 100 : 0}%` }}
          />
        </div>
      </div>

      {view === 'picker' ? (
        <ExercisePicker
          workout={workout}
          completedExercises={completedExercises}
          getExercise={getExercise}
          getLastExerciseEntry={(id) =>
            currentUser ? getLastExerciseEntry(currentUser.id, id) : null
          }
          onSelect={handleSelectExercise}
        />
      ) : (
        activeExerciseId && (
          <ExerciseLogger
            exerciseId={activeExerciseId}
            workout={workout}
            getExercise={getExercise}
            getLastExerciseEntry={(id) =>
              currentUser ? getLastExerciseEntry(currentUser.id, id) : null
            }
            existingSets={sessionSets[activeExerciseId] ?? null}
            showInstructions={showInstructions}
            onShowInstructions={() => setShowInstructions(true)}
            onHideInstructions={() => setShowInstructions(false)}
            onDone={handleDone}
          />
        )
      )}

      {/* Floating finish button */}
      {view === 'picker' && (
        <div className="fab">
          <button
            className="btn-primary"
            style={{ background: doneCount === totalExercises ? 'var(--green)' : 'var(--blue)' }}
            onClick={() => setShowFinishDialog(true)}
          >
            Ukončit trénink
          </button>
        </div>
      )}

      {/* Finish dialog */}
      {showFinishDialog && (
        <div className="modal-overlay center" onClick={() => setShowFinishDialog(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 12 }}>Ukončit trénink?</h3>
            <p className="text-muted" style={{ marginBottom: 20, fontSize: 15 }}>
              Dokončeno {doneCount} / {totalExercises} cviků.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" onClick={() => setShowFinishDialog(false)} style={{ flex: 1 }}>
                Pokračovat
              </button>
              <button className="btn-primary" onClick={handleFinish} style={{ flex: 1 }}>
                Ukončit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Exercise Picker ─── */
function ExercisePicker({
  workout,
  completedExercises,
  getExercise,
  getLastExerciseEntry,
  onSelect,
}: {
  workout: ReturnType<typeof useWorkouts>['workouts'][0];
  completedExercises: Set<string>;
  getExercise: ReturnType<typeof useWorkouts>['getExercise'];
  getLastExerciseEntry: (id: string) => { sets: SetEntry[] } | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="page-content">
      <p className="text-muted" style={{ marginBottom: 16, fontSize: 14 }}>
        Vyber cvik, který chceš udělat:
      </p>
      <div className="exercise-grid">
        {workout.exercises.map((we) => {
          const ex = getExercise(we.exerciseId);
          if (!ex) return null;
          const done = completedExercises.has(we.exerciseId);
          const last = getLastExerciseEntry(we.exerciseId);
          const lastInfo = last && last.sets.length > 0
            ? `${last.sets.length}× ${last.sets[0].weight} kg`
            : null;

          return (
            <div
              key={we.exerciseId}
              className="card"
              style={{
                cursor: 'pointer',
                position: 'relative',
                borderColor: done ? 'var(--green)' : 'var(--border)',
                background: done ? 'rgba(34,197,94,0.08)' : 'var(--card)',
                minHeight: 110,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
              onClick={() => onSelect(we.exerciseId)}
            >
              {done && (
                <span
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    fontSize: 16,
                  }}
                >
                  ✅
                </span>
              )}
              <span style={{ fontSize: 28 }}>{ex.emoji}</span>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{ex.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>{ex.muscleGroup}</div>
              <div style={{ fontSize: 12, color: 'var(--blue)', marginTop: 2 }}>
                {we.targetSets} × {we.targetReps}
              </div>
              {lastInfo && (
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>
                  Naposledy: {lastInfo}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Exercise Logger ─── */
function ExerciseLogger({
  exerciseId,
  workout,
  getExercise,
  getLastExerciseEntry,
  existingSets,
  showInstructions,
  onShowInstructions,
  onHideInstructions,
  onDone,
}: {
  exerciseId: string;
  workout: ReturnType<typeof useWorkouts>['workouts'][0];
  getExercise: ReturnType<typeof useWorkouts>['getExercise'];
  getLastExerciseEntry: (id: string) => { sets: SetEntry[] } | null;
  existingSets: SetEntry[] | null;
  showInstructions: boolean;
  onShowInstructions: () => void;
  onHideInstructions: () => void;
  onDone: (exerciseId: string, sets: SetEntry[]) => void;
}) {
  const workoutExercise = workout.exercises.find((we) => we.exerciseId === exerciseId);
  const exercise = getExercise(exerciseId);
  const lastEntry = getLastExerciseEntry(exerciseId);

  const defaultWeight =
    lastEntry && lastEntry.sets.length > 0 ? String(lastEntry.sets[0].weight) : '';

  const [sets, setSets] = useState<{ reps: string; weight: string }[]>(() => {
    if (existingSets) {
      return existingSets.map((s) => ({ reps: String(s.reps), weight: String(s.weight) }));
    }
    const count = workoutExercise?.targetSets ?? 3;
    return Array.from({ length: count }, () => ({
      reps: '',
      weight: defaultWeight,
    }));
  });

  if (!exercise || !workoutExercise) return null;

  const updateSet = (idx: number, field: 'reps' | 'weight', value: string) => {
    setSets((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const addSet = () => {
    setSets((prev) => [...prev, { reps: '', weight: defaultWeight }]);
  };

  const handleDone = () => {
    const parsed: SetEntry[] = sets
      .filter((s) => s.reps !== '' || s.weight !== '')
      .map((s) => ({
        reps: parseInt(s.reps) || 0,
        weight: parseFloat(s.weight) || 0,
      }));
    onDone(exerciseId, parsed);
  };

  const lastDisplay = lastEntry && lastEntry.sets.length > 0
    ? `${lastEntry.sets.length}× ${lastEntry.sets[0].weight} kg (${lastEntry.sets[0].reps} op.)`
    : null;

  return (
    <div className="page-content">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 32 }}>{exercise.emoji}</span>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 19 }}>{exercise.name}</h2>
          <p style={{ fontSize: 13, color: 'var(--text3)' }}>{exercise.muscleGroup}</p>
        </div>
        <button
          onClick={onShowInstructions}
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--bg3)',
            color: 'var(--text2)',
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          ?
        </button>
      </div>

      {/* Info cards */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <div className="card" style={{ flex: 1, padding: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Cíl</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--blue)' }}>
            {workoutExercise.targetSets} série
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)' }}>{workoutExercise.targetReps} op.</div>
        </div>
        <div className="card" style={{ flex: 1, padding: 12, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Ref. váha</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
            {workoutExercise.referenceWeight}
          </div>
        </div>
        {lastDisplay && (
          <div className="card" style={{ flex: 1, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Naposledy</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{lastDisplay}</div>
          </div>
        )}
      </div>

      {/* Sets */}
      <div style={{ marginBottom: 16 }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr', gap: 8, marginBottom: 8 }}>
          <div />
          <div style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center' }}>Opakování</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'center' }}>Váha (kg)</div>
        </div>

        {sets.map((s, i) => (
          <div
            key={i}
            style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr', gap: 8, marginBottom: 8 }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                color: 'var(--text3)',
                fontWeight: 600,
              }}
            >
              {i + 1}
            </div>
            <input
              type="number"
              inputMode="numeric"
              placeholder="–"
              value={s.reps}
              onChange={(e) => updateSet(i, 'reps', e.target.value)}
              style={{ minHeight: 56 }}
            />
            <input
              type="number"
              inputMode="decimal"
              placeholder="–"
              value={s.weight}
              onChange={(e) => updateSet(i, 'weight', e.target.value)}
              style={{ minHeight: 56 }}
            />
          </div>
        ))}
      </div>

      <button
        className="btn-secondary"
        onClick={addSet}
        style={{ marginBottom: 16, color: 'var(--blue)', borderColor: 'var(--blue-light)' }}
      >
        + Přidat sérii
      </button>

      <button className="btn-primary" onClick={handleDone}>
        Hotovo ✓
      </button>

      {/* Instructions modal */}
      {showInstructions && (
        <div className="modal-overlay" onClick={onHideInstructions}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 30 }}>{exercise.emoji}</span>
                <div>
                  <h3>{exercise.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text3)' }}>{exercise.muscleGroup}</p>
                </div>
              </div>
              <button className="btn-ghost" onClick={onHideInstructions} style={{ fontSize: 20, padding: '4px 8px' }}>
                ✕
              </button>
            </div>
            <p style={{ lineHeight: 1.7, color: 'var(--text2)', fontSize: 15 }}>
              {exercise.instructions}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
