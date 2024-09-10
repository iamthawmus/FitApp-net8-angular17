using System;
using API.DTOs;
using API.FDC.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.FDC;

public interface IFDCClient
{
    Task<SearchResult> SearchFood(SearchFoodRequestDto searchFoodRequestDto);
}
