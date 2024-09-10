using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : IdentityDbContext<AppUser, AppRole, int, 
IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>,
IdentityUserToken<int>>(options)
{
    public DbSet<UserLike> Likes { get; set; }

    public DbSet<Message> Messages { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<Connection> Connections { get; set; }
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Exercise> Exercises { get; set; }
    public DbSet<AppUserWorkout> AppUserWorkouts { get; set; }
    public DbSet<WorkoutSet> WorkoutSets { get; set; }
    public DbSet<AppUserFoodDiary> AppUserFoodDiaries { get; set; }
    public DbSet<FoodDiaryEntry> FoodDiaryEntries { get; set; }
    public DbSet<FoodItem> FoodItems { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>()
            .HasMany(ur => ur.UserRoles)
            .WithOne(u => u.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired();

         builder.Entity<AppRole>()
            .HasMany(ur => ur.UserRoles)
            .WithOne(u => u.Role)
            .HasForeignKey(ur => ur.RoleId)
            .IsRequired();

        builder.Entity<UserLike>()
            .HasKey(k => new {k.SourceUserId, k.TargetUserId});

        builder.Entity<UserLike>()
            .HasOne(s => s.SourceUser)
            .WithMany(l => l.LikedUsers)
            .HasForeignKey(s => s.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserLike>()
            .HasOne(s => s.TargetUser)
            .WithMany(l => l.LikedByUsers)
            .HasForeignKey(s => s.TargetUserId)
            .OnDelete(DeleteBehavior.NoAction);
        
        builder.Entity<Message>()
            .HasOne(x => x.Recipient)
            .WithMany(x => x.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.Entity<Message>()
            .HasOne(x => x.Sender)
            .WithMany(x => x.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.Entity<Photo>()
            .HasQueryFilter(x => x.IsApproved);


        // Workout Log entities

        builder.Entity<Exercise>()
            .HasKey(e => e.ExerciseID);

        builder.Entity<AppUserWorkout>()
            .HasKey(uw => uw.AppUserWorkoutID);

        builder.Entity<WorkoutSet>()
            .HasKey(we => we.WorkoutSetID);

        // Configuring relationships
        builder.Entity<AppUserWorkout>()
            .HasOne(uw => uw.AppUser)
            .WithMany(u => u.AppUserWorkouts)
            .HasForeignKey(uw => uw.UserID);

        builder.Entity<WorkoutSet>()
            .HasOne(we => we.AppUserWorkout)
            .WithMany(uw => uw.WorkoutSet)
            .HasForeignKey(we => we.AppUserWorkoutID);

        builder.Entity<WorkoutSet>()
            .HasOne(we => we.Exercise)
            .WithMany(e => e.WorkoutSet)
            .HasForeignKey(we => we.ExerciseID);

        // Other configurations
        builder.Entity<WorkoutSet>()
            .Property(we => we.WeightPerRepetition)
            .HasColumnType("decimal(5,2)");

        // food diary entities
        builder.Entity<FoodItem>()
            .HasKey(fi => fi.FoodItemID);
        builder.Entity<AppUserFoodDiary>()
            .HasKey(fd => fd.AppUserFoodDiaryID);
        builder.Entity<FoodDiaryEntry>()
            .HasKey(fde => fde.FoodDiaryEntryID);
        // food diary relationships
        builder.Entity<AppUserFoodDiary>()
            .HasOne(uw => uw.AppUser)
            .WithMany(u => u.AppUserFoodDiaries)
            .HasForeignKey(u => u.UserID);
        builder.Entity<FoodDiaryEntry>()
            .HasOne(ufde => ufde.AppUserFoodDiary)
            .WithMany(f => f.FoodDiaryEntries)
            .HasForeignKey(fd => fd.AppUserFoodDiaryID);
        builder.Entity<FoodDiaryEntry>()
            .HasOne(f => f.FoodItem)
            .WithMany(fde => fde.FoodDiaryEntries)
            .HasForeignKey(f => f.FoodItemID);
    }
}
