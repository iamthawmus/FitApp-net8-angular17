import { Component, inject, input, OnInit, output } from '@angular/core';
import { WorkoutlogService } from '../../_services/workoutlog.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkoutSet } from '../../_models/workoutSet';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { NgIf } from '@angular/common';
import { Exercise } from '../../_models/exercise';

@Component({
  selector: 'app-workout-log-set-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TextInputComponent],
  templateUrl: './workout-log-set-edit-form.component.html',
  styleUrl: './workout-log-set-edit-form.component.css'
})
export class WorkoutLogSetEditFormComponent implements OnInit {
  private workoutLogService = inject(WorkoutlogService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder)
  workoutSetForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  cancelEdit = output<boolean>();
  updatedWorkoutSet = output<WorkoutSet>();
  workoutSet = input.required<WorkoutSet>();
  exercise = input.required<Exercise>();
  workoutSetID : number = 0;

  ngOnInit(): void {
    this.initializeForm();
    this.workoutSetID = this.workoutSet().workoutSetID;
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
      let editedWorkoutSet = {
        exerciseID: this.exercise().exerciseID,
        setNumber: this.workoutSet().setNumber,
        repetitionsPerSet,
        weightPerRepetition,
        durationInMinutes,
        distance
      };
    this.workoutLogService.updateWorkoutSet(this.workoutSetID, editedWorkoutSet).subscribe({
      next : (response) => {
        let updatedSet : WorkoutSet = {
          workoutSetID: this.workoutSetID,
          repetitionsPerSet,
          weightPerRepetition,
          durationInMinutes,
          distance,
          setNumber: this.workoutSet().setNumber,
          exerciseID: this.workoutSet().exerciseID
        }
        this.updatedWorkoutSet.emit(updatedSet);
        this.cancelEdit.emit(false);
      }
    })
  }
}
