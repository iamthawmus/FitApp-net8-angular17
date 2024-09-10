import { Component, inject, OnInit } from '@angular/core';
import { FoodDataService } from '../../_services/food-data.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { Food } from '../../_models/food';
import { ToastrService } from 'ngx-toastr';
import { AppUserFoodDiary, FoodDiaryEntry, FoodItem } from '../../_models/foodDiary';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { FoodServingModalComponent } from '../../modals/food-serving-modal/food-serving-modal.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FoodDiaryCardComponent } from "../food-diary-card/food-diary-card.component";
import { ConfirmDialogComponent } from '../../modals/confirm-dialog/confirm-dialog.component';
import { FoodDiaryService } from '../../_services/food-diary.service';
import { getDateOnly, getFormattedDate } from '../../_helpers/date-format';
import { DatePickerComponent } from '../../_forms/date-picker/date-picker.component';
import { AccountService } from '../../_services/account.service';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';

@Component({
  selector: 'app-food-diary',
  standalone: true,
  imports: [TypeaheadModule, FormsModule, AccordionModule, FoodDiaryCardComponent, ReactiveFormsModule, DatePickerComponent],
  templateUrl: './food-diary.component.html',
  styleUrl: './food-diary.component.css'
})
export class FoodDiaryComponent implements OnInit {
  private accountService = inject(AccountService);
  foodDiaryService = inject(FoodDiaryService);
  foodDataService = inject(FoodDataService);
  private fb = inject(FormBuilder)
  toastr = inject(ToastrService);
  private modalService = inject(BsModalService);
  typeaheadFoodList: string[] = [];
  searchResultsList: FoodItem[] = [];
  selectedFood?: string;
  nutrientIdList: number[] =
    [
      1003, //Protein
      1004, //Fat
      1005, //Carb
      1008, //Calories
      2000, //Sugar
      1079 //Fiber
    ];
  bsModalRef: BsModalRef<FoodServingModalComponent> = new BsModalRef<FoodServingModalComponent>();
  bsConfirmModalRef: BsModalRef<ConfirmDialogComponent> = new BsModalRef<ConfirmDialogComponent>();

  currentProtein: number = 0;
  currentFat: number = 0;
  currentCarb: number = 0;
  currentCalories: number = 0;
  currentSugar: number = 0;
  currentFiber: number = 0;
  oneAtATime = true;

  currentFoodDiary : AppUserFoodDiary | undefined;

  foodDiaryDateForm: FormGroup = new FormGroup({});
  maxDate = new Date();
  toggleCalenderForm = false;
  currentDate: string = "";

  ngOnInit(): void {
    this.intializeForm();
    this.getFoodDiaryByDate(undefined);
  }

  intializeForm(){
    this.foodDiaryDateForm  = this.fb.group({
      foodDiaryDate: ['', [Validators.required]],
    });
  }


  startFoodDiary(){
    let searchDate = undefined;
    if(this.toggleCalenderForm)
    {
      searchDate = this.foodDiaryDateForm.get('foodDiaryDate')?.value;
    }
    searchDate = getDateOnly(undefined);
    this.foodDiaryService.createFoodDiary({ "FoodDiaryDate" : searchDate }).subscribe({
      next: (response : any) => {
        if(response)
        {
          let newDiary : AppUserFoodDiary = {
            appUserFoodDiaryID: response.appUserFoodDiaryID,
            foodDiaryDate: new Date(getFormattedDate(searchDate)),
            foodDiaryEntries: []
          }
          this.currentFoodDiary = newDiary;
        }
      },
      error: (response : any) => {
        let res = response;
        this.getFoodDiaryByDate(searchDate)
      }
    });
  }

  getCurrentDate() : string {
    let date = "";
    if(this.currentFoodDiary?.foodDiaryDate){
      return this.currentFoodDiary.foodDiaryDate.toISOString().slice(0,10);
    }
    return date;
  }
  getCurrentCalories() : number {
    this.currentCalories = 0;
    this.currentFoodDiary?.foodDiaryEntries?.forEach((item) => {
      if(item.servingType == "default")
        this.currentCalories += (item.foodItem.energy! * item.numberOfServings);
      else
        this.currentCalories += ((item.foodItem.energy! / item.foodItem.servingSize!) * item.numberOfServings);
      });

    this.currentCalories = parseFloat(Math.round(this.currentCalories).toFixed(2));
    return this.currentCalories;
  }

  getCurrentProtein() : number {
    this.currentProtein = 0;
    this.currentFoodDiary?.foodDiaryEntries?.forEach((item) => {
      if(item.servingType == "default")
        this.currentProtein += (item.foodItem.protein! * item.numberOfServings);
      else
        this.currentProtein += ((item.foodItem.protein! / item.foodItem.servingSize!) * item.numberOfServings);
    });

    this.currentProtein = parseFloat(Math.round(this.currentProtein).toFixed(2));
    return this.currentProtein;
  }

  getCurrentFat() : number {
    this.currentFat = 0;
    this.currentFoodDiary?.foodDiaryEntries?.forEach((item) => {
      if(item.servingType == "default")
        this.currentFat += (item.foodItem.fat! * item.numberOfServings);
      else
        this.currentFat += ((item.foodItem.fat! / item.foodItem.servingSize!) * item.numberOfServings);
    });

    this.currentFat = parseFloat(Math.round(this.currentFat).toFixed(2));
    return this.currentFat;
  }

  getCurrentCarb() : number {
    this.currentCarb = 0;
    this.currentFoodDiary?.foodDiaryEntries?.forEach((item) => {
      if(item.servingType == "default")
        this.currentCarb += (item.foodItem.carb! * item.numberOfServings);
      else
        this.currentCarb += ((item.foodItem.carb! / item.foodItem.servingSize!) * item.numberOfServings);
    });

    this.currentCarb = parseFloat(Math.round(this.currentCarb).toFixed(2));
    return this.currentCarb;
  }

  getCurrentSugar() : number {
    this.currentSugar = 0;
    this.currentFoodDiary?.foodDiaryEntries?.forEach((item) => {
      if(item.servingType == "default")
        this.currentSugar += (item.foodItem.sugar! * item.numberOfServings);
      else
        this.currentSugar += ((item.foodItem.sugar! / item.foodItem.servingSize!) * item.numberOfServings);
    });

    this.currentSugar = parseFloat(Math.round(this.currentSugar).toFixed(2));
    return this.currentSugar;
  }

  getCurrentFiber() : number {
    this.currentFiber = 0;
    this.currentFoodDiary?.foodDiaryEntries?.forEach((item) => {
      if(item.servingType == "default")
        this.currentFiber += (item.foodItem.fiber! * item.numberOfServings);
      else
        this.currentFiber += ((item.foodItem.fiber! / item.foodItem.servingSize!) * item.numberOfServings);
      });

    this.currentFiber = parseFloat(Math.round(this.currentFiber).toFixed(2));
    return this.currentFiber;
  }


  addFood() {
    if (!this.selectedFood || this.selectedFood.length == 0)
      return;
    let item : FoodItem | undefined = this.searchResultsList.find((item) => item.name == this.selectedFood);
    if(!item)
    {
      this.toastr.error("Could not find food with that specific name.");
      return;
    }
    this.openFoodServingModal(item);
  }

  queryFood() {
    if (!this.selectedFood || this.selectedFood.length == 0)
      return;

    let cacheResponse = this.foodDataService.foodCache.get(this.selectedFood);
    if (cacheResponse) {
      if (cacheResponse && cacheResponse.length > 0) {
        this.typeaheadFoodList = [...this.foodDataService.foodItemMap.keys()];
        this.searchResultsList = this.convertSearchResultsToFoodItem(cacheResponse);
      }
      else {
        this.toastr.error("No results found!");
      }
    }
    else {
      this.foodDataService.searchFood({ query: this.selectedFood }).subscribe({
        next: (response: Food[]) => {
          if (response && response.length > 0) {
            this.foodDataService.foodCache.set(this.selectedFood, response);
            this.typeaheadFoodList = this.foodDataService.addToFoodMap(response);
            this.searchResultsList = this.convertSearchResultsToFoodItem(response);
          }
          else {
            this.toastr.error("No results found!");
          }
        }
      });
    }
  }

  convertSearchResultsToFoodItem(results: Food[]): FoodItem[] {
    let items: FoodItem[] = [];
    results?.forEach((food) => {
      let newFoodItem: FoodItem = this.getFoodItem(food);
      items.push(newFoodItem);
    })
    return items;
  }

  getFoodItem(food: Food): FoodItem{
    let serving: FoodItem = {
      name: food.description!,
      fdcID: food.fdcId,
      servingSize: food.servingSize ? food.servingSize : 1,
      servingSizeUnit: food.servingSizeUnit ? food.servingSizeUnit : 'unit',
      servingName: '',
      protein: 0,
      proteinUnit: undefined,
      fat: 0,
      fatUnit: undefined,
      carb: 0,
      carbUnit: undefined,
      energy: 0,
      energyUnit: undefined,
      sugar: 0,
      sugarUnit: undefined,
      fiber: 0,
      fiberUnit: undefined,
      foodItemID: -1
    };
    serving.servingName = serving.servingSize + ' ' + serving.servingSizeUnit;

    food.foodNutrients?.forEach((value) => {
      if (value.nutrientId == 1003) {
        serving.protein = value.value;
        serving.proteinUnit = value.unitName!;
      } else if (value.nutrientId == 1004) {
        serving.fat = value.value;
        serving.fatUnit = value.unitName!;
      } else if (value.nutrientId == 1005) {
        serving.carb = value.value;
        serving.carbUnit = value.unitName!;
      } else if (value.nutrientId == 1008) {
        serving.energy = value.value;
        serving.energyUnit = value.unitName!;
      } else if (value.nutrientId == 2000) {
        serving.sugar = value.value;
        serving.sugarUnit = value.unitName!;
      } else if (value.nutrientId == 1079) {
        serving.fiber = value.value;
        serving.fiberUnit = value.unitName!;
      }
    });
    return serving;
  }

  openFoodServingModal(food: FoodItem) {
    const initialState: ModalOptions = {
      class: 'modal-lg',
      initialState: {
        title: 'Add Food: ' + food.name,
        food: food,
        btnOkText: 'Add',
        btnCancelText: 'Cancel'
      }
    };

    this.bsModalRef = this.modalService.show(FoodServingModalComponent, initialState);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef.content?.result) {
          this.addFoodItem(food, this.bsModalRef.content?.result);
        }
      }
    })
  }

  deleteItem(food: FoodDiaryEntry, index: number){
    const config: ModalOptions = {
      initialState: {
        title: 'Confirmation',
        message: 'Are you sure you want to do this?',
        btnOkText: 'Ok',
        btnCancelText: 'Cancel',
      }
    };
    this.bsConfirmModalRef = this.modalService.show(ConfirmDialogComponent, config);
    this.bsConfirmModalRef.onHide?.subscribe({
      next: () => {
        if(this.bsConfirmModalRef?.content?.result){
          this.deleteFoodDiaryEntry(food.foodDiaryEntryID, index);
        }
      }
    });
  }

  editItem(foodDiaryEntry: FoodDiaryEntry, index: number){
    let foodItem : FoodItem | undefined = this.foodDiaryService.foodItems.find((item) => item.name == foodDiaryEntry.foodItem.name);
    if(!foodItem)
        return;
    const initialState: ModalOptions = {
      class: 'modal-lg',
      initialState: {
        title: 'Edit Food: ' + foodDiaryEntry.foodItem.name,
        food: foodItem,
        btnOkText: 'Edit',
        btnCancelText: 'Cancel',
        foodDiaryEntry: foodDiaryEntry
      }
    };

    this.bsModalRef = this.modalService.show(FoodServingModalComponent, initialState);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        if (this.bsModalRef.content?.result) {
          let newEntry = this.bsModalRef.content?.result;

          this.updateFoodDiaryEntry(newEntry.foodDiaryEntryID, newEntry, index);
        }
      }
    })
  }

  addFoodItem(foodItem : FoodItem, foodDiaryEntry : FoodDiaryEntry){
    let cachedItem = this.foodDiaryService.foodItems.find((item) => item.fdcID == foodItem.fdcID);
    if(!cachedItem)
    {
      // check to see if food item is in db
      this.foodDiaryService.createFoodItem(foodItem).subscribe({
        next: (response : any) => {
          if(response)
          { // response should be new id number
            foodItem.foodItemID = response.foodItemID;
            if(!this.foodDiaryService.foodItems.includes(foodItem))
              this.foodDiaryService.foodItems.push(foodItem);
            this.addFoodDiaryEntry(foodItem, foodDiaryEntry);
          }
        }
      });
    }else{
      this.addFoodDiaryEntry(cachedItem, foodDiaryEntry);
    }
  }

  addFoodDiaryEntry(foodItem : FoodItem, foodDiaryEntry : FoodDiaryEntry)
  {
    let newEntry = foodDiaryEntry;
    newEntry.foodItemID = foodItem.foodItemID;
    newEntry.appUserFoodDiaryID = this.currentFoodDiary?.appUserFoodDiaryID!;
    this.foodDiaryService.createFoodDiaryEntry(newEntry).subscribe({
      next: (response : any) => {
        if(response?.foodDiaryEntryID)
        {
          newEntry.foodDiaryEntryID = response.foodDiaryEntryID;
          this.currentFoodDiary?.foodDiaryEntries.push(newEntry);
        }
      }
    })
  }

  deleteFoodDiaryEntry(id: number, index: number){
    this.foodDiaryService.deleteFoodDiaryEntry(id).subscribe({
      next: (response) => {
        if(response)
        {
          this.currentFoodDiary?.foodDiaryEntries.splice(index, 1);
        }
      }
    })
  }

  updateFoodDiaryEntry(id: number, foodDiaryEntry : FoodDiaryEntry, index: number)
  {
    let updateModel = {
      "NumberOfServings": foodDiaryEntry.numberOfServings,
      "ServingType": foodDiaryEntry.servingType,
      "Meal": foodDiaryEntry.meal
    };
    this.foodDiaryService.updateFoodDiaryEntry(id, updateModel).subscribe({
      next: (response : any) => {
        if(response?.foodDiaryEntryID)
        {
          this.currentFoodDiary!.foodDiaryEntries[index] = foodDiaryEntry;
        }
      }
    })
  }

  findFoodDiaryByDate(){
    const diaryDate = getDateOnly(this.foodDiaryDateForm.get('foodDiaryDate')?.value);
    if(!diaryDate){
      this.toastr.error("No date selected");
      return;
    }
    this.getFoodDiaryByDate(diaryDate);
  }

  getFoodDiaryByDate(date : string | undefined){
    let username = this.accountService.currentUser()?.username;
    if(!username){
      this.toastr.error("Could not find username");
      return;
    }
    this.foodDiaryService.getUserFoodDiary(username, getDateOnly(date)).subscribe({
      next: (response : any) => {
        if(response)
        {
          this.currentFoodDiary = response;
          this.currentFoodDiary!.appUserFoodDiaryID = response.appUserFoodDiaryId; 
          this.currentFoodDiary?.foodDiaryEntries.forEach((entry) => {
            if(!this.foodDiaryService.foodItems.includes(entry.foodItem))
              this.foodDiaryService.foodItems.push(entry.foodItem);
          });
        }
      }
    });
  }

  toggleCalenderButton(){
    this.toggleCalenderForm = !this.toggleCalenderForm;
  }
}
