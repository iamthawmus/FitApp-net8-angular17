using System;
using API.Entities;

namespace API.Interfaces;

public interface IFoodDiaryEntryRepository
{
    public void AddFoodDiaryEntry(FoodDiaryEntry entry);
    public void DeleteFoodDiaryEntry(FoodDiaryEntry entry);
    public Task<FoodDiaryEntry?> GetFoodDiaryEntryById(int id);
    public Task<IEnumerable<FoodDiaryEntry>> GetFoodDiaryEntriesById(int appUserFoodDiaryID);
}
