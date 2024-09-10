using System;

namespace API.FDC.Models;

public class FDCRequest
{
    public required string Query { get; set; }
    public string[]? DataType { get; set; }
    public int PageSize { get; set; }
    public int PageNumber { get; set; }
    public string? SortBy { get; set; }
    public string? SortOrder { get; set; }
    public string? BrandOwner { get; set; }
    public string[]? TradeChannel { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
}
