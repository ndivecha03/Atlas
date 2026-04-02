import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'workouts',
      columns: [
        { name: 'user_id',     type: 'string' },
        { name: 'name',        type: 'string' },
        { name: 'started_at',  type: 'number' },
        { name: 'finished_at', type: 'number', isOptional: true },
        { name: 'duration',    type: 'number', isOptional: true },
        { name: 'notes',       type: 'string', isOptional: true },
        { name: 'synced',      type: 'boolean' },
      ],
    }),
    tableSchema({
      name: 'workout_exercises',
      columns: [
        { name: 'workout_id',   type: 'string' },
        { name: 'exercise_id',  type: 'string' },
        { name: 'name',         type: 'string' },
        { name: 'order_index',  type: 'number' },
        { name: 'notes',        type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'sets',
      columns: [
        { name: 'workout_exercise_id', type: 'string' },
        { name: 'workout_id',          type: 'string' },
        { name: 'set_number',          type: 'number' },
        { name: 'weight_kg',           type: 'number' },
        { name: 'reps',                type: 'number' },
        { name: 'rpe',                 type: 'number', isOptional: true },
        { name: 'completed',           type: 'boolean' },
        { name: 'logged_at',           type: 'number' },
      ],
    }),
  ],
});

