using FoodPro.API.Data;
using FoodPro.API.DTOs.TimeSlot;
using FoodPro.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodPro.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]

    public class TimeSlotsController(AppDbContext context) : ControllerBase
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TimeSlotResponse>>> GetTimeSlots()
        {
            return await context.TimeSlots
                .Select(ts => new TimeSlotResponse(ts.Id, ts.StartTime, ts.CreatedAt))
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<TimeSlotResponse>> CreateTimeSlot(CreateTimeSlotRequest request)
        {
            var timeslot = new TimeSlot{StartTime = request.StartTime};
            
            context.TimeSlots.Add(timeslot);
            await context.SaveChangesAsync();

            var response = new TimeSlotResponse(timeslot.Id, timeslot.StartTime, timeslot.CreatedAt);
            return CreatedAtAction(nameof(GetTimeSlots), new {id = timeslot.Id}, response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTimeSlot(int id)
        {
            var timeslot = await context.TimeSlots.FindAsync(id);

            if(timeslot is null)
            {
                return NotFound(new {message = "Time slot not found"});
            }

            context.TimeSlots.Remove(timeslot);
            await context.SaveChangesAsync();

            return Ok(new {id = timeslot.Id, message = "Time slot deleted successfully"});
        }
    }
}