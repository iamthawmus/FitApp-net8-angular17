import { Component, input, OnInit } from '@angular/core';
import { FoodDiaryEntry } from '../../_models/foodDiary';

@Component({
  selector: 'app-food-diary-card',
  standalone: true,
  imports: [],
  templateUrl: './food-diary-card.component.html',
  styleUrl: './food-diary-card.component.css'
})
export class FoodDiaryCardComponent implements OnInit {
  foodItem = input.required<FoodDiaryEntry>();
  calculatedEnergy : number = 0;
  calculatedProtein: number = 0;
  calculatedCarbs: number = 0;
  calculatedFats: number = 0;
  calculatedSugar: number = 0;
  calculatedFiber: number = 0;
  servingSize: string = "";
  ngOnInit(): void {
    if(this.foodItem().servingType == "default"){
      this.calculatedEnergy = parseFloat(Math.round(this.foodItem().foodItem.energy! * this.foodItem().numberOfServings).toFixed(2));
      this.calculatedProtein = parseFloat(Math.round(this.foodItem().foodItem.protein! * this.foodItem().numberOfServings).toFixed(2));
      this.calculatedCarbs = parseFloat(Math.round(this.foodItem().foodItem.carb! * this.foodItem().numberOfServings).toFixed(2));
      this.calculatedFats = parseFloat(Math.round(this.foodItem().foodItem.fat! * this.foodItem().numberOfServings).toFixed(2));
      this.calculatedSugar = parseFloat(Math.round(this.foodItem().foodItem.sugar! * this.foodItem().numberOfServings).toFixed(2));
      this.calculatedFiber = parseFloat(Math.round(this.foodItem().foodItem.fiber! * this.foodItem().numberOfServings).toFixed(2));
      this.servingSize = this.foodItem().foodItem.servingName!;
    }
    else
    {
      this.calculatedEnergy = parseFloat(Math.round(this.foodItem().foodItem.energy! / this.foodItem().foodItem.servingSize! * this.foodItem().numberOfServings).toFixed(2));
      this.calculatedProtein = parseFloat(Math.round(this.foodItem().foodItem.protein! / this.foodItem().foodItem.servingSize! * this.foodItem().numberOfServings).toFixed(2));
      this.calculatedCarbs = parseFloat(Math.round(this.foodItem().foodItem.carb! / this.foodItem().foodItem.servingSize! * this.foodItem().numberOfServings).toFixed(2));
      this.calculatedFats = parseFloat(Math.round(this.foodItem().foodItem.fat! / this.foodItem().foodItem.servingSize! * this.foodItem().numberOfServings).toFixed(2));
      this.calculatedSugar = parseFloat(Math.round(this.foodItem().foodItem.sugar! / this.foodItem().foodItem.servingSize! * this.foodItem().numberOfServings).toFixed(2));
      this.calculatedFiber = parseFloat(Math.round(this.foodItem().foodItem.fiber! / this.foodItem().foodItem.servingSize! * this.foodItem().numberOfServings).toFixed(2));
      this.servingSize = '1 ' + this.foodItem().foodItem.servingSizeUnit!;
    }
  }

}
