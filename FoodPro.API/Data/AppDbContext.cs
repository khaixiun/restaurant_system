using FoodPro.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodPro.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Food> Foods { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Food>()
                .HasOne(f => f.Category)
                .WithMany(c => c.Foods)
                .HasForeignKey(f => f.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Category>().HasQueryFilter(c => c.DeletedAt == null);
            modelBuilder.Entity<Food>().HasQueryFilter(f => f.DeletedAt == null);
            modelBuilder.Entity<User>().HasQueryFilter(u => u.DeletedAt == null);

            foreach (var entity in modelBuilder.Model.GetEntityTypes())
            {
                var tableName = entity.GetTableName();
                if (tableName != null)
                {
                    entity.SetTableName(ConvertToSnakeCase(tableName));
                }

                foreach (var property in entity.GetProperties())
                {
                    property.SetColumnName(ConvertToSnakeCase(property.Name));
                }
            }
        }

        private string ConvertToSnakeCase(string input)
        {
            if (string.IsNullOrEmpty(input)) return input;

            return string.Concat(input.Select((x, i) => i > 0 && char.IsUpper(x) ? "_" + x.ToString() : x.ToString()))
                         .ToLower();
        }

        public override int SaveChanges()
        {
            ApplyAuditInfo();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyAuditInfo();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void ApplyAuditInfo()
        {
            var entries = ChangeTracker.Entries<BaseEntity>()
                .Where(e => e.State == EntityState.Added ||
                            e.State == EntityState.Modified || 
                            e.State == EntityState.Deleted);

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                }

                if (entry.State == EntityState.Modified)
                    entry.Entity.UpdatedAt = DateTime.UtcNow;

                if (entry.State == EntityState.Deleted)
                {
                    entry.State = EntityState.Modified;
                    entry.Entity.DeletedAt = DateTime.UtcNow;
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                }
            }
        }
    }
}