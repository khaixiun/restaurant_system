using System;

namespace FoodPro.API.Models
{
    public abstract class BaseEntity
    {
        public int Id {get; set;}
        private static DateTime LocalNow =>
        TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow,
            TimeZoneInfo.FindSystemTimeZoneById("Asia/Kuala_Lumpur"));
        public DateTime CreatedAt { get; set; } = LocalNow;
        public DateTime UpdatedAt { get; set; } = LocalNow;
        public DateTime? DeletedAt { get; set; }
    }
}