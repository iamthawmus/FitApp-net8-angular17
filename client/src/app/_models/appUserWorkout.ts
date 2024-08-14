import { WorkoutSet } from "./workoutSet";

export interface AppUserWorkout {
    appUserWorkoutID: number;
    workoutDate: Date;
    workoutName: string;
    description: string;
    notes: string;
    workoutSets: WorkoutSet[];
}