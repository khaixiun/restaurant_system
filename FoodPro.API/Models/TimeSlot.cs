using System.ComponentModel.DataAnnotations;

namespace FoodPro.API.Models
{
    public class TimeSlot : BaseEntity
    {
        [Required]
        public TimeOnly StartTime { get; set;}
        
        public ICollection<Reservation> Reservations { get; set; } = [];
    }
}