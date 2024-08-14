using System;
using API.Entities;

namespace API.Interfaces;

public interface IWorkoutSetRepository
{
    public void AddWorkoutSet(WorkoutSet workoutSet);

    public void DeleteWorkoutSet(WorkoutSet workoutSet);

    public Task<WorkoutSet?> GetWorkoutSetById(int id);
    public Task<IEnumerable<WorkoutSet>> GetWorkoutSets(int appUserWorkoutID);
}
