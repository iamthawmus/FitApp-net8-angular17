using System;
using API.DTOs;
using API.FDC;
using API.FDC.Models;
using API.Interfaces;

namespace API.Services;

public class FoodDataService(IFDCClient fDCClient) : IFoodDataService
{
    private readonly IFDCClient _fdcClient = fDCClient;

    public async Task<SearchResult> SearchFood(SearchFoodRequestDto searchFoodRequestDto)
    {
        return await _fdcClient.SearchFood(searchFoodRequestDto);
    }
}
