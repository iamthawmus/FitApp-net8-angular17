using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class AppUserWorkoutDto
{
    [Required]
    public DateTime WorkoutDate { get; set; }

    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? WorkoutName { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? Description { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? Notes { get; set; }
}
