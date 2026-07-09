using System.ComponentModel.DataAnnotations;

namespace FoodPro.API.Models
{
    public class Category : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        public ICollection<Food> Foods { get; set; } = new List<Food>();
    }
}