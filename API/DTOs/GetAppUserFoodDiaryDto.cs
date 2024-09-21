using System;

namespace API.DTOs;

public class GetAppUserFoodDiaryDto
{
    public int AppUserFoodDiaryId { get; set; }
    public DateOnly FoodDiaryDate { get; set; }
    public ICollection<GetAppUserFoodDiaryEntryDto> FoodDiaryEntries { get; set; } = [];
}


public class GetAppUserFoodDiaryEntryDto
{
    public int FoodDiaryEntryID { get; set; }
    public int AppUserFoodDiaryID { get; set; }
    public int FoodItemID { get; set; }
    public double NumberOfServings { get; set; }
    public required string ServingType { get; set; }
    public required string Meal { get; set; }
    public required GetFoodItemsDto FoodItem { get; set; }
}
