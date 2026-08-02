using System.ComponentModel.DataAnnotations;

namespace FoodPro.API.DTOs.Order
{
    public record UpdateOrderStatusRequest(
        [Required] 
        string Status
    );
}
