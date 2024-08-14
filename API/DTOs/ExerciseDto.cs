using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ExerciseDto
{
    public string? ExerciseID { get; set; }
    [Required]
    public string? ExerciseName { get; set; }
    [Required]
    public string? WorkoutType { get; set; }
    public string? MuscleGroup { get; set; }
    public string? EquipmentRequired { get; set; }
    public string? Description { get; set; }
}
