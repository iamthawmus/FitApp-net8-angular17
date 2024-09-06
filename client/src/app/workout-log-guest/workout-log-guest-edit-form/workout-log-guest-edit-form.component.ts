import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { WorkoutSet, Exercise } from '../../db/db';
import { GuestWorkoutlogService } from '../../_services/guest-workoutlog.service';

@Component({
  selector: 'app-workout-log-guest-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './workout-log-guest-edit-form.component.html',
  styleUrl: './workout-log-guest-edit-form.component.css'
})
export class WorkoutLogGuestEditFormComponent implements OnInit{
  private guestWorkoutLogService = inject(GuestWorkoutlogService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder)
  workoutSetForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  cancelEdit = output<boolean>();
  updatedWorkoutSet = output<WorkoutSet>();
  workoutSet = input.required<WorkoutSet>();
  exercise = input.required<Exercise>();
  workoutSetID : number | undefined = 0;

  ngOnInit(): void {
    this.initializeForm();
    this.workoutSetID = this.workoutSet().id;
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
    this.cancelEdit.emit(false);
  }

  submit(){
    let repetitionsPerSet = this.workoutSetForm.get('repetitionsPerSet')?.value;
    let weightPerRepetition = this.workoutSetForm.get('weightPerRepetition')?.value;
    let durationInMinutes = this.workoutSetForm.get('durationInMinutes')?.value;
    let distance = this.workoutSetForm.get('distance')?.value;
    if(!this.workoutSet()){
      this.toastr.error("Workout Set is undefined");
      return;
    }
    this.editWorkoutSet(repetitionsPerSet, weightPerRepetition, durationInMinutes, distance);
  }

  editWorkoutSet(repetitionsPerSet: number, weightPerRepetition: number, 
    durationInMinutes : number = 0, distance : number = 0){
      if(!this.exercise().id){
        this.toastr.error("Exercise ID is undefined");
        return;
      }
      let editedWorkoutSet : WorkoutSet = {
        appUserWorkoutID: this.workoutSet().appUserWorkoutID,
        exerciseID: this.exercise().id!,
        setNumber: this.workoutSet().setNumber,
        repetitionsPerSet,
        weightPerRepetition,
        durationInMinutes,
        distance
      };

      if(this.workoutSetID){
        this.guestWorkoutLogService.editWorkoutSet(this.workoutSetID, editedWorkoutSet).then((response) => {
          let updatedSet : WorkoutSet = {
            appUserWorkoutID: this.workoutSet().appUserWorkoutID,
            id: this.workoutSetID,
            repetitionsPerSet,
            weightPerRepetition,
            durationInMinutes,
            distance,
            setNumber: this.workoutSet().setNumber,
            exerciseID: this.workoutSet().exerciseID
          }
          this.updatedWorkoutSet.emit(updatedSet);
          this.cancelEdit.emit(false);
        });
      }
  }
}
