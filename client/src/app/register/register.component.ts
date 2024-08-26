import { Component, inject, input, OnInit, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { NgIf } from '@angular/common';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { DatePickerComponent } from "../_forms/date-picker/date-picker.component";
import { Router } from '@angular/router';
import { isValidURL, matchValues } from '../_helpers/custom-validators';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder)
  private router = inject(Router);
  private toastr = inject(ToastrService);
  //@Output() cancelRegister = new EventEmitter(); // old way to do outputs before 17.3
  cancelRegister = output<boolean>();
  registerForm: FormGroup = new FormGroup({});
  maxDate = new Date();
  validationErrors: string[] | undefined;

  ngOnInit(): void {
    this.intializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  intializeForm(){
    this.registerForm  = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50), Validators.pattern(/(?=.*\d)(?=.*[A-Z])/)]],
      confirmPassword: ['', [Validators.required, matchValues('password')]],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],
      registrationKey: ['', Validators.required],
      clientURI: ['']
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
    this.registerForm.controls['email'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmEmail'].updateValueAndValidity()
    });
  }

  register() {
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    const clientUri = environment.production ? environment.websiteUrl + environment.confirmEmail : environment.confirmEmail;
    if(environment.production && !isValidURL(clientUri)){
      this.toastr.error("Invalid ClientURI");
      return;
    }
    this.registerForm.patchValue({
      dateOfBirth: dob, 
      clientURI: clientUri
    });

    this.accountService.register(this.registerForm.value).subscribe({
      next: _ => {
        this.router.navigateByUrl('/members');
        this.toastr.success("Email verification link sent to your email!");
      },
      error: error => {
        if(error && error.error){
          this.toastr.error(error.error);
        }
        else
          this.validationErrors = error
      }
    });
  }

  cancel() {
    console.log("cancelled");
    this.cancelRegister.emit(false);
  }

  private getDateOnly(dob: string | undefined){
    if(!dob) return;
    return new Date(dob).toISOString().slice(0,10);
  }
}
