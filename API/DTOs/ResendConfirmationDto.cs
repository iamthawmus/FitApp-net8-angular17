using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ResendConfirmationDto
{
    [Required]
    public string? Username {get; set;}
    [Required]
    public string? ClientURI { get; set; }
}
