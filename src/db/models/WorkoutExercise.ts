import { Model } from '@nozbe/watermelondb';
import { field, children } from '@nozbe/watermelondb/decorators';

export class WorkoutExercise extends Model {
  static table = 'workout_exercises';
  static associations = {
    sets: { type: 'has_many' as const, foreignKey: 'workout_exercise_id' },
  };

  @field('workout_id')  workoutId!:  string;
  @field('exercise_id') exerciseId!: string;
  @field('name')        name!:       string;
  @field('order_index') orderIndex!: number;
  @field('notes')       notes!:      string;
}
