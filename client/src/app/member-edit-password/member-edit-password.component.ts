import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../_forms/text-input/text-input.component';
import { matchValues } from '../_helpers/custom-validators';
import { AdminService } from '../_services/admin.service';
import { Member } from '../_models/member';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-edit-password',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent ],
  templateUrl: './member-edit-password.component.html',
  styleUrl: './member-edit-password.component.css'
})
export class MemberEditPasswordComponent implements OnInit {
    updatePasswordForm: FormGroup = new FormGroup({});
    validationErrors: string[] | undefined;
    private fb = inject(FormBuilder);
    private adminService = inject(AdminService);
    member = input.required<Member>();
    toastr = inject(ToastrService);

    ngOnInit(): void {
      this.intializeForm();
    }

    updatePassword(){
      var updateModal = {
        username : this.member().username,
        oldPassword: this.updatePasswordForm.get('oldPassword')?.value,
        newPassword: this.updatePasswordForm.get('newPassword')?.value
      };
      this.adminService.updatePassword(updateModal).subscribe({
        error: (errors) => this.toastr.error("An error has occurred :" + errors.error),
        next: () => {
          this.toastr.success("Password updated successfully!");
          this.updatePasswordForm.reset();
        }
      });
    }

    intializeForm(){
      this.updatePasswordForm  = this.fb.group({
        oldPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        confirmNewPassword: ['', [Validators.required, matchValues('newPassword')]],
      });
      this.updatePasswordForm.controls['newPassword'].valueChanges.subscribe({
        next: () => this.updatePasswordForm.controls['confirmNewPassword'].updateValueAndValidity()
      });
    }
}
