import { Component, inject, input, OnInit } from '@angular/core';
import { WorkoutlogService } from '../../_services/workoutlog.service';
import { ToastrService } from 'ngx-toastr';
import { AppUserWorkout } from '../../_models/appUserWorkout';
import { Exercise } from '../../_models/exercise';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkoutSet } from '../../_models/workoutSet';
import { DatePickerComponent } from '../../_forms/date-picker/date-picker.component';
import { getDateOnly } from '../../_helpers/date-format';

@Component({
  selector: 'app-member-workout-log',
  standalone: true,
  imports: [AccordionModule, FormsModule, ReactiveFormsModule, DatePickerComponent],
  templateUrl: './member-workout-log.component.html',
  styleUrl: './member-workout-log.component.css'
})
export class MemberWorkoutLogComponent implements OnInit {
  private workoutLogService = inject(WorkoutlogService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder)
  appUserWorkout: AppUserWorkout | undefined = undefined;
  currentExercises: Set<Exercise> = new Set();
  oneAtATime = true;
  workoutSetMap : Map<string, WorkoutSet[]> = new Map();
  formattedWorkoutDateStr : string = "";
  workoutDateForm: FormGroup = new FormGroup({});
  maxDate = new Date();
  username = input.required<string>();
  validationErrors: string[] | undefined;
  renderForm = input.required<boolean>();

  ngOnInit(): void {
    this.intializeForm();
  }

  intializeForm(){
    this.workoutDateForm  = this.fb.group({
      workoutDate: ['', [Validators.required]],
    });
  }

  findWorkout(){
    const workoutDate = getDateOnly(this.workoutDateForm.get('workoutDate')?.value);
    if(!workoutDate){
      this.toastr.error("No workout date selected");
      return;
    }
    this.workoutLogService.getUserWorkout(this.username(), workoutDate).subscribe({
      next: (response: any) => {
        if(response){
          this.appUserWorkout = response;
          if(this.appUserWorkout)
          {
            this.formattedWorkoutDateStr = new Date(this.appUserWorkout?.workoutDate).toDateString();
          }

          if(this.appUserWorkout && this.appUserWorkout.workoutSets)
            this.loadExercisesFromWorkoutSet(this.appUserWorkout?.workoutSets);
        }
        else{
          this.toastr.warning("Could not find workout");
        }
      }
    })
  }

  getWorkoutSetFromExerciseId(exerciseId: number) : WorkoutSet[]
  {
    if(this.workoutSetMap.has(exerciseId.toString()))
    {
      let setArr : WorkoutSet[] = this.workoutSetMap.get(exerciseId.toString())!;
      return setArr.sort((a,b) => a.setNumber - b.setNumber);
    }
    
    return [];
  }
  
  loadExercisesFromWorkoutSet(workoutSets : WorkoutSet[])
  {
    let exerciseIds : Set<number> = new Set();
    workoutSets.forEach((value, index) => {
      if(!this.workoutSetMap.has(value.exerciseID.toString()))
      {
        this.workoutSetMap.set(value.exerciseID.toString(), [value]);
      }
      else{
        this.workoutSetMap.get(value.exerciseID.toString())?.push(value);
      }
      exerciseIds.add(value.exerciseID);
    });
    exerciseIds.forEach((value) => {
      let index = this.workoutLogService.exerciseMapById.get(value.toString())!;
      this.currentExercises.add(this.workoutLogService.exercises[index]);
    });
  }

}
