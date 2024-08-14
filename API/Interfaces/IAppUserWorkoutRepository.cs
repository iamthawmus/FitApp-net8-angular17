using System;
using API.Entities;

namespace API.Interfaces;

public interface IAppUserWorkoutRepository
{
    public void AddAppUserWorkout(AppUserWorkout appUserWorkout);

    public void DeleteAppUserWorkout(AppUserWorkout appUserWorkout);

    public Task<AppUserWorkout?> GetAppUserWorkoutById(int id);
    public Task<AppUserWorkout?> GetAppUserWorkoutByDate(int userId, DateTime workoutDate);
}
