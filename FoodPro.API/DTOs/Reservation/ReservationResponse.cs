namespace FoodPro.API.DTOs.Reservation
{
    public record ReservationResponse(
        int Id,
        string Name,
        int TableId,
        string TableNo,
        string Position,
        int Capacity,
        int TimeSlotId,
        TimeOnly StartTime,
        string PhoneNo,
        DateOnly Date,
        string Status,
        DateTime CreatedAt
    );
}