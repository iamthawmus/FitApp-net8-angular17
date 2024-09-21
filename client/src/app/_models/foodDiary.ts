export interface AppUserFoodDiary
{
    appUserFoodDiaryID : number;
    foodDiaryDate : Date;
    foodDiaryEntries: FoodDiaryEntry[];
}

export interface FoodDiaryEntry
{
    foodDiaryEntryID : number;
    appUserFoodDiaryID : number;
    foodItemID : number;
    numberOfServings: number;
    servingType: string;
    foodItem: FoodItem;
    meal: string | undefined;
}

export interface FoodItem{
    foodItemID : number;
    name : string;
    fdcID: number;
    servingName: string | undefined;
    servingSize: number | undefined;
    servingSizeUnit: string | undefined;
    protein: number | undefined;
    proteinUnit: string | undefined;
    fat: number | undefined;
    fatUnit: string | undefined;
    carb: number | undefined;
    carbUnit: string | undefined;
    energy: number | undefined;
    energyUnit: string | undefined;
    sugar: number | undefined;
    sugarUnit: string | undefined;
    fiber: number | undefined;
    fiberUnit: string | undefined;
}
