import { Injectable } from '@angular/core';
import { AppUserWorkout, db, Exercise, WorkoutSet } from '../db/db';

@Injectable({
  providedIn: 'root'
})
export class GuestWorkoutlogService {

  getExercises(){
    return db.exercises.toArray();
  }
  
  addExercise(exercise : Exercise){
    return db.exercises.add(exercise);
  }

  updateExercise(id: number, changes: any){
    return db.exercises.update(id, changes);
  }

  deleteExercise(id: number){
    return db.exercises.delete(id);
  }

  addWorkoutSet(workset: WorkoutSet){
    return db.workoutSets.add(workset);
  }

  editWorkoutSet(id: number, changes: any){
    return db.workoutSets.update(id, changes);
  }

  deleteWorkoutSet(id: number){
    return db.workoutSets.delete(id);
  }

  addAppUserWorkout(userWorkout: AppUserWorkout){
    return db.appUserWorkouts.add(userWorkout);
  }

  editAppUserWorkout(id: number, changes: any){
    return db.appUserWorkouts.update(id, changes);
  }

  deleteAppUserWorkout(id: number){
    return db.appUserWorkouts.delete(id);
  }

  getWorkout(date: string){
    return db.transaction('r', [db.appUserWorkouts, db.workoutSets], async () => {
      const userWorkout = await db.appUserWorkouts.where({workoutDate: new Date(date)}).first();
      if(userWorkout)
      {
        const workoutSets = await db.workoutSets.where({appUserWorkoutID: userWorkout?.id}).toArray();
        userWorkout.workoutSets = workoutSets;
      }
      return userWorkout;
    })
  }
}
