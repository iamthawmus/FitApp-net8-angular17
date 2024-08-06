import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css'
})
export class ConfirmEmailComponent implements OnInit {
  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  showSuccess: boolean | undefined;
  showError: boolean | undefined;
  errorMessage: string | undefined;

  ngOnInit(): void {
    this.confirmEmail();
  }

  private confirmEmail = () => {

    const token = this.route.snapshot.queryParams['token'];
    const userId = this.route.snapshot.queryParams['userId'];
    
    if(!token || !userId){
      this.toastr.error("Can't confirm email missing query params");
      console.error("error missing params to confirm email");
      return;
    }

    this.accountService.confirmEmail(token, userId)
    .subscribe({
      next: (_) => {
        this.showSuccess = true;
        this.showError = false;
      },
      error: (err: HttpErrorResponse) => {
        this.showError = true;
        this.errorMessage = err.message;
      }
    })
  }
}
