import { inject, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Exercise } from '../_models/exercise';
import { map } from 'rxjs';
import { CustomEncoder } from '../_helpers/custom-encoder';

@Injectable({
  providedIn: 'root'
})
export class WorkoutlogService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  exercises : Exercise[] = [];
  exerciseMap : Map<string, number> = new Map(); // maps exerciseName to the array index
  exerciseMapById : Map<string, number> = new Map(); // maps exerciseId to array index

  getExercises() {
    return this.http.get<Exercise[]>(this.baseUrl + 'workoutlog/get-exercises');
  }

  createWorkout(model : any) {
    return this.http.post(this.baseUrl + 'workoutlog/create-workout', model);
  }

  createExercise(model : any) {
    return this.http.post(this.baseUrl + 'workoutlog/create-exercise', model);
  }

  updateExercise(id: number, model : any){
    return this.http.put(this.baseUrl + 'workoutlog/update-exercise/' + id, model);
  }

  deleteExercise(id: number){
    return this.http.delete(this.baseUrl + 'workoutlog/delete-exercise/' + id);
  }

  createWorkoutSet(model: any){
    return this.http.post(this.baseUrl + 'workoutlog/create-workout-set', model);
  }

  deleteWorkoutSet(id: number){
    return this.http.delete(this.baseUrl + 'workoutlog/delete-workout-set/' + id);
  }

  updateWorkoutSet(id: number, model: any){
    return this.http.put(this.baseUrl + 'workoutlog/update-workout-set/' + id, model);
  }

  getUserWorkout(username: string, date: string){
    let params = new HttpParams({ encoder: new CustomEncoder() });
    params = params.append('username', username);
    params = params.append('workoutDate', date);
  
    return this.http.get(this.baseUrl + 'workoutlog/get-user-workout', { params: params });
  }
}
