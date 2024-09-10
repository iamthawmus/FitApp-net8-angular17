using System;

namespace API.Entities;

public class FoodDiaryEntry
{
    public int FoodDiaryEntryID { get; set; }
    public int AppUserFoodDiaryID { get; set; }
    public int FoodItemID { get; set; }
    public double NumberOfServings { get; set; }
    public required string ServingType { get; set; }
    public required string Meal { get; set; }
    // Navigation properties
    public AppUserFoodDiary AppUserFoodDiary { get; set; } = null!;
    public FoodItem FoodItem { get; set; } = null!;
}
