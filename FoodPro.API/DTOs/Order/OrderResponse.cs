using FoodPro.API.Models;

namespace FoodPro.API.DTOs.Order
{
    public record OrderResponse(
        int Id,
        string TableNo,
        int Pax,
        string Status,
        decimal TotalAmount,
        DateTime CreatedAt,
        List<OrderItemResponse> Items,
        PaymentResponse? Payment
    );

    public record OrderItemResponse(
        string FoodName,
        int Quantity,
        decimal Price,
        decimal Subtotal
    );

    public record PaymentResponse(
        string Method,
        string? ReferenceNo,
        string Status,
        DateTime? PaidAt
    );
}