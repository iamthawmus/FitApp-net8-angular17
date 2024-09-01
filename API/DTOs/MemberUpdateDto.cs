using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class MemberUpdateDto
{
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? Introduction { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? LookingFor { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? Interests { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? City { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public string? Country { get; set; }
}
