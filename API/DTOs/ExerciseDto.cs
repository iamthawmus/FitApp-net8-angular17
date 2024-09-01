using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ExerciseDto
{
    public string? ExerciseID { get; set; }
    [Required]
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? ExerciseName { get; set; }
    [Required]
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? WorkoutType { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? MuscleGroup { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? EquipmentRequired { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? Description { get; set; }
}
