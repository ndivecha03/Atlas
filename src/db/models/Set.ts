import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class WorkoutSet extends Model {
  static table = 'sets';

  @field('workout_exercise_id') workoutExerciseId!: string;
  @field('workout_id')          workoutId!:         string;
  @field('set_number')          setNumber!:         number;
  @field('weight_kg')           weightKg!:          number;
  @field('reps')                reps!:              number;
  @field('rpe')                 rpe!:               number;
  @field('completed')           completed!:         boolean;
  @field('logged_at')           loggedAt!:          number;
}
