using API.Data;

namespace API.Interfaces;

public interface IUnitOfWork
{
    IUserRepository UserRepository { get; }
    IMessageRepository MessageRepository { get; }
    ILikesRepository LikesRepository { get; }
    IPhotoRepository PhotoRepository { get; }
    IExerciseRepository ExerciseRepository { get; }
    IWorkoutSetRepository WorkoutSetRepository { get; }
    IAppUserWorkoutRepository AppUserWorkoutRepository { get; }
    IFoodItemRepository FoodItemRepository { get; }
    IFoodDiaryEntryRepository FoodDiaryEntryRepository { get; }
    IAppUserFoodDiaryRepository AppUserFoodDiaryRepository { get; }
    Task<bool> Complete();
    bool HasChanges();
}
