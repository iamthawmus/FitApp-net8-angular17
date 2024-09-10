using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace API.DTOs;

public class SearchFoodRequestDto
{
    [Required]
    public string? Query { get; set; }
}
