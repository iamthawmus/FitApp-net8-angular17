import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public globalVariables = new BehaviorSubject<any>({
    isGuestMode: false
  });
}
