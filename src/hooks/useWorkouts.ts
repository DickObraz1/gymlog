import { useCallback } from 'react';
import { useLocalStorage } from './useStorage';
import { EXERCISES, WORKOUTS, DATA_VERSION } from '../data/seed';
import type { Exercise, Workout, WorkoutExercise } from '../types';

const EXERCISES_KEY = 'gymlog_exercises';
const WORKOUTS_KEY = 'gymlog_workouts';
const VERSION_KEY = 'gymlog_data_version';

function initData<T>(key: string, seed: T): T {
  const version = localStorage.getItem(VERSION_KEY);
  if (version !== DATA_VERSION) {
    localStorage.setItem(key, JSON.stringify(seed));
    localStorage.setItem(VERSION_KEY, DATA_VERSION);
    return seed;
  }
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : seed;
  } catch {
    return seed;
  }
}

export function useWorkouts() {
  const [exercises, setExercises] = useLocalStorage<Exercise[]>(
    EXERCISES_KEY,
    () => initData(EXERCISES_KEY, EXERCISES) as Exercise[]
  );
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>(
    WORKOUTS_KEY,
    () => initData(WORKOUTS_KEY, WORKOUTS) as Workout[]
  );

  const getExercise = useCallback(
    (id: string) => exercises.find((e) => e.id === id),
    [exercises]
  );

  const saveExercise = useCallback(
    (exercise: Exercise) => {
      setExercises((prev) => {
        const exists = prev.find((e) => e.id === exercise.id);
        return exists
          ? prev.map((e) => (e.id === exercise.id ? exercise : e))
          : [...prev, exercise];
      });
    },
    [setExercises]
  );

  const deleteExercise = useCallback(
    (id: string) => {
      setExercises((prev) => prev.filter((e) => e.id !== id));
      setWorkouts((prev) =>
        prev.map((w) => ({
          ...w,
          exercises: w.exercises.filter((we) => we.exerciseId !== id),
        }))
      );
    },
    [setExercises, setWorkouts]
  );

  const saveWorkout = useCallback(
    (workout: Workout) => {
      setWorkouts((prev) => {
        const exists = prev.find((w) => w.id === workout.id);
        return exists
          ? prev.map((w) => (w.id === workout.id ? workout : w))
          : [...prev, workout];
      });
    },
    [setWorkouts]
  );

  const deleteWorkout = useCallback(
    (id: string) => {
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    },
    [setWorkouts]
  );

  const updateWorkoutExercises = useCallback(
    (workoutId: string, exercises: WorkoutExercise[]) => {
      setWorkouts((prev) =>
        prev.map((w) => (w.id === workoutId ? { ...w, exercises } : w))
      );
    },
    [setWorkouts]
  );

  return {
    exercises,
    workouts,
    getExercise,
    saveExercise,
    deleteExercise,
    saveWorkout,
    deleteWorkout,
    updateWorkoutExercises,
  };
}
