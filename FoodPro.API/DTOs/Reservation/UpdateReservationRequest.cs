using System.ComponentModel.DataAnnotations;

namespace FoodPro.API.DTOs.Reservation
{
    public record UpdateReservationRequest(
        [Required]
        int TableId,        
        [Required]
        DateOnly Date,
        [Required]
        int TimeSlotId,
        [Required]
        string Status
    );
}