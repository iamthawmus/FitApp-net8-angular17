using System;
using API.Entities;

namespace API.Interfaces;

public interface IAppUserFoodDiaryRepository
{
    public void AddAppUserFoodDiary(AppUserFoodDiary appUserFoodDiary);

    public void DeleteAppUserFoodDiary(AppUserFoodDiary appUserFoodDiary);

    public Task<AppUserFoodDiary?> GetAppUserFoodDiaryById(int id);
    public Task<AppUserFoodDiary?> GetAppUserFoodDiaryByDate(int userId, DateOnly FoodDiaryDate);
}
