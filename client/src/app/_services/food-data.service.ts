import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Food } from '../_models/food';

@Injectable({
  providedIn: 'root'
})
export class FoodDataService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  foodCache = new Map();
  foodItemMap = new Map<string, Food>();
  resultsSignal = signal<HttpResponse<Food[]> | null> (null);

  searchFood(model: any){
    return this.http.post<Food[]>(this.baseUrl + 'fooddata/search-food', model);
  }

  addToFoodMap(foods : Food[]) : string[] {
    if(!foods || foods.length == 0)
      return [];

    foods.forEach((val) => {
      if(val && val.description && !this.foodItemMap.has(val.description)){
        this.foodItemMap.set(val.description, val);
      }
    });

    return [...this.foodItemMap.keys()];
  }

}
