namespace FoodPro.API.DTOs.Food
{
    public record FoodResponse(
        int Id,
        string Name,
        string? Description,
        decimal Price,
        string? ImageUrl,
        int CategoryId,
        DateTime CreatedAt
    );
}