namespace FoodPro.API.DTOs.Auth
{
    public record AuthResponse(
        int Id,
        string Name,
        string Role,
        string Token
    );
}