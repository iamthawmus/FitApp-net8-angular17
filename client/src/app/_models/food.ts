export interface Food {
    fdcId: number;
    description: string | null;
    gtinUpc: string | null;
    servingSizeUnit: string | null;
    servingSize: number;
    householdServingFullText: string | null;
    packageWeight: string | null;
    foodNutrients: Nutrient[] | null;
}

export interface Nutrient {
    nutrientId: number;
    nutrientName: string | null;
    unitName: string | null;
    value: number;
}