export interface User {
  id: string;
  name: string;
  isAdmin?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  instructions: string;
  emoji: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  targetSets: number;
  targetReps: string;
  referenceWeight: string;
}

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
}

export interface SetEntry {
  reps: number;
  weight: number;
}

export interface ExerciseEntry {
  exerciseId: string;
  sets: SetEntry[];
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutId: string;
  date: string;
  startTime: string;
  endTime?: string;
  sets: ExerciseEntry[];
  completed: boolean;
}
