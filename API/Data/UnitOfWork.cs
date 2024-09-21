using API.Interfaces;

namespace API.Data;

public class UnitOfWork(DataContext context, IUserRepository userRepository, 
    IMessageRepository messageRepository, ILikesRepository likesRepository, IPhotoRepository photoRepository,
    IExerciseRepository exerciseRepository, IWorkoutSetRepository workoutSetRepository, IAppUserWorkoutRepository appUserWorkoutRepository,
    IFoodItemRepository foodItemRepository, IFoodDiaryEntryRepository foodDiaryEntryRepository, IAppUserFoodDiaryRepository appUserFoodDiaryRepository) : IUnitOfWork
{
    public IUserRepository UserRepository => userRepository;

    public IMessageRepository MessageRepository => messageRepository;

    public ILikesRepository LikesRepository => likesRepository;

    public IPhotoRepository PhotoRepository => photoRepository;
    public IExerciseRepository ExerciseRepository => exerciseRepository;
    public IWorkoutSetRepository WorkoutSetRepository => workoutSetRepository;
    public IAppUserWorkoutRepository AppUserWorkoutRepository => appUserWorkoutRepository;
    public IFoodItemRepository FoodItemRepository => foodItemRepository;
    public IFoodDiaryEntryRepository FoodDiaryEntryRepository => foodDiaryEntryRepository;
    public IAppUserFoodDiaryRepository AppUserFoodDiaryRepository => appUserFoodDiaryRepository;

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public bool HasChanges()
    {
        return context.ChangeTracker.HasChanges();
    }
}
