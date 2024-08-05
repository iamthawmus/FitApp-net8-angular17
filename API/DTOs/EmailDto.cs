using System.ComponentModel.DataAnnotations;

namespace API.Dto;

public class EmailDto
{
    [Required]
    public string? Email { get; set; }
    [Required]
    public string? Subject { get; set;}
    [Required]
    public string? Message { get; set; }
}
