using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ChangeEmailDto
{
    [Required]
    public string? Username {get; set;}
    [Required]
    public string? NewEmail { get; set; }
    [Required]
    public string? ClientURI { get; set; }
}
