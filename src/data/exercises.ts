export interface Exercise {
  id: string;
  name: string;
  category: 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'cardio';
  defaultSets: number;
  defaultReps: number;
  defaultWeightKg: number;
}

export const EXERCISES: Exercise[] = [
  // Chest
  { id: 'bench_press',       name: 'Bench press',         category: 'chest',     defaultSets: 4, defaultReps: 8,  defaultWeightKg: 60  },
  { id: 'incline_press',     name: 'Incline press',        category: 'chest',     defaultSets: 3, defaultReps: 10, defaultWeightKg: 50  },
  { id: 'dumbbell_fly',      name: 'Dumbbell fly',         category: 'chest',     defaultSets: 3, defaultReps: 12, defaultWeightKg: 16  },
  { id: 'push_up',           name: 'Push up',              category: 'chest',     defaultSets: 3, defaultReps: 15, defaultWeightKg: 0   },
  // Back
  { id: 'deadlift',          name: 'Deadlift',             category: 'back',      defaultSets: 4, defaultReps: 5,  defaultWeightKg: 100 },
  { id: 'pull_up',           name: 'Pull up',              category: 'back',      defaultSets: 3, defaultReps: 8,  defaultWeightKg: 0   },
  { id: 'barbell_row',       name: 'Barbell row',          category: 'back',      defaultSets: 4, defaultReps: 8,  defaultWeightKg: 70  },
  { id: 'lat_pulldown',      name: 'Lat pulldown',         category: 'back',      defaultSets: 3, defaultReps: 10, defaultWeightKg: 55  },
  { id: 'seated_cable_row',  name: 'Seated cable row',     category: 'back',      defaultSets: 3, defaultReps: 12, defaultWeightKg: 50  },
  // Shoulders
  { id: 'ohp',               name: 'Overhead press',       category: 'shoulders', defaultSets: 4, defaultReps: 8,  defaultWeightKg: 40  },
  { id: 'lateral_raise',     name: 'Lateral raise',        category: 'shoulders', defaultSets: 3, defaultReps: 15, defaultWeightKg: 10  },
  { id: 'front_raise',       name: 'Front raise',          category: 'shoulders', defaultSets: 3, defaultReps: 12, defaultWeightKg: 10  },
  { id: 'face_pull',         name: 'Face pull',            category: 'shoulders', defaultSets: 3, defaultReps: 15, defaultWeightKg: 20  },
  // Arms
  { id: 'barbell_curl',      name: 'Barbell curl',         category: 'arms',      defaultSets: 3, defaultReps: 10, defaultWeightKg: 30  },
  { id: 'hammer_curl',       name: 'Hammer curl',          category: 'arms',      defaultSets: 3, defaultReps: 12, defaultWeightKg: 14  },
  { id: 'tricep_pushdown',   name: 'Tricep pushdown',      category: 'arms',      defaultSets: 3, defaultReps: 12, defaultWeightKg: 25  },
  { id: 'skull_crusher',     name: 'Skull crusher',        category: 'arms',      defaultSets: 3, defaultReps: 10, defaultWeightKg: 30  },
  // Legs
  { id: 'squat',             name: 'Back squat',           category: 'legs',      defaultSets: 4, defaultReps: 6,  defaultWeightKg: 80  },
  { id: 'front_squat',       name: 'Front squat',          category: 'legs',      defaultSets: 3, defaultReps: 8,  defaultWeightKg: 60  },
  { id: 'leg_press',         name: 'Leg press',            category: 'legs',      defaultSets: 4, defaultReps: 10, defaultWeightKg: 120 },
  { id: 'romanian_deadlift', name: 'Romanian deadlift',    category: 'legs',      defaultSets: 3, defaultReps: 10, defaultWeightKg: 70  },
  { id: 'leg_curl',          name: 'Leg curl',             category: 'legs',      defaultSets: 3, defaultReps: 12, defaultWeightKg: 40  },
  { id: 'calf_raise',        name: 'Calf raise',           category: 'legs',      defaultSets: 4, defaultReps: 15, defaultWeightKg: 50  },
  { id: 'lunge',             name: 'Walking lunge',        category: 'legs',      defaultSets: 3, defaultReps: 12, defaultWeightKg: 20  },
  // Core
  { id: 'plank',             name: 'Plank',                category: 'core',      defaultSets: 3, defaultReps: 60, defaultWeightKg: 0   },
  { id: 'ab_wheel',          name: 'Ab wheel rollout',     category: 'core',      defaultSets: 3, defaultReps: 10, defaultWeightKg: 0   },
  { id: 'cable_crunch',      name: 'Cable crunch',         category: 'core',      defaultSets: 3, defaultReps: 15, defaultWeightKg: 30  },
  { id: 'hanging_leg_raise', name: 'Hanging leg raise',    category: 'core',      defaultSets: 3, defaultReps: 12, defaultWeightKg: 0   },
];

export const WORKOUT_TEMPLATES = [
  {
    id: 'upper_strength',
    name: 'Upper body strength',
    estimatedMinutes: 52,
    level: 'Intermediate',
    exercises: ['bench_press', 'barbell_row', 'ohp', 'pull_up', 'barbell_curl', 'tricep_pushdown'],
  },
  {
    id: 'lower_power',
    name: 'Lower body power',
    estimatedMinutes: 48,
    level: 'Intermediate',
    exercises: ['squat', 'romanian_deadlift', 'leg_press', 'leg_curl', 'calf_raise'],
  },
  {
    id: 'push_day',
    name: 'Push day',
    estimatedMinutes: 50,
    level: 'Intermediate',
    exercises: ['bench_press', 'incline_press', 'ohp', 'lateral_raise', 'tricep_pushdown', 'skull_crusher'],
  },
  {
    id: 'pull_day',
    name: 'Pull day',
    estimatedMinutes: 48,
    level: 'Intermediate',
    exercises: ['deadlift', 'pull_up', 'barbell_row', 'lat_pulldown', 'barbell_curl', 'hammer_curl'],
  },
  {
    id: 'leg_day',
    name: 'Leg day',
    estimatedMinutes: 55,
    level: 'Intermediate',
    exercises: ['squat', 'front_squat', 'leg_press', 'romanian_deadlift', 'leg_curl', 'calf_raise', 'lunge'],
  },
];

