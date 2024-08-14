using System;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class WorkoutSetRepository(DataContext context) : IWorkoutSetRepository
{
    public void AddWorkoutSet(WorkoutSet workoutSet)
    {
        context.WorkoutSets.Add(workoutSet);
    }

    public void DeleteWorkoutSet(WorkoutSet workoutSet)
    {
        context.WorkoutSets.Remove(workoutSet);
    }

    public async Task<WorkoutSet?> GetWorkoutSetById(int id)
    {
        return await context.WorkoutSets
            .Include(x => x.AppUserWorkout)
            .FirstOrDefaultAsync(x => x.WorkoutSetID == id);
    }

    public async Task<IEnumerable<WorkoutSet>> GetWorkoutSets(int appUserWorkoutID)
    {
        var query = context.WorkoutSets
            .Where(x => x.AppUserWorkoutID == appUserWorkoutID)
            .OrderBy(x => x.Exercise.ExerciseName);
        return await query.ToListAsync();
    }
}
