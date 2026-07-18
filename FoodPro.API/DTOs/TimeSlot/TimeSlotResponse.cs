namespace FoodPro.API.DTOs.TimeSlot
{
    public record TimeSlotResponse(
        int Id,
        TimeOnly StartTime,
        DateTime CreatedAt
    );
}