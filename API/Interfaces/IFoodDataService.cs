using System;
using API.DTOs;
using API.FDC.Models;

namespace API.Interfaces;

public interface IFoodDataService
{
    public Task<SearchResult> SearchFood(SearchFoodRequestDto searchFoodRequestDto);
}
