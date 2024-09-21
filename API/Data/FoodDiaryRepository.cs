using System;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class FoodDiaryRepository(DataContext context) : IFoodDiaryEntryRepository
{
    public void AddFoodDiaryEntry(FoodDiaryEntry entry)
    {
        context.FoodDiaryEntries.Add(entry);
    }

    public void DeleteFoodDiaryEntry(FoodDiaryEntry entry)
    {
        context.FoodDiaryEntries.Remove(entry);
    }

    public async Task<FoodDiaryEntry?> GetFoodDiaryEntryById(int id)
    {
        return await context.FoodDiaryEntries.Include(x => x.AppUserFoodDiary)
            .FirstOrDefaultAsync(x => x.FoodDiaryEntryID == id);
    }

    public async Task<IEnumerable<FoodDiaryEntry>> GetFoodDiaryEntriesById(int appUserFoodDiaryID)
    {
        var query = context.FoodDiaryEntries
            .Where(x => x.AppUserFoodDiaryID == appUserFoodDiaryID)
            .Include(x => x.FoodItem);    
        return await query.ToListAsync(); 
    }
}
