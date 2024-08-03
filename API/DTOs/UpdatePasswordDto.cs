using System.ComponentModel.DataAnnotations;

namespace API.Dto;

public class UpdatePasswordDto
{
    [Required]
    public string Username {get; set;} = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 4)]
    public string OldPassword {get; set;} = string.Empty;

    [Required]
    [StringLength(50, MinimumLength = 4)]
    public string NewPassword {get; set;} = string.Empty;
}
