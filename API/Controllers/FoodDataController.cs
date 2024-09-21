using API.DTOs;
using API.FDC.Models;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoodDataController(IFoodDataService foodDataService, IMapper mapper) : ControllerBase
    {
        [HttpPost("search-food")]
        public async Task<ActionResult> SearchFood(SearchFoodRequestDto searchFoodRequestDto){
            if(searchFoodRequestDto == null)
                return BadRequest("Missing Query");
            SearchResult results = await foodDataService.SearchFood(searchFoodRequestDto);
            List<SearchFoodDto> searchFoods = [];
            if(results.foods != null)
            {
                List<Food> foodList = results.foods;
                foreach(var food in foodList)
                {
                    SearchFoodDto searchFood = mapper.Map<SearchFoodDto>(food);
                    searchFoods.Add(searchFood);
                }
            }
            return Ok(searchFoods);
        }
    }
}
