using API.Dto;
using Microsoft.AspNetCore.Mvc;
using API.Resend.Models;

namespace API.Controllers;


[ApiController]
[Route("api/[controller]")]
public class EmailController(IEmailService emailService) :  ControllerBase
{
    [HttpPost("send-email")]
    public async Task<ActionResult> SendEmail(EmailDto emailDto)
    {
        if(emailDto == null || emailDto.Email == null 
            || emailDto.Subject == null || emailDto.Message == null) return BadRequest("Send Email request missing parameters");

        return Ok(await emailService.SendEmailAsync(emailDto.Email, emailDto.Subject, emailDto.Message));
    }
}
