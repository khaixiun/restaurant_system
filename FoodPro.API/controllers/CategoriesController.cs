using FoodPro.API.Data;
using FoodPro.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FoodPro.API.DTOs.Category;

namespace FoodPro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController(AppDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryResponse>>> GetCategories()
        {
            return await context.Categories
                .Select(c => new CategoryResponse(c.Id, c.Name, c.CreatedAt))
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryResponse>> GetCategory(int id)
        {
            var category = await context.Categories.FindAsync(id);

            if(category is null)
            {
                return NotFound(new{message = "Category not found"});
            }
              
            return Ok(new CategoryResponse(category.Id, category.Name, category.CreatedAt));
        }

        [HttpPost]
        public async Task<ActionResult<CategoryResponse>> CreateCategory(CreateCategoryRequest request)
        {
            var category = new Category{Name = request.Name};

            context.Categories.Add(category);
            await context.SaveChangesAsync();

            var response = new CategoryResponse(category.Id, category.Name, category.CreatedAt);
            return CreatedAtAction(nameof(GetCategory), new {id=category.Id}, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, CreateCategoryRequest request)
        {
            var category = await context.Categories.FindAsync(id);

            if(category is null)
            {
                return NotFound(new {message = "Category not found"});
            }

            if(category.Name == request.Name)
            {
                return BadRequest(new {message = "New name is same as the current name"});
            }

            category.Name = request.Name;

            await context.SaveChangesAsync();

            return Ok(new{ id = category.Id, message = "Category updated successfully"});
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await context.Categories.FindAsync(id);
            
            if(category is null)
            {
                return NotFound(new {message = "Category id not found"});
            }

            context.Categories.Remove(category);
            await context.SaveChangesAsync();

            return Ok(new{id = category.Id, message = "Category deleted successfully"});
        }
    }
}
