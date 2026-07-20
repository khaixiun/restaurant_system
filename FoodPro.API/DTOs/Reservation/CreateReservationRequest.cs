using System.ComponentModel.DataAnnotations;

namespace FoodPro.API.DTOs.Reservation
{
    public record CreateReservationRequest(
        [Required]
        [MaxLength(100)]
        string Name,

        [Required]
        int TableId,

        [Required]
        [MaxLength(20)]
        string PhoneNo,

        [Required]
        DateOnly Date,

        [Required]
        int TimeSlotId
    );
}