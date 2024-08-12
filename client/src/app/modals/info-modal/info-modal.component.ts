import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [],
  templateUrl: './info-modal.component.html',
  styleUrl: './info-modal.component.css'
})
export class InfoModalComponent {
  bsModalRef = inject(BsModalRef);
  title = '';
  messages = [];
  btnCloseText = '';

  close(){
    this.bsModalRef.hide();
  }
}
