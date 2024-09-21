using System;

namespace API.DTOs;

public class SearchFoodDto
{
    public int fdcId { get; set; }
    public string? description { get; set; }
    public string? gtinUpc { get; set; }
    public string? servingSizeUnit { get; set; }

    public double servingSize { get; set; }
    public string? householdServingFullText { get; set; }
    public string? packageWeight { get; set; }
    public List<FoodNutrientDto>? foodNutrients { get; set; }
}


public class FoodNutrientDto
{
    public int nutrientId { get; set; }
    public string? nutrientName { get; set; }
    public string? unitName { get; set; }
    public double value { get; set; }

}