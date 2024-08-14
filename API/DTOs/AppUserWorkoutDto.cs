using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class AppUserWorkoutDto
{
    [Required]
    public DateTime WorkoutDate { get; set; }
    public string? WorkoutName { get; set; }
    public string? Description { get; set; }
    public string? Notes { get; set; }
}
