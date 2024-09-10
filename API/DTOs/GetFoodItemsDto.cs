using System;

namespace API.DTOs;

public class GetFoodItemsDto
{
    public int FoodItemID { get; set; }
    public int? FdcID { get; set; }
    public string? GtinUpc { get; set; }
    public required string Name { get; set; }
    public required double ServingSize { get; set; }
    public required string ServingSizeUnit { get; set; }
    public required double Protein { get; set; }
    public required string ProteinUnit { get; set; }
    public required double Fat { get; set; }
    public required string FatUnit { get; set; }
    public required double Carb { get; set; }
    public required string CarbUnit { get; set; }
    public required double Energy { get; set; }
    public required string EnergyUnit { get; set; }
    public required double Sugar { get; set; }
    public required string SugarUnit { get; set; }
    public required double Fiber { get; set; }
    public required string FiberUnit { get; set; }

}
