using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class LoginDto
{
    [Required]
    [StringLength(50, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public required string Username {get; set;}
    [Required]
    public required string Password {get; set;}
}
