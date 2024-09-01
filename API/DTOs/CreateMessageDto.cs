using System.ComponentModel.DataAnnotations;

namespace API;

public class CreateMessageDto
{
    public required string RecipientUsername { get; set; }
    [StringLength(200, ErrorMessage = "The {0} cannot exceed {1} characters.")]
    public required string Content { get; set; }
}
