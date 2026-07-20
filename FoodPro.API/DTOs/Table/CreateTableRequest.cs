using System.ComponentModel.DataAnnotations;

namespace FoodPro.API.DTOs.Table
{
    public record CreateTableRequest(
        [Required]
        string TableNo,
        
        [Required]
        int Capacity,

        [Required]
        string Position,

        [Required]
        bool IsReservable,

        string? ImageUrl
    );
}