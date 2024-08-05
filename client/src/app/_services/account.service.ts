import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, model, signal } from '@angular/core';
import { User } from '../_models/user';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes.service';
import { PresenceService } from './presence.service';
import { CustomEncoder } from '../_helpers/custom-encoder';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  // when injecting service into another service becareful of circular dependencies
  private likeService = inject(LikesService); 
  private presenceService = inject(PresenceService); 
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);
  roles = computed(() => {
    const user = this.currentUser();
    if(user && user.token){
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role) ? role : [role];
    }
    return null;
  })

  login(model: any){
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map(user => {
        if(user){
          this.setCurrentUser(user);
        }
      })
    );
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.presenceService.stopHubConnection();
  }
  
  register(model: any){
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user => {
        if(user){
         this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

  setCurrentUser(user: User){
    if(user){
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUser.set(user);
      this.likeService.getLikeIds();
      this.presenceService.createHubConnection(user);
    }
  }

  confirmEmail = (token: string, userId: string) => {
    let params = new HttpParams({ encoder: new CustomEncoder() });
    params = params.append('token', token);
    params = params.append('userId', userId);
  
    return this.http.get(this.baseUrl + 'account/confirmemail', { params: params });
  }
}
