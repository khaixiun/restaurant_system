using System.ComponentModel.DataAnnotations;

namespace FoodPro.API.Models
{
    public enum TablePosition
    {
        Indoor,
        Window,
        Outdoor,
        Barside,
        VIP,
        Terrace
    }
    public class Table : BaseEntity
    {
        [Required]
        public string TableNo { get; set; } = string.Empty;

        [Required]
        public int Capacity { get; set; }

        [Required]
        public TablePosition Position { get; set; }

        [Required]
        public bool IsReservable { get; set;}

        public ICollection<Reservation> Reservations { get; set; } = [];

    }
}