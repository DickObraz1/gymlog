import { useCallback } from 'react';
import { useLocalStorage } from './useStorage';
import type { WorkoutSession, ExerciseEntry, SetEntry } from '../types';

const SESSIONS_KEY = 'gymlog_sessions';

export function useSessionHistory() {
  const [sessions, setSessions] = useLocalStorage<WorkoutSession[]>(SESSIONS_KEY, []);

  const startSession = useCallback(
    (userId: string, workoutId: string): WorkoutSession => {
      const session: WorkoutSession = {
        id: crypto.randomUUID(),
        userId,
        workoutId,
        date: new Date().toISOString().split('T')[0],
        startTime: new Date().toISOString(),
        sets: [],
        completed: false,
      };
      setSessions((prev) => [...prev, session]);
      return session;
    },
    [setSessions]
  );

  const updateSessionSets = useCallback(
    (sessionId: string, exerciseId: string, sets: SetEntry[]) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          const existing = s.sets.find((e) => e.exerciseId === exerciseId);
          const updatedSets: ExerciseEntry[] = existing
            ? s.sets.map((e) => (e.exerciseId === exerciseId ? { ...e, sets } : e))
            : [...s.sets, { exerciseId, sets }];
          return { ...s, sets: updatedSets };
        })
      );
    },
    [setSessions]
  );

  const completeSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, completed: true, endTime: new Date().toISOString() } : s
        )
      );
    },
    [setSessions]
  );

  const getLastSessionForWorkout = useCallback(
    (userId: string, workoutId: string) => {
      return sessions
        .filter((s) => s.userId === userId && s.workoutId === workoutId && s.completed)
        .sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
    },
    [sessions]
  );

  const getLastExerciseEntry = useCallback(
    (userId: string, exerciseId: string) => {
      const relevantSessions = sessions
        .filter((s) => s.userId === userId && s.completed)
        .sort((a, b) => b.date.localeCompare(a.date));

      for (const session of relevantSessions) {
        const entry = session.sets.find((e) => e.exerciseId === exerciseId);
        if (entry && entry.sets.length > 0) return entry;
      }
      return null;
    },
    [sessions]
  );

  const getPersonalBest = useCallback(
    (userId: string, exerciseId: string): number => {
      let best = 0;
      for (const session of sessions) {
        if (session.userId !== userId || !session.completed) continue;
        const entry = session.sets.find((e) => e.exerciseId === exerciseId);
        if (entry) {
          for (const set of entry.sets) {
            if (set.weight > best) best = set.weight;
          }
        }
      }
      return best;
    },
    [sessions]
  );

  const getExerciseHistory = useCallback(
    (userId: string, exerciseId: string) => {
      const result: { date: string; maxWeight: number; totalVolume: number }[] = [];
      const sorted = [...sessions]
        .filter((s) => s.userId === userId && s.completed)
        .sort((a, b) => a.date.localeCompare(b.date));

      for (const session of sorted) {
        const entry = session.sets.find((e) => e.exerciseId === exerciseId);
        if (entry && entry.sets.length > 0) {
          const maxWeight = Math.max(...entry.sets.map((s) => s.weight));
          const totalVolume = entry.sets.reduce((acc, s) => acc + s.weight * s.reps, 0);
          result.push({ date: session.date, maxWeight, totalVolume });
        }
      }
      return result;
    },
    [sessions]
  );

  const getUserSessions = useCallback(
    (userId: string) => {
      return sessions
        .filter((s) => s.userId === userId && s.completed)
        .sort((a, b) => b.date.localeCompare(a.date));
    },
    [sessions]
  );

  const getSession = useCallback(
    (sessionId: string) => sessions.find((s) => s.id === sessionId) ?? null,
    [sessions]
  );

  const getIncompleteSession = useCallback(
    (userId: string, workoutId: string) => {
      return sessions.find(
        (s) => s.userId === userId && s.workoutId === workoutId && !s.completed
      ) ?? null;
    },
    [sessions]
  );

  const deleteSession = useCallback(
    (sessionId: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    },
    [setSessions]
  );

  return {
    sessions,
    startSession,
    updateSessionSets,
    completeSession,
    getLastSessionForWorkout,
    getLastExerciseEntry,
    getPersonalBest,
    getExerciseHistory,
    getUserSessions,
    getSession,
    getIncompleteSession,
    deleteSession,
  };
}
