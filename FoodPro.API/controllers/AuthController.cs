using FoodPro.API.Data;
using FoodPro.API.DTOs.Auth;
using FoodPro.API.Models;
using FoodPro.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodPro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(AppDbContext context, TokenService tokenService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterRequest request)
        {
            var existingUser = await context.Users.AnyAsync(u => u.Email == request.Email);
            if (existingUser)
                return Conflict(new { message = "Email already registered" });

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password" });

            var token = tokenService.GenerateToken(user);

            return Ok(new AuthResponse(
                user.Id,
                user.Name,
                user.Role.ToString(),
                token
            ));
        }
    }
}