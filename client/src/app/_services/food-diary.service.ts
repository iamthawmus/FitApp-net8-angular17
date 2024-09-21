import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CustomEncoder } from '../_helpers/custom-encoder';
import { FoodItem } from '../_models/foodDiary';

@Injectable({
  providedIn: 'root'
})
export class FoodDiaryService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  foodItems : FoodItem[] = [];
  
  createFoodItem(model: any) {
    return this.http.post(this.baseUrl + 'fooddiary/create-food-item', model);
  }

  createFoodDiaryEntry(model: any) {
    return this.http.post(this.baseUrl + 'fooddiary/create-food-diary-entry', model);
  }

  deleteFoodDiaryEntry(id: number) {
    return this.http.delete(this.baseUrl + 'fooddiary/delete-food-diary-entry/' + id);
  }

  updateFoodDiaryEntry(id: number, model : any){
    return this.http.put(this.baseUrl + 'fooddiary/update-food-diary-entry/' + id, model);
  }

  createFoodDiary(model: any) {
    return this.http.post(this.baseUrl + 'fooddiary/create-food-diary', model);
  }

  getFoodItems(){
    return this.http.get(this.baseUrl + 'fooddiary/get-food-items');
  }

  getUserFoodDiary(username: string, date: string) {
    let params = new HttpParams({ encoder: new CustomEncoder() });
    params = params.append('username', username);
    params = params.append('foodDiaryDate', date);

    return this.http.get(this.baseUrl + 'fooddiary/get-user-food-diary', { params: params });
  }

  getFoodItemWithFdcId(id : number){
    return this.http.get(this.baseUrl + 'fooddiary/get-food-with-fdcid/' + id);
  }
}
