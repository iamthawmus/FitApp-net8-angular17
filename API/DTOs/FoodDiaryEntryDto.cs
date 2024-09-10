using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class FoodDiaryEntryDto
{
    [Required]
    public int AppUserFoodDiaryID { get; set; }
    [Required]
    public int FoodItemID { get; set; }
    [Required]
    public double NumberOfServings { get; set; }
    [Required]
    [StringLength(50, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public required string ServingType { get; set; }
    [Required]
    [StringLength(50, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public required string Meal { get; set; }
}
