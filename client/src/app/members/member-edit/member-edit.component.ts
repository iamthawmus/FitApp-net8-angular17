import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { Member } from '../../_models/member';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";
import { TimeagoModule, TimeagoPipe } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberEditPasswordComponent } from "../member-edit-password/member-edit-password.component";
import { User } from '../../_models/user';
import { MemberChangeEmailComponent } from '../member-change-email/member-change-email.component';
import { environment } from '../../../environments/environment';
import { isValidURL } from '../../_helpers/custom-validators';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, FormsModule, PhotoEditorComponent, TimeagoModule, DatePipe, MemberEditPasswordComponent, MemberChangeEmailComponent],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event:any) {
    if(this.editForm?.dirty){
      $event.returnValue = true;
    }
  }
  member?: Member;
  user?: User;
  private accountService = inject(AccountService);
  private memberService = inject(MembersService);
  private toastr = inject(ToastrService);

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const currUser = this.accountService.currentUser();
    if(!currUser) return;
    this.user = currUser;
    this.memberService.getMember(this.user.username).subscribe({
      next: member => this.member = member
    })
  }

  updateMember(){
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('Profile updated successfully');
        this.editForm?.reset(this.member);
      }
    });
  }

  onMemberChange(event: Member) {
    this.member = event;
  }

  resendEmailVerification(){
    const clientUri = environment.production ? environment.websiteUrl + environment.confirmEmail : environment.confirmEmail;
    if(environment.production && !isValidURL(clientUri)){
      this.toastr.error("Invalid ClientURI");
      return;
    }    const updateModal = {
      username: this.user?.username,
      clientURI: clientUri
    }
    this.accountService.resendConfirmation(updateModal).subscribe({
      next: () => {
        this.toastr.success('Sent verification email to confirm email address');
      }
    })
  }
}
