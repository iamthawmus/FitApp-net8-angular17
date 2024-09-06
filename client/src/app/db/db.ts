import Dexie, { Table } from 'dexie';

export interface AppUserWorkout {
  id?: number;
  workoutDate: Date;
  workoutName: string;
  description: string;
  notes: string;
  workoutSets: WorkoutSet[];
}

export interface WorkoutSet {
  id?: number;
  appUserWorkoutID: number;
  exerciseID: number;
  setNumber: number;
  repetitionsPerSet: number;
  weightPerRepetition: number;
  durationInMinutes: number;
  distance: number;
}

export interface Exercise {
  id?: number;
  exerciseName: string;
  workoutType: string;
  muscleGroup: string;
  equipmentRequired: string;
  description: string;
}

export class AppDB extends Dexie {
  exercises!: Table<Exercise, number>;
  workoutSets!: Table<WorkoutSet, number>;
  appUserWorkouts!: Table<AppUserWorkout, number>;

  constructor() {
    super('guest-log-db');
    this.version(1).stores({
      exercises: '++id, exerciseName',
      workoutSets: '++id, appUserWorkoutID',
      appUserWorkouts: '++id, workoutDate'
    });
    this.on('populate', () => this.populate());
  }

  async populate() {

    await db.exercises.bulkAdd([
      {
        exerciseName: "Flat Bench Press",
        workoutType: "Strength",
        muscleGroup: "Chest",
        equipmentRequired: "Barbell",
        description: ""
      },
      {
        exerciseName: "Incline Bench Press",
        workoutType: "Strength",
        muscleGroup: "Chest",
        equipmentRequired: "Barbell",
        description: ""
      },
      {
        exerciseName: "Decline Bench Press",
        workoutType: "Strength",
        muscleGroup: "Chest",
        equipmentRequired: "Barbell",
        description: ""
      },
      {
        exerciseName: "Cable Fly",
        workoutType: "Strength",
        muscleGroup: "Chest",
        equipmentRequired: "Other",
        description: ""
      },
      {
        exerciseName: "Deadlift",
        workoutType: "Strength",
        muscleGroup: "Back",
        equipmentRequired: "Barbell",
        description: ""
      },
      {
        exerciseName: "Wide Grip Pull Up",
        workoutType: "Strength",
        muscleGroup: "Back",
        equipmentRequired: "",
        description: ""
      },
      {
        exerciseName: "Neutral Grip Pull Up",
        workoutType: "Strength",
        muscleGroup: "Back",
        equipmentRequired: "",
        description: ""
      },
      {
        exerciseName: "Chin Up",
        workoutType: "Strength",
        muscleGroup: "Back",
        equipmentRequired: "",
        description: ""
      },
      {
        exerciseName: "Squat",
        workoutType: "Strength",
        muscleGroup: "Legs",
        equipmentRequired: "Barbell",
        description: ""
      },
      {
        exerciseName: "Landmine Squat",
        workoutType: "Strength",
        muscleGroup: "Legs",
        equipmentRequired: "Barbell",
        description: ""
      },
      {
        exerciseName: "Rear Foot Elevated Split Squat",
        workoutType: "Strength",
        muscleGroup: "Legs",
        equipmentRequired: "Dumbbells",
        description: ""
      },
      {
        exerciseName: "Cable Kickback",
        workoutType: "Strength",
        muscleGroup: "Legs",
        equipmentRequired: "Other",
        description: ""
      },
      {
        exerciseName: "Cable Hamstring Curl",
        workoutType: "Strength",
        muscleGroup: "Legs",
        equipmentRequired: "Other",
        description: ""
      },
      {
        exerciseName: "Tricep Cable Extension",
        workoutType: "Strength",
        muscleGroup: "Arms",
        equipmentRequired: "Other",
        description: ""
      },
      {
        exerciseName: "Bicep Cable Curl",
        workoutType: "Strength",
        muscleGroup: "Arms",
        equipmentRequired: "Other",
        description: ""
      },
      {
        exerciseName: "Face Pull",
        workoutType: "Strength",
        muscleGroup: "Shoulders",
        equipmentRequired: "Other",
        description: ""
      },
      {
        exerciseName: "Lateral Raise",
        workoutType: "Strength",
        muscleGroup: "Shoulders",
        equipmentRequired: "Dumbbells",
        description: ""
      },
      {
        exerciseName: "Shoulder Press",
        workoutType: "Strength",
        muscleGroup: "Shoulders",
        equipmentRequired: "Dumbbells",
        description: ""
      },
      {
        exerciseName: "Bicep Curl",
        workoutType: "Strength",
        muscleGroup: "Arms",
        equipmentRequired: "Dumbbells",
        description: ""
      }
    ]);
  }
}

export const db = new AppDB();