using System;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class ExerciseRepository(DataContext dataContext, IMapper mapper) : IExerciseRepository
{
    public void AddExercise(Exercise exercise)
    {
        dataContext.Exercises.Add(exercise);
    }

    public void DeleteExercise(Exercise exercise)
    {
        dataContext.Exercises.Remove(exercise);
    }

    public async Task<Exercise?> GetExerciseById(int id)
    {
        return await dataContext.Exercises.FindAsync(id);
    }

    public async Task<Exercise?> GetExerciseByName(string name)
    {
        return await dataContext.Exercises.FirstOrDefaultAsync(x => x.ExerciseName == name);
    }

    public async Task<IEnumerable<ExerciseDto>> GetExercises()
    {
        var query = dataContext.Exercises
            .OrderBy(x => x.ExerciseName)
            .AsQueryable()
            .ProjectTo<ExerciseDto>(mapper.ConfigurationProvider);

        return await query.ToListAsync();
    }
}
