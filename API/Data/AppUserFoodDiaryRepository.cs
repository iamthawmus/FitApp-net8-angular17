using System;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppUserFoodDiaryRepository(DataContext context) : IAppUserFoodDiaryRepository
{
    public void AddAppUserFoodDiary(AppUserFoodDiary appUserFoodDiary)
    {
        context.AppUserFoodDiaries.Add(appUserFoodDiary);
    }

    public void DeleteAppUserFoodDiary(AppUserFoodDiary appUserFoodDiary)
    {
        context.AppUserFoodDiaries.Remove(appUserFoodDiary);
    }

    public async Task<AppUserFoodDiary?> GetAppUserFoodDiaryByDate(int userId, DateOnly FoodDiaryDate)
    {
        return await context.AppUserFoodDiaries.Include(x => x.FoodDiaryEntries)
            .FirstOrDefaultAsync(x => x.UserID == userId && x.FoodDiaryDate == FoodDiaryDate);
    }

    public async Task<AppUserFoodDiary?> GetAppUserFoodDiaryById(int id)
    {
        return await context.AppUserFoodDiaries.Include(x => x.FoodDiaryEntries)
            .FirstOrDefaultAsync(x => x.AppUserFoodDiaryID == id);
    }
}
