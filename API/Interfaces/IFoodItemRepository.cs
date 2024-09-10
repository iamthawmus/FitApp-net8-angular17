using System;
using API.Entities;

namespace API.Interfaces;

public interface IFoodItemRepository
{
    public void AddFoodItem(FoodItem foodItem);
    public void DeleteFoodItem(FoodItem foodItem);
    public Task<FoodItem?> GetFoodItemById(int id);
    public Task<FoodItem?> GetFoodItemByFdcId(int fdcId);
    public Task<FoodItem?> GetFoodItemByUpc(string gtinupc);

    public Task<IEnumerable<FoodItem>> GetFoodItems();
}
