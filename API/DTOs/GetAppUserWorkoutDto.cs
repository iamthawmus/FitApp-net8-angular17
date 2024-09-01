using System;
using System.ComponentModel.DataAnnotations;
using API.Entities;

namespace API.DTOs;

public class GetAppUserWorkoutResponseDto
{
    public int AppUserWorkoutID { get; set; }
    public DateTime WorkoutDate { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? WorkoutName { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? Description { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? Notes { get; set; }
    public ICollection<GetAppUserWorkoutSetDto> WorkoutSets { get; set; } = [];
}

public class GetAppUserWorkoutSetDto
{
    public int WorkoutSetID { get; set; }
    public int ExerciseID { get; set; }
    public int SetNumber { get; set; }
    public int RepetitionsPerSet { get; set; }
    public decimal WeightPerRepetition { get; set; }
    public int DurationInMinutes { get; set; }
    public int Distance { get; set; }
}