import { Component, inject } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { InfoModalComponent } from '../modals/info-modal/info-modal.component';
import { GlobalService } from '../_services/global.service';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private modalService = inject(BsModalService);
  private accountService = inject(AccountService);
  private router = inject(Router);
  globalService = inject(GlobalService);

  registerMode = false;
  bsModalRef: BsModalRef<InfoModalComponent> = new BsModalRef<InfoModalComponent>();

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean){
    this.registerMode = event;
  }
  
  startGuestMode(){
    this.globalService.globalVariables.value.isGuestMode = true;
    this.accountService.logout();
    this.router.navigateByUrl('/guest-workout-log');

  }

  openLearnMoreModal(){
    const config: ModalOptions = {
      initialState: {
        title: "Interested in becoming a healthier version of yourself? We've got the tools to help you out!",
        messages: ["Chat - Talk with fellow fitness lovers to stay motivated and make new friends", "Food Diary - Track what you eat to help you move towards your goals", "Workout Log - Log your workouts to keep yourself accountable"],
        btnCloseText: "Close",
      }
    };
    this.bsModalRef = this.modalService.show(InfoModalComponent, config);
  }
}
