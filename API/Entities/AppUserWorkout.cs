using System;

namespace API.Entities;

public class AppUserWorkout
{
    public int AppUserWorkoutID { get; set; }
    public int UserID { get; set; }
    public DateTime WorkoutDate { get; set; }
    public string? WorkoutName { get; set; }
    public string? Description { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public AppUser AppUser { get; set; } = null!;
    public ICollection<WorkoutSet> WorkoutSet { get; set; } = [];
}
