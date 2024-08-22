using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class WorkoutSetDto
{
    [Required]
    public int AppUserWorkoutID { get; set; }
    [Required]
    public int ExerciseID { get; set; }
    public int SetNumber { get; set; }
    public int RepetitionsPerSet { get; set; }
    public decimal WeightPerRepetition { get; set; }
    public int DurationInMinutes { get; set; }
    public int Distance { get; set; }
}
