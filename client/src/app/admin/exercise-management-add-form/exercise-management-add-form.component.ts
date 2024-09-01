import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TextInputComponent } from "../../_forms/text-input/text-input.component";
import { NgIf } from '@angular/common';
import { SelectMenuInputComponent } from "../../_forms/select-menu-input/select-menu-input.component";
import { WorkoutlogService } from '../../_services/workoutlog.service';
import { Exercise } from '../../_models/exercise';

@Component({
  selector: 'app-exercise-management-add-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TextInputComponent, SelectMenuInputComponent],
  templateUrl: './exercise-management-add-form.component.html',
  styleUrl: './exercise-management-add-form.component.css'
})
export class ExerciseManagementAddFormComponent implements OnInit {
  private toastr = inject(ToastrService);
  private workoutLogService = inject(WorkoutlogService);
  private fb = inject(FormBuilder);
  addForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  availableExercises: string[] = [];

  workoutTypes : string[] = ["Strength", "Cardio", "Other"];
  muscleGroups = ["Chest", "Back", "Arms", "Shoulder", "Legs", "Abs"];
  equipmentRequired = ["Barbell", "Dumbbells", "Bands", "Other"];

  ngOnInit(): void {
    this.initializeForm();
    this.workoutLogService.checkCacheForExerciseList(this.setAvailableExercises);
  }

  setAvailableExercises() {
    this.availableExercises = [...this.workoutLogService.exerciseMap.keys()];
  }

  initializeForm() {
    this.addForm  = this.fb.group({
      exerciseName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      workoutType: ['', [Validators.minLength(4), Validators.required]],
      muscleGroup: [''],
      equipmentRequired: [''],
      description: ['', [Validators.maxLength(200)]]
    });
  }

  submit() {
    let exerciseName = this.addForm.get('exerciseName')?.value;
    let workoutType = this.addForm.get('workoutType')?.value;
    let muscleGroup = this.addForm.get('muscleGroup')?.value;
    let equipmentRequired = this.addForm.get('equipmentRequired')?.value;
    let description = this.addForm.get('description')?.value;
    if(!exerciseName || exerciseName.length === 0 || !workoutType || workoutType.length === 0)
    {
      this.toastr.error("Exercise name and workout type cannot be empty");
      return;
    }
    if(!this.exerciseAlreadyExists(exerciseName))
    {
      let model = {
        exerciseName,
        workoutType,
        muscleGroup,
        equipmentRequired,
        description
      }
      this.createExercise(model); 
    }
    else{
      this.toastr.error("Exercise already exists");
    }
  }

  cancel() {
    this.addForm.reset();
  }

  createExercise(model: any){
    this.workoutLogService.createExercise(model).subscribe({
      next: (response : any) => {
        if(response && response.exerciseID)
        {
          let newExercise : Exercise = {
            exerciseID: response.exerciseID,
            exerciseName: model.exerciseName,
            workoutType: model.workoutType,
            muscleGroup: model.muscleGroup,
            equipmentRequired: model.equipmentRequired,
            description: model.description
          }
          this.workoutLogService.exercises.push(newExercise);
          this.workoutLogService.exerciseMap.set(newExercise.exerciseName, this.workoutLogService.exercises.length - 1);
          this.workoutLogService.exerciseMapById.set(newExercise.exerciseID.toString(), this.workoutLogService.exercises.length - 1);
        }
        this.toastr.success("Created new exercise");
        this.addForm.reset();
      }
    });
  }

  exerciseAlreadyExists(exerciseName : string) : boolean {
    let alreadyExists = false;
    this.availableExercises.forEach((value) => {
      //regex to remove spaces in the name
      if(value.replace(/\s+/g, '').toLowerCase() 
          === exerciseName.replace(/\s+/g, '').toLowerCase()){
        alreadyExists = true;
      }
    });

    return alreadyExists;
  }
}
