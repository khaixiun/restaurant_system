namespace FoodPro.API.DTOs.Table
{
    public record TableResponse(
        int Id,
        string TableNo,
        int Capacity,
        string Position,
        bool IsReservable,
        DateTime CreatedAt
    );
}