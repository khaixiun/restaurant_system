using System.ComponentModel.DataAnnotations;

namespace FoodPro.API.DTOs.Category
{
    public record CreateCategoryRequest(
        [Required]
        [MaxLength(100)]
        string Name
    );
}