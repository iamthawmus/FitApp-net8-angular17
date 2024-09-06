import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { WorkoutLogSetFormComponent } from '../../workout-log/workout-log-set-form/workout-log-set-form.component';
import { WorkoutLogSetEditFormComponent } from '../../workout-log/workout-log-set-edit-form/workout-log-set-edit-form.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { DatePickerComponent } from '../../_forms/date-picker/date-picker.component';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { GuestWorkoutlogService } from '../../_services/guest-workoutlog.service';
import { getDateOnly, getFormattedDate } from '../../_helpers/date-format';
import { AppUserWorkout, Exercise, WorkoutSet } from '../../db/db';
import { ConfirmDialogComponent } from '../../modals/confirm-dialog/confirm-dialog.component';
import { WorkoutLogGuestSetFormComponent } from "../workout-log-guest-set-form/workout-log-guest-set-form.component";
import { WorkoutLogGuestEditFormComponent } from "../workout-log-guest-edit-form/workout-log-guest-edit-form.component";

@Component({
  selector: 'app-workout-log-guest',
  standalone: true,
  imports: [AccordionModule, FormsModule, TypeaheadModule, CommonModule, WorkoutLogSetFormComponent, WorkoutLogSetEditFormComponent, AlertModule, ReactiveFormsModule, DatePickerComponent, WorkoutLogGuestSetFormComponent, WorkoutLogGuestEditFormComponent],
  templateUrl: './workout-log-guest.component.html',
  styleUrl: './workout-log-guest.component.css'
})
export class WorkoutLogGuestComponent implements OnInit {
  private toastr = inject(ToastrService);
  private guestWorkoutLogService = inject(GuestWorkoutlogService);
  private fb = inject(FormBuilder)
  oneAtATime = true;
  currentExercises: Set<Exercise> = new Set();
  appUserWorkout: AppUserWorkout | undefined = undefined;
  availableExercises: string[] = [];
  selectedExercise?: string;
  workoutSetMap: Map<string, WorkoutSet[]> = new Map();
  addSetMode = false;
  newSetFormValues: any;
  editSetMode = false;
  editModeTargetId = 0;
  bsModalRef?: BsModalRef;
  private modalService = inject(BsModalService);
  formattedWorkoutDateStr : string = "";

  workoutDateForm: FormGroup = new FormGroup({});
  maxDate = new Date();
  toggleCalenderForm = false;

  exerciseList : Exercise[] = [];
  ngOnInit(): void {
    this.guestWorkoutLogService.getExercises().then((list) => {
      if(list)
      {
        this.exerciseList = list;
        list.forEach((exercise) => {
          this.availableExercises.push(exercise.exerciseName);
        });
        if(!this.appUserWorkout){
          this.getWorkout(undefined);
        }
      }
    });
    this.intializeForm();
  }

  intializeForm(){
    this.workoutDateForm  = this.fb.group({
      workoutDate: ['', [Validators.required]],
    });
  }

  createWorkout(){
    let workoutDate = getFormattedDate(undefined);
    if(this.toggleCalenderForm){
      workoutDate = getDateOnly(this.workoutDateForm.get('workoutDate')?.value)!;
    }
    let newWorkout : AppUserWorkout = {
      workoutDate: new Date(workoutDate),
      workoutName: '',
      description: '',
      notes: '',
      workoutSets: []
    };

    this.guestWorkoutLogService.addAppUserWorkout(newWorkout).then((response) => {
      this.appUserWorkout = newWorkout;
      this.appUserWorkout.id = response;
      this.formattedWorkoutDateStr = new Date(this.appUserWorkout?.workoutDate).toDateString();
    });
  }

  getWorkout(workoutDate: string | undefined){
    this.guestWorkoutLogService.getWorkout(getFormattedDate(workoutDate)).then((response) => {
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
        this.appUserWorkout = undefined;
        this.workoutSetMap = new Map();
        this.currentExercises = new Set();
      }
    });
  }

  addExerciseToUI(){
    if(!this.selectedExercise)
      {
        this.toastr.error("No exercise selected")
        return;
      }
      let newExerciseIndex = this.exerciseList.findIndex(
          (exercise) => exercise.exerciseName.split(' ').join("").toUpperCase() == this.selectedExercise?.split(' ').join("").toUpperCase());
      if(newExerciseIndex < 0 || newExerciseIndex === undefined){
        this.toastr.error("No exercise of that name found");
        return;
      }
      let newExercise = this.exerciseList[newExerciseIndex];
      this.currentExercises.add(newExercise);
      if(newExercise.id && !this.workoutSetMap.has(newExercise.id.toString())){
        this.workoutSetMap.set(newExercise.id.toString(), []);
      }
  }

  cancelAddSetMode(event: boolean){
    this.addSetMode = event;
  }

  toggleAddSetMode(){
    this.addSetMode = !this.addSetMode;
  }

  addNewSet($event: WorkoutSet){
    this.appUserWorkout?.workoutSets.push($event);
    if(!this.workoutSetMap.has($event.exerciseID.toString())){
      this.workoutSetMap.set($event.exerciseID.toString(), [$event]);
    }else{
      this.workoutSetMap.get($event.exerciseID.toString())?.push($event);
    }
  }

  cancelEditSetMode(event: boolean){
    this.editSetMode = event;
  }

  toggleEditSetMode(workSetId: number){
    this.editModeTargetId = workSetId;
    this.editSetMode = !this.editSetMode;
  }

  editSet($event: WorkoutSet){
    this.appUserWorkout?.workoutSets.forEach((value) => {
      if(value.id === $event.id)
      {
        Object.assign(value, $event);
      }
    });
    this.workoutSetMap.get($event.exerciseID.toString())?.forEach((value) => {
      if(value.id === $event.id)
      {
        Object.assign(value, $event);
      }
    });
  }

  deleteSet($event: WorkoutSet){
    if(!$event.id){
      return;
    }
    const config: ModalOptions = {
      initialState: {
        title: 'Confirmation',
        message: 'Are you sure you want to do this?',
        btnOkText: 'Ok',
        btnCancelText: 'Cancel',
      }
    };
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if(this.bsModalRef?.content.result && $event.id){
          this.guestWorkoutLogService.deleteWorkoutSet($event.id).then((response) => {
              this.appUserWorkout?.workoutSets.forEach((value, index) => {
                if(value.id === $event.id){
                  this.appUserWorkout?.workoutSets.splice(index, 1);
                }
              });
              this.workoutSetMap.get($event.exerciseID.toString())?.forEach((val, index) => {
                if(val.id === $event.id){
                  this.workoutSetMap.get($event.exerciseID.toString())?.splice(index, 1);
                }
              });
          });
        }
      }
    });
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
      let index = this.exerciseList.findIndex((exercise) => exercise.id == value);
      this.currentExercises.add(this.exerciseList[index]);
    });
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

  findWorkout(){
    const workoutDate = getDateOnly(this.workoutDateForm.get('workoutDate')?.value) + 'T00:00';
    if(!workoutDate){
      this.toastr.error("No workout date selected");
      return;
    }
    this.getWorkout(workoutDate);
  }

  toggleCalenderButton(){
    this.toggleCalenderForm = !this.toggleCalenderForm;
  }
}
