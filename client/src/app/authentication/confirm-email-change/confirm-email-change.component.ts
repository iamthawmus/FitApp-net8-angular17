import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-confirm-email-change',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './confirm-email-change.component.html',
  styleUrl: './confirm-email-change.component.css'
})
export class ConfirmEmailChangeComponent implements OnInit {
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  showSuccess: boolean | undefined;
  showError: boolean | undefined;
  errorMessage: string | undefined;

  ngOnInit(): void {
    this.confirmEmailChange();
  }

  private confirmEmailChange = () => {

    const token = this.route.snapshot.queryParams['token'];
    const username = this.route.snapshot.queryParams['username'];
    const newEmail = this.route.snapshot.queryParams['newEmail'];

    if(!token || !username){
      this.toastr.error("Can't confirm email change missing query params");
      console.error("error missing params to confirm email change");
      return;
    }

    this.accountService.confirmEmailChange(token, username, newEmail)
    .subscribe({
      next: (_) => {
        this.showSuccess = true;
        this.showError = false;
        this.accountService.logout();
      },
      error: (err: HttpErrorResponse) => {
        this.showError = true;
        this.errorMessage = err.message;
      }
    })
  }
}
