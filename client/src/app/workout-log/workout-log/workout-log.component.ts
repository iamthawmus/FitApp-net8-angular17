import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { WorkoutlogService } from '../../_services/workoutlog.service';
import { Exercise } from '../../_models/exercise';
import { AppUserWorkout } from '../../_models/appUserWorkout';
import { ToastrService } from 'ngx-toastr';
import { WorkoutSet } from '../../_models/workoutSet';
import { AccountService } from '../../_services/account.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { getFormattedDate } from '../../_helpers/date-format';
import { CommonModule } from '@angular/common';
import { WorkoutLogSetFormComponent } from "../workout-log-set-form/workout-log-set-form.component";
import { WorkoutLogSetEditFormComponent } from "../workout-log-set-edit-form/workout-log-set-edit-form.component";
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ConfirmDialogComponent } from '../../modals/confirm-dialog/confirm-dialog.component';
import { MembersService } from '../../_services/members.service';
import { AlertModule } from 'ngx-bootstrap/alert';


@Component({
  selector: 'app-workout-log',
  standalone: true,
  imports: [AccordionModule, FormsModule, TypeaheadModule, CommonModule, WorkoutLogSetFormComponent, WorkoutLogSetEditFormComponent, AlertModule],
  templateUrl: './workout-log.component.html',
  styleUrl: './workout-log.component.css'
})
export class WorkoutLogComponent implements OnInit {
  memberService = inject(MembersService);
  private workoutLogService = inject(WorkoutlogService);
  private toastr = inject(ToastrService);
  private accountService = inject(AccountService);
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

  ngOnInit(): void {
    if(this.workoutLogService.exercises.length == 0)
    {
      this.workoutLogService.getExercises().subscribe({
        next: (response : Exercise[]) => {
          if(response)
          {
            this.workoutLogService.exercises = response;
            if(this.workoutLogService.exercises.length > 0)
            {
              this.workoutLogService.exercises.forEach((exercise, index) => {
                this.workoutLogService.exerciseMap.set(exercise.exerciseName, index);
                this.workoutLogService.exerciseMapById.set(exercise.exerciseID.toString(), index);
              });

              this.availableExercises = [...this.workoutLogService.exerciseMap.keys()];

              if(!this.appUserWorkout){
                this.getWorkout(undefined);
              }

            }
          }
        }
      });
    }
    else if(!this.appUserWorkout){
      this.getWorkout(undefined);
    }
  }

  createWorkout(): void {
    let workoutDate = getFormattedDate(undefined);
    let params = {
      WorkoutDate: workoutDate
    };
    this.workoutLogService.createWorkout(params).subscribe({
      next: (response : any) => {
        if(response && response.appUserWorkoutID){
          this.appUserWorkout = {
            appUserWorkoutID : response.appUserWorkoutID,
            workoutDate: new Date(workoutDate),
            workoutName: "Workout for " + workoutDate,
            description: "",
            notes: "",
            workoutSets: []
          };
        }
        else{
          this.toastr.error("Could not create workout.");
        }
      }
    });
  }

  getWorkout(date : Date | undefined){

    let username : string = "";
    if(!this.accountService.currentUser() || !this.accountService.currentUser()?.username)
    {
      this.toastr.error("username is undefined");
      return;
    }
    username =  this.accountService.currentUser()?.username!;
    

    this.workoutLogService.getUserWorkout(username, getFormattedDate(date)).subscribe({
      next: (response : any) => {
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
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  addExerciseToUI() {
    if(!this.selectedExercise)
    {
      this.toastr.error("No exercise selected")
      return;
    }
    let newExerciseIndex = this.workoutLogService.exerciseMap.get(this.selectedExercise!)
    if(newExerciseIndex === undefined){
      this.toastr.error("No exercise of that name found");
      return;
    }
    let newExercise = this.workoutLogService.exercises[newExerciseIndex];
    this.currentExercises.add(newExercise);
    if(!this.workoutSetMap.has(newExercise.exerciseID.toString())){
      this.workoutSetMap.set(newExercise.exerciseID.toString(), []);
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

  toggleEditSetMode(workSetId : number){
    this.editModeTargetId = workSetId;
    this.editSetMode = !this.editSetMode;
  }

  editSet($event: WorkoutSet){
    this.appUserWorkout?.workoutSets.forEach((value) => {
      if(value.workoutSetID === $event.workoutSetID)
      {
        Object.assign(value, $event);
      }
    });
    this.workoutSetMap.get($event.exerciseID.toString())?.forEach((value) => {
      if(value.workoutSetID === $event.workoutSetID)
      {
        Object.assign(value, $event);
      }
    });
  }

  deleteSet($event: WorkoutSet){
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
        if(this.bsModalRef?.content.result){
          this.workoutLogService.deleteWorkoutSet($event.workoutSetID).subscribe({
            next: (response) => {
              this.appUserWorkout?.workoutSets.forEach((value, index) => {
                if(value.workoutSetID === $event.workoutSetID){
                  this.appUserWorkout?.workoutSets.splice(index, 1);
                }
              });
              this.workoutSetMap.get($event.exerciseID.toString())?.forEach((val, index) => {
                if(val.workoutSetID === $event.workoutSetID){
                  this.workoutSetMap.get($event.exerciseID.toString())?.splice(index, 1);
                }
              });
            }
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
      let index = this.workoutLogService.exerciseMapById.get(value.toString())!;
      this.currentExercises.add(this.workoutLogService.exercises[index]);
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
}