using System;

namespace API.DTOs;

public class UpdateExerciseDto
{
    public string? ExerciseName { get; set; }
    public string? WorkoutType { get; set; }
    public string? MuscleGroup { get; set; }
    public string? EquipmentRequired { get; set; }
    public string? Description { get; set; }
}
