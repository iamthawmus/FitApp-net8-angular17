using System;
using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IExerciseRepository
{
    public void AddExercise(Exercise exercise);

    public void DeleteExercise(Exercise exercise);

    public Task<Exercise?> GetExerciseById(int id);
    public Task<Exercise?> GetExerciseByName(string name);

    public Task<IEnumerable<ExerciseDto>> GetExercises();

    public int GetExerciseCount();
}
