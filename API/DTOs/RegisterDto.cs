using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    public string Username {get; set;} = string.Empty;

    [Required]
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")] 
    public string? KnownAs {get; set;}
    [Required] public string? Gender {get; set;}
    [Required]
    public string? DateOfBirth {get; set;}
    [Required]
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? City {get; set;}
    [Required]
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? Country {get; set;}

    [Required]
    [StringLength(50, MinimumLength = 4)]
    public string Password {get; set;} = string.Empty;

    [Required]
    public string? RegistrationKey {get; set;}
    [Required]
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? Email { get; set; }
    [Required]
    public string? ClientURI { get; set; }
}
