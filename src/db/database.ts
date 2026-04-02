import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { Workout } from './models/Workout';
import { WorkoutExercise } from './models/WorkoutExercise';
import { WorkoutSet } from './models/Set';

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
  onSetUpError: (error) => {
    console.error('WatermelonDB setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Workout, WorkoutExercise, WorkoutSet],
});
