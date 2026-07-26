using FoodPro.API.Data;
using FoodPro.API.DTOs.Table;
using FoodPro.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodPro.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]

    public class TableController(AppDbContext context) : ControllerBase
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TableResponse>>> GetTables()
        {
            return await context.Tables
                .Select(t => new TableResponse(t.Id, t.TableNo, t.Capacity, t.Position.ToString(), t.IsReservable, t.ImageUrl, t.CreatedAt))
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<TableResponse>> CreatetTable(CreateTableRequest request)
        {
            var table = new Table
            {
                TableNo = request.TableNo, 
                Capacity = request.Capacity, 
                Position = Enum.Parse<TablePosition>(request.Position, true), 
                IsReservable = request.IsReservable,
                ImageUrl = request.ImageUrl
            };

            context.Tables.Add(table);
            await context.SaveChangesAsync();

            var response = new TableResponse(table.Id, table.TableNo, table.Capacity, table.Position.ToString(), table.IsReservable, table.ImageUrl, table.CreatedAt);
            return CreatedAtAction(nameof(GetTables), response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTable(int id, CreateTableRequest request)
        {
            var table = await context.Tables.FindAsync(id);

            if(table is null)
            {
                return NotFound(new {message = "Table not found"});
            }

            if (!Enum.TryParse<TablePosition>(request.Position, true, out var newPosition))
            {
                return BadRequest(new
                {
                    message = "Invalid table position."
                });
            }

            if (table.TableNo == request.TableNo &&
                table.Capacity == request.Capacity &&
                table.Position == newPosition &&
                table.IsReservable == request.IsReservable &&
                table.ImageUrl == request.ImageUrl)
            {
                return BadRequest(new
                {
                    message = "New update table is same with old table"
                });
            }

            table.TableNo = request.TableNo;
            table.Capacity = request.Capacity;
            table.Position = newPosition;
            table.IsReservable = request.IsReservable;
            table.ImageUrl = request.ImageUrl;

            await context.SaveChangesAsync();

            return Ok(new{id = table.Id, message = "Table update successfully"});
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTable(int id)
        {
            var table = await context.Tables.FindAsync(id);

            if(table is null)
            {
                return NotFound(new {message = "Table not found"});
            }

            context.Tables.Remove(table);
            await context.SaveChangesAsync();

            return Ok(new {message = "Table delete successfully"});

        }
    }
}