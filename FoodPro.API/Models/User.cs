using System.ComponentModel.DataAnnotations;

namespace FoodPro.API.Models
{
    public enum UserRole
    {
        User,
        Admin
    }

    public class User : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        public UserRole Role { get; set; } = UserRole.User;
    }
}