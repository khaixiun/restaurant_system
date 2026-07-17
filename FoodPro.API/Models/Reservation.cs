using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodPro.API.Models
{
    public enum ResStatus
    {
        Reserved,
        Cancelled,
        Completed
    }
    public class Reservation : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public int TableId { get; set; }

        [ForeignKey("TableId")]
        public Table? Table { get; set; }

        [Required]
        [MaxLength(20)]
        public string PhoneNo { get; set; } = string.Empty;

        [Required]
        public DateOnly Date { get; set; }

        [Required]
        public int TimeSlotId { get; set; }
        
        [ForeignKey("TimeSlotId")]
        public TimeSlot? TimeSlot{ get; set; }

        public ResStatus Status{ get; set; } = ResStatus.Reserved;

    }
}