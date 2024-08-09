import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../../_forms/text-input/text-input.component';
import { AdminService } from '../../_services/admin.service';
import { Member } from '../../_models/member';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';
import { environment } from '../../../environments/environment';
import { isValidURL } from '../../_helpers/custom-validators';

@Component({
  selector: 'app-member-change-email',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent],
  templateUrl: './member-change-email.component.html',
  styleUrl: './member-change-email.component.css'
})
export class MemberChangeEmailComponent implements OnInit{
  updateEmailForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  member = input.required<Member>();
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.intializeForm();
  }

  updateEmail(){
    const clientUri = environment.production ? environment.websiteUrl + environment.confirmEmailChange : environment.confirmEmailChange;
    if(environment.production && !isValidURL(clientUri)){
      this.toastr.error("Invalid ClientURI");
      return;
    }
    var updateModal = {
      username : this.member().username,
      newEmail: this.updateEmailForm.get('newEmail')?.value,
      clientURI: clientUri
    };
    this.accountService.changeEmail(updateModal).subscribe({
      error: (errors) => this.toastr.error("An error has occurred :" + errors.error),
      next: () => {
        this.toastr.success("Verification link sent to your new email!");
        this.updateEmailForm.reset();
      }
    });
  }

  intializeForm(){
    this.updateEmailForm  = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]],
      confirmNewEmail: ['', [Validators.required, Validators.email]],
    });
    this.updateEmailForm.controls['newEmail'].valueChanges.subscribe({
      next: () => this.updateEmailForm.controls['confirmNewEmail'].updateValueAndValidity()
    });
  }
}
