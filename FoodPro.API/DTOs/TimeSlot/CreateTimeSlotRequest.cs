using System.ComponentModel.DataAnnotations;

namespace FoodPro.API.DTOs.TimeSlot
{
    public record CreateTimeSlotRequest(
        [Required]
        TimeOnly StartTime
    );
}