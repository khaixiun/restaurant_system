using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FoodPro.API.Models
{
    public enum PaymentMethod
    {
        CreditCard,
        FPX,
        Cash
    }

    public enum PaymentStatus
    {
        Pending,
        Success,
        Failed
    }

    public class Payment : BaseEntity
    {
        [Required]
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public Order? Order{ get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public PaymentMethod Method { get; set; }

        [Required]
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        public string? ReferenceNo { get; set; }

        public DateTime? PaidAt { get; set; }
    }
}