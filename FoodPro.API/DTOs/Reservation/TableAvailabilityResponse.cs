namespace FoodPro.API.DTOs.Table
{
    public record TableAvailabilityResponse(
    int TableId,
    string TableNo,
    int Capacity,
    string Position,
    string? ImageUrl,
    bool IsAvailable
);
}
