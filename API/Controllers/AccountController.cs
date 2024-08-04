using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper, IConfiguration config) : BaseApiController
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
        var results = await userManager.CreateAsync(user, registerDto.Password);

        if(!results.Succeeded) 
            return BadRequest(results.Errors);

        return new UserDto
        {
            Username = user.UserName,
            Token = await tokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender = user.Gender
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
            Gender = user.Gender
        };    
    }
    private async Task<bool> UserExists(string username){
        return await userManager.Users.AnyAsync(x => x.NormalizedUserName == username.ToUpper());
    }
}
