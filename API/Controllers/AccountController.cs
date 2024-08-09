using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService, 
    IMapper mapper, IConfiguration config, IEmailService emailService, IUnitOfWork unitOfWork) : BaseApiController
{
    [HttpPost("register")] // account/register
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        var registrationKey = config["RegistrationKey"];
        var formatKey = config["FormatKey"];
        if(string.IsNullOrEmpty(registrationKey) || string.IsNullOrEmpty(formatKey)) return StatusCode(500, "Registration is disabled");

        var date = DateTime.Now.ToString(formatKey);
        var key = registrationKey + date;
        
        if(registerDto.RegistrationKey != key) return BadRequest("RegistrationKey is Incorrect");

        if(await UserExists(registerDto.Username)) return BadRequest("Username is taken.");

        var user = mapper.Map<AppUser>(registerDto);
        user.UserName = registerDto.Username.ToLower();

        if(String.IsNullOrEmpty(user.Email)) return BadRequest("Email cannot be empty.");
        if(String.IsNullOrEmpty(registerDto.ClientURI)) return BadRequest("ClientURI is null");

        var results = await userManager.CreateAsync(user, registerDto.Password);

        if(!results.Succeeded) 
            return BadRequest(results.Errors);

        var emailVerification = config["EmailVerification"];
        if(!String.IsNullOrEmpty(emailVerification) && emailVerification == "Enabled")
            {
                 try{
                    var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
                    var param = new Dictionary<string, string?>
                    {
                        {"token", token },
                        {"userId", user.Id.ToString() }
                    };  
                    var callbackUrl = QueryHelpers.AddQueryString(registerDto.ClientURI, param);
              
                    var response = await emailService.SendEmailAsync(user.Email, 
                            "Confirm your account " + user.UserName, 
                            "Please confirm your account by clicking this link: <a href=\"" 
                                                            + callbackUrl + "\">link</a>");
                }
                catch(Exception ex){
                    System.Diagnostics.Trace.TraceError(ex.ToString());
                    await userManager.DeleteAsync(user);
                    return BadRequest("Email Confirmation Service failed!");
                }

        }

        return new UserDto
        {
            Username = user.UserName,
            Token = await tokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender = user.Gender,
            EmailConfirmed = user.EmailConfirmed
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await userManager.Users
            .Include(p => p.Photos) // Need to include this or else EntityFramework will not get related properties
            .FirstOrDefaultAsync(x => 
            x.NormalizedUserName == loginDto.Username.ToUpper());

        if(user == null || user.UserName == null) return Unauthorized("Invalid username");

        var isCorrectCredentials = await userManager.CheckPasswordAsync(user, loginDto.Password);

        if(!isCorrectCredentials) return Unauthorized("Invalid username or password");

        if(user.UserRoles.Count == 0){
            var result = await userManager.AddToRolesAsync(user, ["Member"]);
        }
        
        return new UserDto
        {
            Username = user.UserName,
            Token = await tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            KnownAs = user.KnownAs,
            Gender = user.Gender,
            EmailConfirmed = user.EmailConfirmed
        };    
    }
    private async Task<bool> UserExists(string username){
        return await userManager.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper());
    }

    [HttpGet("ConfirmEmail")]
    [AllowAnonymous]
    public async Task<ActionResult> ConfirmEmail(int userId, string token)
    {
        if (token == null)
        {
            return BadRequest("Error confirming email address");
        }
        var user = await unitOfWork.UserRepository.GetUserByIdAsync(userId);
        if(user == null)
        {
            return BadRequest("Error finding user");
        }
        var result = await userManager.ConfirmEmailAsync(user, token);
        if (result.Succeeded)
        {
            return Ok();
        }
        
        return BadRequest("Could not confirm email address");
    }
}
