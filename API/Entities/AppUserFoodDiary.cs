using System;

namespace API.Entities;

public class AppUserFoodDiary
{
    public int AppUserFoodDiaryID { get; set; }
    public int UserID { get; set; }
    public DateOnly FoodDiaryDate { get; set; }

    //Navigation
    public AppUser AppUser { get; set; } = null!;
    public ICollection<FoodDiaryEntry> FoodDiaryEntries { get; set; } = [];
}
