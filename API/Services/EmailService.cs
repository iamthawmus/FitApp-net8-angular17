using API.Resend;
using API.Resend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace API.Services;

public class EmailService(IResendClient resend) : IEmailService
{
     private readonly IResendClient _resend = resend;

    public async Task<ResendResponse<Guid>> SendEmailAsync(string email, string subject, string htmlMessage)
    {
        var message = new EmailMessage();
        message.From = "DoNotReply@the-fit-app.com";
        message.To.Add(email);
        message.Subject = "Hello from TheFitApp! " + subject ;
        message.HtmlBody = "<div> 👋🏻 " + htmlMessage +"</div>";

       var response = await _resend.EmailSendAsync( message );

       return response;
    }
}
