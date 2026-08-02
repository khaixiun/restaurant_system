using System.ComponentModel.DataAnnotations;
using FoodPro.API.Models;

namespace FoodPro.API.DTOs.Order
{
    public record CreateOrderRequest(
        [Required]
        string TableNo,

        [Required]
        int Pax,

        [Required]
        PaymentMethod PaymentMethod,

        [Required]
        List<OrderItemRequest> Items
    );

    public record OrderItemRequest(
        [Required]
        int FoodId,

        [Required]
        int Quantity
    );
}