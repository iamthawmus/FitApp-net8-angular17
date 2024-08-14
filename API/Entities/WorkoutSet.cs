using System;

namespace API.Entities;

public class WorkoutSet
{
    public int WorkoutSetID { get; set; }
    public int AppUserWorkoutID { get; set; }
    public int ExerciseID { get; set; }
    public int SetNumber { get; set; }
    public int RepetitionsPerSet { get; set; }
    public decimal WeightPerRepetition { get; set; }
    public int DurationInMinutes { get; set; }
    public int Distance { get; set; }

    // Navigation properties
    public AppUserWorkout AppUserWorkout { get; set; } = null!;
    public Exercise Exercise { get; set; } = null!;
}


