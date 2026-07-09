using FoodPro.API.Data;
using FoodPro.API.DTOs.Food;
using FoodPro.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodPro.API.Controllers.FoodsController
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodsController(AppDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FoodResponse>>> GetFoods()
        {
            return await context.Foods
                .Select(f => new FoodResponse(f.Id, f.Name, f.Description, f.Price, f.ImageUrl, f.CategoryId, f.CreatedAt))
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FoodResponse>> GetFood(int id)
        {
            var food = await context.Foods.FindAsync(id);

            if(food is null)
            {
                return NotFound(new {message = "Food not found"});
            }

            return Ok(new FoodResponse(food.Id, food.Name, food.Description, food.Price, food.ImageUrl, food.CategoryId, food.CreatedAt));
        }

        [HttpPost]
        public async Task<ActionResult<FoodResponse>> CreateFood(CreateFoodRequest request)
        {
            var categoryExists = await context.Categories.FindAsync(request.CategoryId);

            if(categoryExists is null)
            {
                return NotFound(new {message = "Category not found"});
            }

            var food = new Food
            {
                Name = request.Name,
                Description = request.Description,
                Price = request.Price,
                ImageUrl = request.ImageUrl,
                CategoryId = request.CategoryId
            };

            context.Foods.Add(food);
            await context.SaveChangesAsync();

            var response = new FoodResponse(food.Id, food.Name, food.Description, food.Price, food.ImageUrl, food.CategoryId, food.CreatedAt);
            return CreatedAtAction(nameof(GetFood), new {id = food.Id}, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFood(int id, CreateFoodRequest request)
        {
            var food = await context.Foods.FindAsync(id);

            if(food is null)
            {
                return NotFound(new {message = "Food not found"});
            }

            var categoryExists = await context.Categories.FindAsync(request.CategoryId);
            if(categoryExists is null)
            {
                return NotFound(new {message = "Category not found"});
            }

            food.Name = request.Name;
            food.Description = request.Description;
            food.Price = request.Price;
            food.ImageUrl = request.ImageUrl;
            food.CategoryId = request.CategoryId;

            await context.SaveChangesAsync();

            return Ok(new {id = food.Id, messsage = "Food updated successfully"});
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFood(int id)
        {
            var food = await context.Foods.FindAsync(id);

            if(food is null)
            {
                return NotFound(new {message = "Food not found"});
            }

            context.Foods.Remove(food);
            await context.SaveChangesAsync();

            return Ok(new{id = food.Id, message = "Food deleted successfully"});
        }
    }
}