using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodPro.API.Models
{
    public class OrderItem : BaseEntity
    {
        [Required]
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public Order? Order{ get; set; }

        [Required]
        public int FoodId { get; set; }

        [ForeignKey("FoodId")]
        public Food? Food{ get; set; }

        [Required]
        public string FoodName { get; set; } = string.Empty;

        [Required]
        public decimal Price { get; set; }

        [Required]
        public int Quantity { get; set; }

    }
}