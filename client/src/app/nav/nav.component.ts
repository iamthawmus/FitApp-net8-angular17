import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HasRoleDirective } from '../_directives/has-role.directive';
import { WorkoutlogService } from '../_services/workoutlog.service';
import { Exercise } from '../_models/exercise';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule, RouterLink, RouterLinkActive, HasRoleDirective],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  accountService = inject(AccountService);
  private router = inject(Router);
  private toastr = inject(ToastrService)
  private workoutLogService = inject(WorkoutlogService);

  model: any = {};

  login() {
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
        this.router.navigateByUrl('/members');
        this.workoutLogService.checkCacheForExerciseList(() => {});
      },
      error: error => this.toastr.error(error.error)
    });
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
