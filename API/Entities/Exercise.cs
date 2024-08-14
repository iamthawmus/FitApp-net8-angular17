using System;

namespace API.Entities;

public class Exercise
{
    public int ExerciseID { get; set; }
    public required string ExerciseName { get; set; }
    public required string WorkoutType { get; set; }
    public string? MuscleGroup { get; set; }
    public string? EquipmentRequired { get; set; }
    public string? Description { get; set; }

    // Navigation properties
    public ICollection<WorkoutSet> WorkoutSet { get; set; } = [];
}

