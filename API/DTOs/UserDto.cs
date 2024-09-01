using System.ComponentModel.DataAnnotations;

namespace API;

public class UserDto
{
    [StringLength(50, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public required string Username {get; set;}
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public required string KnownAs { get; set; }
    public required string Token {get; set;}
    public required string Gender { get; set; }
    public string? PhotoUrl { get; set; }
    public bool EmailConfirmed { get; set; }
    public string? Email {get; set;}
}
