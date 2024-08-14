using System;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class WorkoutLogController(IUnitOfWork unitOfWork, IMapper mapper) : BaseApiController
{
    [HttpPost("create-workout")]
    public async Task<ActionResult<AppUserWorkout>> CreateAppUserWorkout(AppUserWorkoutDto appUserWorkoutDto)
    {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
        if(user == null)
            return BadRequest("Cannot find user");

       var userWorkout = await unitOfWork.AppUserWorkoutRepository.GetAppUserWorkoutByDate(user.Id, appUserWorkoutDto.WorkoutDate);
        if(userWorkout != null)
            return BadRequest("There is already a workout created on that date");
            
        var workout = new AppUserWorkout {
            WorkoutDate = appUserWorkoutDto.WorkoutDate,
            WorkoutName = appUserWorkoutDto.WorkoutName,
            Description = appUserWorkoutDto.Description,
            Notes = appUserWorkoutDto.Notes,
            UserID = user.Id
        };

        unitOfWork.AppUserWorkoutRepository.AddAppUserWorkout(workout);

        if(await unitOfWork.Complete()) return Ok(new { workout.AppUserWorkoutID });

        return BadRequest("Failed to create new user workout");
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpPost("create-exercise")]
    public async Task<ActionResult<Exercise>> CreateExercise(ExerciseDto exerciseDto)
    {
        if(String.IsNullOrEmpty(exerciseDto.ExerciseName) || String.IsNullOrEmpty(exerciseDto.WorkoutType))
            return BadRequest("Exercise name and Workout Type cannot be empty");

        var checkForDupes = await unitOfWork.ExerciseRepository.GetExerciseByName(exerciseDto.ExerciseName);
        if(checkForDupes != null 
            || (checkForDupes != null && checkForDupes.ExerciseName.ToLower() == exerciseDto.ExerciseName.ToLower()))
            return BadRequest("Exercise has already been added");

        var exercise = new Exercise {
            ExerciseName = exerciseDto.ExerciseName,
            WorkoutType = exerciseDto.WorkoutType,
            MuscleGroup = exerciseDto.MuscleGroup,
            EquipmentRequired = exerciseDto.EquipmentRequired,
            Description = exerciseDto.Description
        };

        unitOfWork.ExerciseRepository.AddExercise(exercise);

        if(await unitOfWork.Complete()) return Ok(new {exercise.ExerciseID});

        return BadRequest("Failed to create new exercise");
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpPut("update-exercise/{id}")]
    public async Task<ActionResult> UpdateExercise([FromRoute] int id, [FromBody] UpdateExerciseDto exerciseDto)
    {
        var username = User.GetUsername();
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
        if(user == null)
            return BadRequest("Cannot find user");
        
        var exercise = await unitOfWork.ExerciseRepository.GetExerciseById(id);
        if(exercise == null)
            return BadRequest("Cannot find exercise");

        mapper.Map(exerciseDto, exercise);

       if(await unitOfWork.Complete()) return Ok();

        return BadRequest("Problem updating the exercise");
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpDelete("delete-exercise/{id}")]
    public async Task<ActionResult> DeleteExercise(int id)
    {
        var exercise = await unitOfWork.ExerciseRepository.GetExerciseById(id);
        if(exercise == null)
            return BadRequest("Cannot find exercise");

        unitOfWork.ExerciseRepository.DeleteExercise(exercise);

        if(await unitOfWork.Complete()) return Ok();

        return BadRequest("Problem deleting the exercise");

    }

    [HttpGet("get-exercises")]
    public async Task<ActionResult<IEnumerable<Exercise>>> GetExercises()
    {
        return Ok(await unitOfWork.ExerciseRepository.GetExercises());
    }

    [HttpPost("create-workout-set")]
    public async Task<ActionResult<WorkoutSet>> CreateWorkoutSet(WorkoutSetDto workoutSetDto)
    {
        var appUserWorkout = await unitOfWork.AppUserWorkoutRepository.GetAppUserWorkoutById(workoutSetDto.AppUserWorkoutID);
        if(appUserWorkout == null)
            return BadRequest("Failed to find user workout");

        var exercise = await unitOfWork.ExerciseRepository.GetExerciseById(workoutSetDto.ExerciseID);
        if(exercise == null)
            return BadRequest("Failed to find exercise");

        var newWorkoutSet = new WorkoutSet {
            AppUserWorkout = appUserWorkout,
            Exercise = exercise,
            AppUserWorkoutID = workoutSetDto.AppUserWorkoutID,
            ExerciseID = workoutSetDto.ExerciseID,
            SetNumber = workoutSetDto.SetNumber,
            RepetitionsPerSet = workoutSetDto.RepetitionsPerSet,
            WeightPerRepetition = workoutSetDto.WeightPerRepetition,
            DurationInMinutes = workoutSetDto.DurationInMinutes,
            Distance = workoutSetDto.Distance
        };

        unitOfWork.WorkoutSetRepository.AddWorkoutSet(newWorkoutSet);

        if(await unitOfWork.Complete()) return Ok(new { newWorkoutSet.WorkoutSetID });

        return BadRequest("Failed to create new workout set");
    }

    [HttpDelete("delete-workout-set/{id}")]
    public async Task<ActionResult> DeleteWorkoutSet(int id)
    {
        var workoutSet = await unitOfWork.WorkoutSetRepository.GetWorkoutSetById(id);
        if(workoutSet == null)
            return BadRequest("Cannot find workout set");

        var username = User.GetUsername();
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
        if(user == null)
            return BadRequest("Cannot find user");
        
        if(user != workoutSet.AppUserWorkout.AppUser)
            return BadRequest("User did not match Workout's User");

        unitOfWork.WorkoutSetRepository.DeleteWorkoutSet(workoutSet);

        if(await unitOfWork.Complete()) return Ok();

        return BadRequest("Problem deleting the workout set");

    }

    [HttpPut("update-workout-set/{id}")]
    public async Task<ActionResult> UpdateWorkoutSet([FromRoute] int id, [FromBody] UpdateWorkoutSetDto workoutSetDto)
    {
        var username = User.GetUsername();
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
        if(user == null)
            return BadRequest("Cannot find user");
        
        var workoutSet = await unitOfWork.WorkoutSetRepository.GetWorkoutSetById(id);
        if(workoutSet == null)
            return BadRequest("Cannot find workout set");

        if(user != workoutSet.AppUserWorkout.AppUser)
            return BadRequest("User did not match Workout's User"); 

        mapper.Map(workoutSetDto, workoutSet);

       if(await unitOfWork.Complete()) return Ok();

        return BadRequest("Problem updating the workout set");
    }

    [HttpGet("get-user-workout")]
    public async Task<ActionResult<GetAppUserWorkoutResponseDto?>> GetAppUserWorkout(string username, string workoutDate)
    {
        if(String.IsNullOrEmpty(username))
            return BadRequest("Missing Username");
        if(String.IsNullOrEmpty(workoutDate))
            return BadRequest("Missing Date");

        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);

        if(user == null)
            return BadRequest("Cannot find user");

       var userWorkout = await unitOfWork.AppUserWorkoutRepository.GetAppUserWorkoutByDate(user.Id, DateTime.Parse(workoutDate));

       if(userWorkout == null)
        return BadRequest("Could not find workout");

        var workoutSetDtos = new List<GetAppUserWorkoutSetDto>();

        foreach(var workout in userWorkout.WorkoutSet)
        {
            var newDto = new GetAppUserWorkoutSetDto
            {
                WorkoutSetID = workout.WorkoutSetID,
                ExerciseID = workout.ExerciseID,
                SetNumber = workout.SetNumber,
                RepetitionsPerSet = workout.RepetitionsPerSet,
                WeightPerRepetition = workout.WeightPerRepetition,
                DurationInMinutes = workout.DurationInMinutes,
                Distance = workout.Distance
            };
            workoutSetDtos.Add(newDto);
        }

        var res = new GetAppUserWorkoutResponseDto
        {
            AppUserWorkoutID = userWorkout.AppUserWorkoutID,
            WorkoutDate = userWorkout.WorkoutDate,
            WorkoutName = userWorkout.WorkoutName,
            Description = userWorkout.Description,
            Notes = userWorkout.Notes,
            WorkoutSets = workoutSetDtos
        };

        return Ok(res);
    }
}
