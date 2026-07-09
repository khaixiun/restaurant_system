namespace FoodPro.API.DTOs.Category
{
    public record CategoryResponse(
        int Id,
        string Name,
        DateTime CreatedAt
    );
}