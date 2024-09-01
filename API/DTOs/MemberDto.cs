using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class MemberDto
{
    public int Id { get; set; }
    [StringLength(50, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? Username { get; set; }
    public int Age { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? KnownAs { get; set; }
    public DateTime Created { get; set; }
    public DateTime LastActive { get; set; }
    public required string Gender { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? Introduction { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? Interests { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? LookingFor { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? City { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public  string? Country { get; set; }
    public string? PhotoUrl {get; set;}
    public List<PhotoDto> Photos { get; set; } = [];
}
