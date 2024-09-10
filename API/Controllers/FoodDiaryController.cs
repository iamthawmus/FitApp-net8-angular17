using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class FoodDiaryController(IUnitOfWork unitOfWork, IMapper mapper) : BaseApiController
    {
        [HttpPost("create-food-diary")]
        public async Task<ActionResult<AppUserFoodDiary>> CreateAppUserFoodDiary(AppUserFoodDiaryDto appUserFoodDiaryDto)
        {
            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            if (user == null)
                return BadRequest("Cannot find user");

            var userFoodDiary = await unitOfWork.AppUserFoodDiaryRepository.GetAppUserFoodDiaryByDate(user.Id, appUserFoodDiaryDto.FoodDiaryDate);
            if (userFoodDiary != null)
                return BadRequest("Food Diary has already been created for this date.");

            var foodDiary = new AppUserFoodDiary
            {
                FoodDiaryDate = appUserFoodDiaryDto.FoodDiaryDate,
                UserID = user.Id
            };

            unitOfWork.AppUserFoodDiaryRepository.AddAppUserFoodDiary(foodDiary);

            if (await unitOfWork.Complete()) return Ok(new { foodDiary.AppUserFoodDiaryID });

            return BadRequest("Failed to create new user food diary");
        }

        [HttpPost("create-food-item")]
        public async Task<ActionResult<FoodItem>> CreateFoodItem(FoodItemDto foodItemDto)
        {
            if (String.IsNullOrEmpty(foodItemDto.Name))
                return BadRequest("Food Item Name cannot be empty");

            var checkForDupes = await unitOfWork.FoodItemRepository.GetFoodItemByFdcId(foodItemDto.FdcID);
            if (checkForDupes != null)
                return Ok(new { checkForDupes.FoodItemID });

            var newFoodItem = new FoodItem
            {
                Name = foodItemDto.Name,
                FdcID = foodItemDto.FdcID,
                GtinUpc = foodItemDto.GtinUpc,
                ServingSize = foodItemDto.ServingSize,
                ServingSizeUnit = foodItemDto.ServingSizeUnit,
                Protein = foodItemDto.Protein,
                ProteinUnit = foodItemDto.ProteinUnit,
                Fat = foodItemDto.Fat,
                FatUnit = foodItemDto.FatUnit,
                Carb = foodItemDto.Carb,
                CarbUnit = foodItemDto.CarbUnit,
                Sugar = foodItemDto.Sugar,
                SugarUnit = foodItemDto.SugarUnit,
                Fiber = foodItemDto.Fiber,
                FiberUnit = foodItemDto.FiberUnit,
                Energy = foodItemDto.Energy,
                EnergyUnit = foodItemDto.EnergyUnit
            };

            unitOfWork.FoodItemRepository.AddFoodItem(newFoodItem);

            if (await unitOfWork.Complete()) return Ok(new { newFoodItem.FoodItemID });

            return BadRequest("Failed to create new Food Item");
        }

        [HttpPost("create-food-diary-entry")]
        public async Task<ActionResult<FoodDiaryEntry>> CreateFoodDiaryEntry(FoodDiaryEntryDto foodDiaryEntryDto)
        {
            var appUserFoodDiary = await unitOfWork.AppUserFoodDiaryRepository.GetAppUserFoodDiaryById(foodDiaryEntryDto.AppUserFoodDiaryID);
            if (appUserFoodDiary == null)
                return BadRequest("Failed to find user food diary");

            var foodItem = await unitOfWork.FoodItemRepository.GetFoodItemById(foodDiaryEntryDto.FoodItemID);
            if (foodItem == null)
                return BadRequest("Failed to find Food Item");

            var newFoodDiaryEntry = new FoodDiaryEntry
            {
                FoodItem = foodItem,
                AppUserFoodDiary = appUserFoodDiary,
                FoodItemID = foodDiaryEntryDto.FoodItemID,
                AppUserFoodDiaryID = foodDiaryEntryDto.AppUserFoodDiaryID,
                NumberOfServings = foodDiaryEntryDto.NumberOfServings,
                ServingType = foodDiaryEntryDto.ServingType,
                Meal = foodDiaryEntryDto.Meal
            };

            unitOfWork.FoodDiaryEntryRepository.AddFoodDiaryEntry(newFoodDiaryEntry);

            if (await unitOfWork.Complete()) return Ok(new { newFoodDiaryEntry.FoodDiaryEntryID });

            return BadRequest("Failed to create new Food Diary Entry");
        }

        [HttpDelete("delete-food-diary-entry/{id}")]
        public async Task<ActionResult> DeleteFoodDiaryEntry(int id)
        {
            var foodDiaryEntry = await unitOfWork.FoodDiaryEntryRepository.GetFoodDiaryEntryById(id);
            if (foodDiaryEntry == null)
                return BadRequest("Cannot find Food Diary Entry");

            var username = User.GetUsername();
            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            if (user == null)
                return BadRequest("Cannot find user");

            if (user != foodDiaryEntry.AppUserFoodDiary.AppUser)
                return BadRequest("User did not match Food Diary's User");

            unitOfWork.FoodDiaryEntryRepository.DeleteFoodDiaryEntry(foodDiaryEntry);

            if (await unitOfWork.Complete()) return Ok(new { message = "Successfully deleted Food Diary Entry." });

            return BadRequest("Problem deleting the Food Diary Entry");

        }

        [HttpPut("update-food-diary-entry/{id}")]
        public async Task<ActionResult> UpdateFoodDiaryEntry([FromRoute] int id, [FromBody] UpdateFoodDiaryEntryDto updateFoodDiaryEntryDto)
        {
            var username = User.GetUsername();
            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            if(user == null)
                return BadRequest("Cannot find user");
            
            var foodDiaryEntry = await unitOfWork.FoodDiaryEntryRepository.GetFoodDiaryEntryById(id);
            if(foodDiaryEntry == null)
                return BadRequest("Cannot find Food Diary Entry");

            if(user != foodDiaryEntry.AppUserFoodDiary.AppUser)
                return BadRequest("User did not match Food Diary's User"); 

            mapper.Map(updateFoodDiaryEntryDto, foodDiaryEntry);

        if(await unitOfWork.Complete()) return Ok(new { foodDiaryEntry.FoodDiaryEntryID });

            return BadRequest("Problem updating the Food Diary Entry set");
        }

        [HttpGet("get-user-food-diary")]
        public async Task<ActionResult<GetAppUserFoodDiaryDto?>> GetAppUserFoodDiary(string username, string foodDiaryDate)
        {
            if (String.IsNullOrEmpty(username))
                return BadRequest("Missing Username");
            if (String.IsNullOrEmpty(foodDiaryDate))
                return BadRequest("Missing Date");

            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);

            if (user == null)
                return BadRequest("Cannot find user");

            var foodDiary = await unitOfWork.AppUserFoodDiaryRepository.GetAppUserFoodDiaryByDate(user.Id, DateOnly.Parse(foodDiaryDate));

            if (foodDiary == null)
                return BadRequest("Could not find Food Diary");

            var entries = await unitOfWork.FoodDiaryEntryRepository.GetFoodDiaryEntriesById(foodDiary.AppUserFoodDiaryID);
            var entryListDto = mapper.Map<GetAppUserFoodDiaryEntryDto[]>(entries.ToList());
            var res = mapper.Map<GetAppUserFoodDiaryDto>(foodDiary);
            res.FoodDiaryEntries = entryListDto;

            return Ok(res);
        }

        [HttpGet("get-food-items")]
        public async Task<ActionResult<IEnumerable<GetFoodItemsDto>>> GetFoodItems()
        {
            var res = mapper.Map<GetFoodItemsDto[]>(await unitOfWork.FoodItemRepository.GetFoodItems());
            return Ok(res);
        }

        [HttpGet("get-food-with-fdcid/{id}")]
        public async Task<ActionResult<GetFoodItemsDto?>> GetFoodWithFdcId(int id)
        {
            var foodItem = await unitOfWork.FoodItemRepository.GetFoodItemByFdcId(id);
            if(foodItem == null){
                return NotFound();
            }
            var res = mapper.Map<GetFoodItemsDto>(foodItem);
            return Ok(res);
        }
    }
}
