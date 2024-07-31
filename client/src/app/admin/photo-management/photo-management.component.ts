import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../_services/admin.service';
import { Photo } from '../../_models/photo';

@Component({
  selector: 'app-photo-management',
  standalone: true,
  imports: [],
  templateUrl: './photo-management.component.html',
  styleUrl: './photo-management.component.css'
})
export class PhotoManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  photos : Photo[] = []; 

  ngOnInit(): void {
    this.getUnapprovedPhotos();
  }

  getUnapprovedPhotos(){
    this.adminService.getPhotosForApproval().subscribe({
      next: photos => this.photos = photos
    });
  }

  approvePhoto(id: number){
    this.adminService.approvePhoto(id).subscribe({
      next: () => {
        this.photos.splice(this.photos.findIndex(p => p.id == id), 1);
      }
    });
  }

  rejectPhoto(id: number){
    this.adminService.rejectPhoto(id).subscribe({
      next: () => {
        this.photos.splice(this.photos.findIndex(p => p.id == id), 1);
      }
    });
  }
}
