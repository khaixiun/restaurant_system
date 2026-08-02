using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodPro.API.Models
{
    public enum OrderStatus
    {
        Pending,
        Accepted,
        Completed,
        Cancelled
    }

    public class Order : BaseEntity
    {
        [Required]
        public int TableId { get; set; }

        [ForeignKey("TableId")]
        public Table? Table{ get; set; }

        [Required]
        public OrderStatus Status{ get; set; } = OrderStatus.Pending;

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public int Pax { get; set; }

        public ICollection<OrderItem> OrderItems { get; set; } = [];
        public Payment? Payment { get; set; }
    }
}
