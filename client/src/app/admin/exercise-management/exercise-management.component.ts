import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { ExerciseManagementAddFormComponent } from "../exercise-management-add-form/exercise-management-add-form.component";
import { Exercise } from '../../_models/exercise';
import { WorkoutlogService } from '../../_services/workoutlog.service';

@Component({
  selector: 'app-exercise-management',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TextInputComponent, ExerciseManagementAddFormComponent],
  templateUrl: './exercise-management.component.html',
  styleUrl: './exercise-management.component.css'
})
export class ExerciseManagementComponent implements OnInit {
  private workoutLogService = inject(WorkoutlogService);
  editMode = "";
  exercises : Exercise[] = [];
  ngOnInit(): void {
    this.workoutLogService.checkCacheForExerciseList(() => {
      this.exercises = this.workoutLogService.exercises;
    });
  }
  updateMode(mode : string){
    this.editMode = mode;
  }
}
