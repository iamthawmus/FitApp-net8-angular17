using System;

namespace API.DTOs;

public class UpdateFoodDiaryEntryDto
{
    public double NumberOfServings { get; set; }
    public required string ServingType { get; set; }
    public required string Meal { get; set; }
}
