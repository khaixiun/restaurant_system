using System.ComponentModel.DataAnnotations;

namespace FoodPro.API.DTOs.Food
{
    public record CreateFoodRequest(
        [Required]
        [MaxLength(150)]
        string Name,

        [MaxLength(500)]
        string? Description,

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage ="Price must be greater than 0")]
        decimal Price,

        string? ImageUrl,
        
        [Required]
        int CategoryId
    );
}