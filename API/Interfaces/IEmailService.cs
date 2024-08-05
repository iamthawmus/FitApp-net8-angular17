using API.Resend.Models;

namespace API;

public interface IEmailService
{
    Task<ResendResponse<Guid>> SendEmailAsync(string email, string subject, string htmlMessage);
}
