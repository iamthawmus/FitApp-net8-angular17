using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class FoodItemDto
{
    [Required]
    public int FdcID { get; set; }
    [StringLength(50, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? GtinUpc { get; set; }
    [Required]
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public required string Name { get; set; }
    public required double ServingSize { get; set; }
    [StringLength(25, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public required string ServingSizeUnit { get; set; }
    public required double Protein { get; set; }
    [StringLength(25, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public required string ProteinUnit { get; set; }
    public required double Fat { get; set; }
    [StringLength(25, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public required string FatUnit { get; set; }
    public required double Carb { get; set; }
    [StringLength(25, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public required string CarbUnit { get; set; }
    public required double Energy { get; set; }
    [StringLength(25, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public required string EnergyUnit { get; set; }
    public required double Sugar { get; set; }
    [StringLength(25, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public required string SugarUnit { get; set; }
    public required double Fiber { get; set; }
    [StringLength(25, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public required string FiberUnit { get; set; }
}
