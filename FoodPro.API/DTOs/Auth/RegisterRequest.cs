using System.ComponentModel.DataAnnotations;

namespace FoodPro.API.DTOs.Auth
{
    public record RegisterRequest(
        [Required] 
        string Name,

        [Required]
        [EmailAddress] 
        string Email,
        
        [Required]
        [MinLength(8)] 
        string Password
    );
}