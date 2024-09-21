import { Component, inject, input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TextInputComponent } from "../../_forms/text-input/text-input.component";
import { SelectMenuInputComponent } from "../../_forms/select-menu-input/select-menu-input.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FoodDiaryEntry, FoodItem } from '../../_models/foodDiary';
import { Food } from '../../_models/food';
import { getFormattedDate } from '../../_helpers/date-format';

@Component({
  selector: 'app-food-serving-modal',
  standalone: true,
  imports: [TextInputComponent, SelectMenuInputComponent, ReactiveFormsModule],
  templateUrl: './food-serving-modal.component.html',
  styleUrl: './food-serving-modal.component.css'
})
export class FoodServingModalComponent implements OnInit {
  bsModalRef = inject(BsModalRef);
  private fb = inject(FormBuilder);
  servingForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  food : FoodItem | undefined;
  foodDiaryEntry : FoodDiaryEntry | undefined;

  servingNames : string[] = [];

  calculatedProtein : number = 0;
  calculatedCarbs: number = 0;
  calculatedFats: number = 0;
  calculatedSugar: number = 0;
  calculatedFiber: number = 0;
  calculatedEnergy: number = 0;

  proteinUnit : string = "";
  carbUnit : string = "";
  fatUnit : string = "";
  sugarUnit : string = "";
  fiberUnit : string = "";
  energyUnit : string = "";

  meals : string[] = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snacks'
  ];

  title = '';
  message = '';
  btnOkText = '';
  btnCancelText = '';
  result : FoodDiaryEntry | undefined = undefined;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    if(this.food){
        this.proteinUnit = this.food.proteinUnit!;
        this.carbUnit = this.food.carbUnit!;
        this.fatUnit = this.food.fatUnit!;
        this.sugarUnit = this.food.sugarUnit!;
        this.fiberUnit = this.food.fiberUnit!;
        this.energyUnit = this.food.energyUnit!;
        if(!this.food.servingName)
        {
          this.food.servingName = this.food.servingSize + " " + this.food.servingSizeUnit;
          this.servingNames.push(this.food.servingName);
        }
        else
          this.servingNames.push(this.food.servingName);
        if(this.food.servingSize! > 1)
        {
          this.servingNames.push('1 ' + this.food.servingSizeUnit);
        }
    }
    this.servingForm  = this.fb.group({
      servingName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      numberOfServings: ['', [Validators.min(1), Validators.required]],
      meal: ['', [Validators.required]]
    });
  }

  confirm() {
    this.bsModalRef.hide();
  }

  decline(){
    this.bsModalRef.hide();
  }

  submit(){
    let servingName = this.servingForm.get('servingName')?.value;
    let numberOfServings = this.servingForm.get('numberOfServings')?.value;
    let meal = this.servingForm.get('meal')?.value;
    let foodServing = this.food?.servingName == servingName ? "default" : "normalized";
    let entry : FoodDiaryEntry = {
      numberOfServings: numberOfServings,
      servingType: foodServing,
      foodItem: this.food!,
      meal: meal,
      foodDiaryEntryID: this.foodDiaryEntry ? this.foodDiaryEntry.foodDiaryEntryID : 0,
      appUserFoodDiaryID: this.foodDiaryEntry ? this.foodDiaryEntry.appUserFoodDiaryID : 0,
      foodItemID: this.food?.foodItemID!
    }

    this.result = entry;

    this.bsModalRef.hide();

  }
  
  updateValues(){
    let servingName = this.servingForm.get('servingName')?.value;
    let numberOfServings = parseFloat(this.servingForm.get('numberOfServings')?.value);
    let foodServing = this.food?.servingName == servingName ? "default" : "normalized";
    if(servingName && servingName.length > 0 && numberOfServings && numberOfServings > 0)
    {
      if(foodServing === "default")
        {
          this.calculatedEnergy = parseFloat(Math.round(this.food!.energy! * numberOfServings).toFixed(2));
          this.calculatedProtein = parseFloat(Math.round(this.food!.protein! * numberOfServings).toFixed(2));
          this.calculatedCarbs = parseFloat(Math.round(this.food!.carb! * numberOfServings).toFixed(2));
          this.calculatedFats = parseFloat(Math.round(this.food!.fat! * numberOfServings).toFixed(2));
          this.calculatedSugar = parseFloat(Math.round(this.food!.sugar! * numberOfServings).toFixed(2));
          this.calculatedFiber = parseFloat(Math.round(this.food!.fiber! * numberOfServings).toFixed(2));
        }
        else{
          this.calculatedEnergy = parseFloat(Math.round((this.food!.energy! / this.food!.servingSize!) * numberOfServings).toFixed(2));
          this.calculatedProtein = parseFloat(Math.round((this.food!.protein! / this.food!.servingSize!) * numberOfServings).toFixed(2));
          this.calculatedCarbs = parseFloat(Math.round((this.food!.carb! / this.food!.servingSize!) * numberOfServings).toFixed(2));
          this.calculatedFats = parseFloat(Math.round((this.food!.fat! / this.food!.servingSize!) * numberOfServings).toFixed(2));
          this.calculatedSugar = parseFloat(Math.round((this.food!.sugar! / this.food!.servingSize!) * numberOfServings).toFixed(2));
          this.calculatedFiber = parseFloat(Math.round((this.food!.fiber! / this.food!.servingSize!) * numberOfServings).toFixed(2));
        }
    }
  }
}
