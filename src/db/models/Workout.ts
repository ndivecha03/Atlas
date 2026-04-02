import { Model } from '@nozbe/watermelondb';
import { field, readonly, date, children } from '@nozbe/watermelondb/decorators';

export class Workout extends Model {
  static table = 'workouts';
  static associations = {
    workout_exercises: { type: 'has_many' as const, foreignKey: 'workout_id' },
  };

  @field('user_id')     userId!:    string;
  @field('name')        name!:      string;
  @field('started_at')  startedAt!: number;
  @field('finished_at') finishedAt!: number;
  @field('duration')    duration!:  number;
  @field('notes')       notes!:     string;
  @field('synced')      synced!:    boolean;
}
