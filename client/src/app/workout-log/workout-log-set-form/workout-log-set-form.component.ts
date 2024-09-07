import { NgIf } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { WorkoutlogService } from '../../_services/workoutlog.service';
import { ToastrService } from 'ngx-toastr';
import { WorkoutSet } from '../../_models/workoutSet';
import { Exercise } from '../../_models/exercise';
import { AppUserWorkout } from '../../_models/appUserWorkout';

@Component({
  selector: 'app-workout-log-set-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TextInputComponent],
  templateUrl: './workout-log-set-form.component.html',
  styleUrl: './workout-log-set-form.component.css'
})
export class WorkoutLogSetFormComponent implements OnInit{
  private workoutLogService = inject(WorkoutlogService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder)
  workoutSetForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  cancelSet = output<boolean>();
  workoutSet = output<WorkoutSet>();

  exercise = input.required<Exercise>();
  appUserWorkout = input.required<AppUserWorkout>();

  appUserWorkoutId : number = 0;
  exerciseId : number = 0;

  ngOnInit(): void {
    this.initializeForm();
    this.appUserWorkoutId = this.appUserWorkout().appUserWorkoutID;
    this.exerciseId = this.exercise().exerciseID;
  }

  initializeForm(){
    this.workoutSetForm  = this.fb.group({
      repetitionsPerSet: [0, [Validators.min(0), Validators.max(1000)]],
      weightPerRepetition: [0, [Validators.min(0), Validators.max(1000)]],
      durationInMinutes: [0, [Validators.min(0), Validators.max(1000)]],
      distance: [0, [Validators.min(0), Validators.max(1000)]],
    });

  }

  cancel() {
    this.cancelSet.emit(false);
  }

  submit(){
    let repetitionsPerSet = this.workoutSetForm.get('repetitionsPerSet')?.value - 0;
    let weightPerRepetition = this.workoutSetForm.get('weightPerRepetition')?.value - 0;
    let durationInMinutes = this.workoutSetForm.get('durationInMinutes')?.value - 0;
    let distance = this.workoutSetForm.get('distance')?.value - 0;
    if(!this.exercise()){
      this.toastr.error("ExerciseId is undefined");
      return;
    }
    this.addWorkoutSet(repetitionsPerSet, weightPerRepetition, durationInMinutes, distance);
  }

  addWorkoutSet(repetitionsPerSet: number, weightPerRepetition: number, 
    durationInMinutes : number = 0, distance : number = 0): void {
    if(!this.appUserWorkoutId || !this.exerciseId)
    {
      this.toastr.error("App Userworkout  ID or Exercise ID is undefined");
      return;
    }
    let newSetNumber = this.getLatestSetNumber(this.exerciseId);
    let workoutSet = {
      appUserWorkoutID: this.appUserWorkoutId,
      exerciseID: this.exerciseId,
      setNumber: newSetNumber,
      repetitionsPerSet,
      weightPerRepetition,
      durationInMinutes,
      distance
    };

    this.workoutLogService.createWorkoutSet(workoutSet).subscribe({
      next: (response : any) => {
        if(response && response.workoutSetID){
          let newSet : WorkoutSet = {
            workoutSetID: response.workoutSetID,
            exerciseID: workoutSet.exerciseID,
            setNumber: newSetNumber,
            repetitionsPerSet: workoutSet.repetitionsPerSet,
            weightPerRepetition: workoutSet.weightPerRepetition,
            durationInMinutes: workoutSet.durationInMinutes,
            distance: workoutSet.distance
          }
          this.workoutSet.emit(newSet);
          this.workoutSetForm.reset();
          this.cancelSet.emit(false);
        }
        else{
          this.toastr.error("Could not create set.");
        }
      }
    });
  }

  getLatestSetNumber(exerciseId: number) : number {
    if(this.appUserWorkout)
      {
        let orderedSet = this.appUserWorkout().workoutSets
          .filter((workoutSet) => workoutSet.exerciseID = exerciseId)
          .sort((a, b) => a.setNumber - b.setNumber);
        if(orderedSet.length > 0)  
          return orderedSet[orderedSet.length - 1].setNumber + 1;
      }
  
      return 1;
  }
}
