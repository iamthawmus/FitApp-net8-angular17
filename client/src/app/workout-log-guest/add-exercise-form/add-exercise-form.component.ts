import { Component, inject, OnInit, output } from '@angular/core';
import { GuestWorkoutlogService } from '../../_services/guest-workoutlog.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { Exercise } from '../../db/db';
import { SelectMenuInputComponent } from '../../_forms/select-menu-input/select-menu-input.component';

@Component({
  selector: 'app-add-exercise-form',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, SelectMenuInputComponent],
  templateUrl: './add-exercise-form.component.html',
  styleUrl: './add-exercise-form.component.css'
})
export class AddExerciseFormComponent implements OnInit {
  guestWorkoutLogService = inject(GuestWorkoutlogService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder)
  exerciseForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  workoutTypes : string[] = ["Strength", "Cardio", "Other"];
  muscleGroups = ["Chest", "Back", "Arms", "Shoulder", "Legs", "Abs"];
  equipmentRequired = ["Barbell", "Dumbbells", "Bands", "Other"];

  cancelAdd = output<boolean>();

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(){
    this.exerciseForm  = this.fb.group({
      exerciseName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      workoutType: ['', [Validators.minLength(4), Validators.required]],
      muscleGroup: [''],
      equipmentRequired: [''],
      description: ['', [Validators.maxLength(200)]]
    });
  }

  submit(){
    let exerciseName = this.exerciseForm.get('exerciseName')?.value;
    let workoutType = this.exerciseForm.get('workoutType')?.value;
    let muscleGroup = this.exerciseForm.get('muscleGroup')?.value;
    let equipmentRequired = this.exerciseForm.get('equipmentRequired')?.value;
    let description = this.exerciseForm.get('description')?.value;
    if(!exerciseName || exerciseName.length === 0 || !workoutType || workoutType.length === 0)
    {
      this.toastr.error("Exercise name and workout type cannot be empty");
      return;
    }
    if(!this.exerciseAlreadyExists(exerciseName))
    {
      let model : Exercise = {
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

  cancel(){
    this.cancelAdd.emit(false);
  }

  exerciseAlreadyExists(newExerciseName : string) : boolean {
    let alreadyExists = false;
    this.guestWorkoutLogService.exerciseList.forEach((value) => {
      //regex to remove spaces in the name
      if(value.exerciseName.replace(/\s+/g, '').toLowerCase() 
          === newExerciseName.replace(/\s+/g, '').toLowerCase()){
        alreadyExists = true;
      }
    });

    return alreadyExists;
  }

  createExercise(model: Exercise){
    this.guestWorkoutLogService.addExercise(model).then((response) => {
        if(response)
        {
          let newExercise : Exercise = {
            id: response,
            exerciseName: model.exerciseName,
            workoutType: model.workoutType,
            muscleGroup: model.muscleGroup,
            equipmentRequired: model.equipmentRequired,
            description: model.description
          }
          this.guestWorkoutLogService.exerciseList.push(newExercise);
        }
        this.toastr.success("Created new exercise");
        this.exerciseForm.reset();
    });
  }
}
