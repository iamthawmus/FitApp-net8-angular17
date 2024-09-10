using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class AppUserFoodDiaryDto
{
    [Required]
    public DateOnly FoodDiaryDate { get; set; }

}
