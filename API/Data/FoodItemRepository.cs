using System;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class FoodItemRepository(DataContext context) : IFoodItemRepository
{
    public void AddFoodItem(FoodItem foodItem)
    {
       context.FoodItems.Add(foodItem);
    }

    public void DeleteFoodItem(FoodItem foodItem)
    {
        context.FoodItems.Remove(foodItem);
    }

    public async Task<FoodItem?> GetFoodItemByFdcId(int fdcId)
    {
        return await context.FoodItems
            .FirstOrDefaultAsync(x => x.FdcID == fdcId);
    }

    public async Task<FoodItem?> GetFoodItemById(int id)
    {
        return await context.FoodItems
            .FirstOrDefaultAsync(x => x.FoodItemID == id);
    }

    public async Task<FoodItem?> GetFoodItemByUpc(string gtinupc)
    {
        return await context.FoodItems
            .FirstOrDefaultAsync(x => x.GtinUpc == gtinupc);
    }

    public async Task<IEnumerable<FoodItem>> GetFoodItems()
    {
        var query = context.FoodItems
            .OrderBy(x => x.Name)
            .AsQueryable();

        return await query.ToListAsync();
    }
}
