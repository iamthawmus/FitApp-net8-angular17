using System;

namespace API.FDC.Models;

public class FDCClientOptions
{
    public string ApiUrl { get; set; } = "https://api.nal.usda.gov/fdc/v1/";

    public bool ThrowExceptions { get; set; } = true;
}
