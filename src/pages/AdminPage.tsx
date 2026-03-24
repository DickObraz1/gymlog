import { useState } from 'react';
import { useWorkouts } from '../hooks/useWorkouts';
import type { Exercise, Workout, WorkoutExercise } from '../types';

type AdminTab = 'workouts' | 'exercises';

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('workouts');

  return (
    <div className="page-content" style={{ paddingTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <span style={{ fontSize: 28 }}>⚙️</span>
        <h1>Správa</h1>
      </div>

      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          background: 'var(--bg3)',
          borderRadius: 'var(--radius-sm)',
          padding: 4,
          marginBottom: 20,
          border: '1px solid var(--border)',
        }}
      >
        {(['workouts', 'exercises'] as AdminTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 6,
              background: tab === t ? 'var(--bg2)' : 'transparent',
              color: tab === t ? 'var(--blue)' : 'var(--text2)',
              fontWeight: tab === t ? 700 : 500,
              fontSize: 14,
              boxShadow: tab === t ? 'var(--shadow)' : 'none',
              border: tab === t ? '1px solid var(--border)' : '1px solid transparent',
            }}
          >
            {t === 'workouts' ? '🏋️ Tréninky' : '💪 Cviky'}
          </button>
        ))}
      </div>

      {tab === 'workouts' ? <WorkoutsAdmin /> : <ExercisesAdmin />}
    </div>
  );
}

/* ─── Workouts Admin ─── */
function WorkoutsAdmin() {
  const { workouts, exercises, saveWorkout, deleteWorkout, updateWorkoutExercises } = useWorkouts();
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [showNewWorkout, setShowNewWorkout] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleSaveNew = () => {
    if (!newWorkoutName.trim()) return;
    saveWorkout({ id: crypto.randomUUID(), name: newWorkoutName.trim(), exercises: [] });
    setNewWorkoutName('');
    setShowNewWorkout(false);
  };

  return (
    <div>
      {workouts.map((workout) => (
        <div key={workout.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{workout.name}</div>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>
                {workout.exercises.length} cviků
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setEditingWorkout(workout)}
                style={{ background: 'var(--blue-light)', color: 'var(--blue)', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}
              >
                Upravit
              </button>
              <button
                onClick={() => setConfirmDelete(workout.id)}
                style={{ background: '#fee2e2', color: 'var(--red)', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}
              >
                Smazat
              </button>
            </div>
          </div>
        </div>
      ))}

      {showNewWorkout ? (
        <div className="card" style={{ marginTop: 12 }}>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>Název nového tréninku:</p>
          <input type="text" value={newWorkoutName} onChange={(e) => setNewWorkoutName(e.target.value)}
            placeholder="např. Trénink D" style={{ marginBottom: 12, fontSize: 16 }} autoFocus />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-primary" onClick={handleSaveNew} style={{ flex: 1 }}>Přidat</button>
            <button className="btn-secondary" onClick={() => setShowNewWorkout(false)} style={{ flex: 1 }}>Zrušit</button>
          </div>
        </div>
      ) : (
        <button className="btn-secondary" style={{ marginTop: 12, borderStyle: 'dashed', color: 'var(--blue)' }}
          onClick={() => setShowNewWorkout(true)}>
          + Nový trénink
        </button>
      )}

      {/* Edit workout exercises modal */}
      {editingWorkout && (
        <WorkoutExercisesEditor
          workout={editingWorkout}
          allExercises={exercises}
          onSave={(wes) => { updateWorkoutExercises(editingWorkout.id, wes); setEditingWorkout(null); }}
          onClose={() => setEditingWorkout(null)}
        />
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="modal-overlay center" onClick={() => setConfirmDelete(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 12 }}>Smazat trénink?</h3>
            <p className="text-muted" style={{ marginBottom: 20, fontSize: 15 }}>Tato akce je nevratná.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" onClick={() => setConfirmDelete(null)} style={{ flex: 1 }}>Zrušit</button>
              <button onClick={() => { deleteWorkout(confirmDelete); setConfirmDelete(null); }}
                style={{ flex: 1, background: 'var(--red)', color: 'white', padding: '14px', borderRadius: 8, fontWeight: 700 }}>
                Smazat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Workout Exercises Editor ─── */
function WorkoutExercisesEditor({
  workout, allExercises, onSave, onClose,
}: {
  workout: Workout;
  allExercises: Exercise[];
  onSave: (wes: WorkoutExercise[]) => void;
  onClose: () => void;
}) {
  const [wes, setWes] = useState<WorkoutExercise[]>(workout.exercises.map((we) => ({ ...we })));
  const [adding, setAdding] = useState(false);

  const updateWe = (idx: number, field: keyof WorkoutExercise, value: string | number) => {
    setWes((prev) => prev.map((w, i) => i === idx ? { ...w, [field]: value } : w));
  };

  const removeWe = (idx: number) => setWes((prev) => prev.filter((_, i) => i !== idx));

  const addExercise = (exerciseId: string) => {
    if (wes.find((w) => w.exerciseId === exerciseId)) return;
    setWes((prev) => [...prev, { exerciseId, targetSets: 3, targetReps: '8–12', referenceWeight: '' }]);
    setAdding(false);
  };

  const availableToAdd = allExercises.filter((e) => !wes.find((w) => w.exerciseId === e.id));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90dvh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3>{workout.name}</h3>
          <button className="btn-ghost" onClick={onClose} style={{ fontSize: 20 }}>✕</button>
        </div>

        {wes.map((we, idx) => {
          const ex = allExercises.find((e) => e.id === we.exerciseId);
          return (
            <div key={we.exerciseId} className="card" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {ex?.emoji} {ex?.name}
                </div>
                <button onClick={() => removeWe(idx)}
                  style={{ background: '#fee2e2', color: 'var(--red)', padding: '6px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                  Odebrat
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Série</p>
                  <input type="number" value={we.targetSets} onChange={(e) => updateWe(idx, 'targetSets', parseInt(e.target.value) || 0)}
                    style={{ fontSize: 16, minHeight: 44 }} />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Opakování</p>
                  <input type="text" value={we.targetReps} onChange={(e) => updateWe(idx, 'targetReps', e.target.value)}
                    style={{ fontSize: 13, minHeight: 44 }} />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4 }}>Ref. váha</p>
                  <input type="text" value={we.referenceWeight} onChange={(e) => updateWe(idx, 'referenceWeight', e.target.value)}
                    style={{ fontSize: 13, minHeight: 44 }} />
                </div>
              </div>
            </div>
          );
        })}

        {adding ? (
          <div className="card" style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>Vyber cvik:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
              {availableToAdd.map((ex) => (
                <button key={ex.id} onClick={() => addExercise(ex.id)}
                  style={{ textAlign: 'left', padding: '10px 14px', background: 'var(--bg3)', borderRadius: 8, fontSize: 14, border: '1px solid var(--border)' }}>
                  {ex.emoji} {ex.name}
                </button>
              ))}
            </div>
            <button className="btn-secondary" onClick={() => setAdding(false)} style={{ marginTop: 10 }}>Zrušit</button>
          </div>
        ) : (
          <button className="btn-secondary" style={{ marginBottom: 16, borderStyle: 'dashed', color: 'var(--blue)' }}
            onClick={() => setAdding(true)}>
            + Přidat cvik
          </button>
        )}

        <button className="btn-primary" onClick={() => onSave(wes)}>Uložit změny</button>
      </div>
    </div>
  );
}

/* ─── Exercises Admin ─── */
function ExercisesAdmin() {
  const { exercises, saveExercise, deleteExercise } = useWorkouts();
  const [editingEx, setEditingEx] = useState<Exercise | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const emptyEx: Exercise = { id: '', name: '', muscleGroup: '', emoji: '💪', instructions: '' };

  return (
    <div>
      {exercises.map((ex) => (
        <div key={ex.id} className="card" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>{ex.emoji}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{ex.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>{ex.muscleGroup}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setEditingEx(ex)}
                style={{ background: 'var(--blue-light)', color: 'var(--blue)', padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                Upravit
              </button>
              <button onClick={() => setConfirmDelete(ex.id)}
                style={{ background: '#fee2e2', color: 'var(--red)', padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
                Smazat
              </button>
            </div>
          </div>
        </div>
      ))}

      <button className="btn-secondary" style={{ marginTop: 12, borderStyle: 'dashed', color: 'var(--blue)' }}
        onClick={() => setShowNew(true)}>
        + Nový cvik
      </button>

      {(editingEx || showNew) && (
        <ExerciseEditor
          exercise={editingEx ?? emptyEx}
          isNew={!editingEx}
          onSave={(ex) => {
            saveExercise(ex);
            setEditingEx(null);
            setShowNew(false);
          }}
          onClose={() => { setEditingEx(null); setShowNew(false); }}
        />
      )}

      {confirmDelete && (
        <div className="modal-overlay center" onClick={() => setConfirmDelete(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 12 }}>Smazat cvik?</h3>
            <p className="text-muted" style={{ marginBottom: 20, fontSize: 15 }}>Cvik bude odebrán i ze všech tréninků.</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-secondary" onClick={() => setConfirmDelete(null)} style={{ flex: 1 }}>Zrušit</button>
              <button onClick={() => { deleteExercise(confirmDelete); setConfirmDelete(null); }}
                style={{ flex: 1, background: 'var(--red)', color: 'white', padding: '14px', borderRadius: 8, fontWeight: 700 }}>
                Smazat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Exercise Editor ─── */
function ExerciseEditor({
  exercise, isNew, onSave, onClose,
}: {
  exercise: Exercise;
  isNew: boolean;
  onSave: (ex: Exercise) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Exercise>({
    ...exercise,
    id: exercise.id || crypto.randomUUID(),
  });

  const update = (field: keyof Exercise, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3>{isNew ? 'Nový cvik' : 'Upravit cvik'}</h3>
          <button className="btn-ghost" onClick={onClose} style={{ fontSize: 20 }}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 10 }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>Emoji</p>
              <input type="text" value={form.emoji} onChange={(e) => update('emoji', e.target.value)}
                style={{ textAlign: 'center', fontSize: 24, minHeight: 52 }} maxLength={2} />
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>Název cviku *</p>
              <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)}
                placeholder="Dřep s osou…" style={{ fontSize: 15, minHeight: 52 }} />
            </div>
          </div>

          <div>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>Svalová skupina</p>
            <input type="text" value={form.muscleGroup} onChange={(e) => update('muscleGroup', e.target.value)}
              placeholder="Kvadricepsy, hýždě…" style={{ fontSize: 15 }} />
          </div>

          <div>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 6 }}>Instrukce (technika provedení)</p>
            <textarea value={form.instructions} onChange={(e) => update('instructions', e.target.value)}
              placeholder="Popis správné techniky…" style={{ minHeight: 120 }} />
          </div>

          <button className="btn-primary" onClick={handleSave}>
            {isNew ? 'Přidat cvik' : 'Uložit změny'}
          </button>
        </div>
      </div>
    </div>
  );
}
