using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ChangeEmailDto
{
    [Required]
    public string? Username {get; set;}
    [Required]
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? NewEmail { get; set; }
    [Required]
    public string? ClientURI { get; set; }
}
