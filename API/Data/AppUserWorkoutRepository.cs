using System;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Migrations;

public class AppUserWorkoutRepository(DataContext context) : IAppUserWorkoutRepository
{
    public void AddAppUserWorkout(AppUserWorkout appUserWorkout)
    {
        context.AppUserWorkouts.Add(appUserWorkout);
    }

    public void DeleteAppUserWorkout(AppUserWorkout appUserWorkout)
    {
        context.AppUserWorkouts.Remove(appUserWorkout);
    }

    public async Task<AppUserWorkout?> GetAppUserWorkoutByDate(int userId, DateTime workoutDate)
    {
        return await context.AppUserWorkouts.Include(x => x.WorkoutSet)
            .FirstOrDefaultAsync(x => x.UserID == userId && x.WorkoutDate == workoutDate);
    }

    public async Task<AppUserWorkout?> GetAppUserWorkoutById(int id)
    {
        return await context.AppUserWorkouts.FindAsync(id);
    }

}
