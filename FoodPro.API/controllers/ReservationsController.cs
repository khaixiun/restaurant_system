using FoodPro.API.Data;
using FoodPro.API.DTOs.Reservation;
using FoodPro.API.DTOs.Table;
using FoodPro.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodPro.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("/api/[controller]")]
    public class ReservationController(AppDbContext context) : ControllerBase
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservationResponse>>> GetReservations()
        {
            var reservations = await context.Reservations
                .Select(r => new ReservationResponse(
                    r.Id,
                    r.Name,
                    r.TableId,
                    r.Table!.TableNo,
                    r.Table!.Position.ToString(),
                    r.Table!.Capacity,
                    r.TimeSlotId,
                    r.TimeSlot!.StartTime,
                    r.PhoneNo,
                    r.Date,
                    r.Status.ToString(),
                    r.CreatedAt
                ))
                .ToListAsync();

            return Ok(reservations);
        }

        [HttpPost]
        public async Task<ActionResult<ReservationResponse>> CreateReservation (CreateReservationRequest request)
        {
            var table = await context.Tables.FindAsync(request.TableId);
            var timeslot = await context.TimeSlots.FindAsync(request.TimeSlotId);

            if(table is null) 
                return NotFound(new {message = "Table not found"});

            if(timeslot is null) 
                return NotFound(new {message = "TimeSlot not found"});

            var isBooked = await context.Reservations
                .AnyAsync(r => r.TableId == request.TableId
                            && r.Date == request.Date
                            && r.TimeSlotId == request.TimeSlotId
                            && r.Status != ResStatus.Cancelled);

            if (request.Date < DateOnly.FromDateTime(DateTime.Today))
                return BadRequest(new {message = "Reservation date cannot be in the past"});

            if (isBooked)
                return Conflict(new {message = "This table is already reserved for that time slot"});

            var reservation = new Reservation
            {
                Name = request.Name,
                TableId = request.TableId,
                PhoneNo = request.PhoneNo,
                Date = request.Date,
                TimeSlotId = request.TimeSlotId
            };

            context.Reservations.Add(reservation);
            await context.SaveChangesAsync();

            var response = await context.Reservations
                .Where(r => r.Id == reservation.Id)
                .Select(r => new ReservationResponse(
                    r.Id,
                    r.Name,
                    r.TableId,
                    r.Table!.TableNo,
                    r.Table!.Position.ToString(),
                    r.Table!.Capacity,
                    r.TimeSlotId,
                    r.TimeSlot!.StartTime,
                    r.PhoneNo,
                    r.Date,
                    r.Status.ToString(),
                    r.CreatedAt
                ))
                .FirstOrDefaultAsync();
            return CreatedAtAction(nameof(GetReservations), new{id = reservation.Id}, response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReservation(int id, UpdateReservationRequest request)
        {
            var reservation = await context.Reservations.FindAsync(id);
            if(reservation is null)
                return NotFound(new{message = "Reservation not found"});

            var table = await context.Tables.FindAsync(request.TableId);
            if(table is null)
                return NotFound(new {message = "Table not found"});

            var timeslot = await context.TimeSlots.FindAsync(request.TimeSlotId);
            if(timeslot is null)
                return NotFound(new {message = "Time slot not found"});

            var isBooked = await context.Reservations
                .AnyAsync(r => r.Id != id
                        && r.TableId == request.TableId
                        && r.Date == request.Date
                        && r.TimeSlotId == request.TimeSlotId
                        && r.Status != ResStatus.Cancelled);

            if (request.Date < DateOnly.FromDateTime(DateTime.Today))
                return BadRequest(new {message = "Reservation date cannot be in the past"});

            if (isBooked)
                return Conflict(new {message = "This table is already reserved for that time slot"});

            reservation.TableId = request.TableId;
            reservation.Date = request.Date;
            reservation.TimeSlotId = request.TimeSlotId;
            reservation.Status = Enum.Parse<ResStatus>(request.Status, true);

            await context.SaveChangesAsync();

            return Ok(new {id = reservation.Id, message = "Reservation updated successfully"});
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await context.Reservations.FindAsync(id);
            if(reservation is null)
                return NotFound(new{message = "Reservation not found"});

            context.Reservations.Remove(reservation);
            await context.SaveChangesAsync();

            return Ok(new {id = reservation.Id, message = "Reservation deleted successfully"});
        }

        [AllowAnonymous]
        [HttpGet("availability")]
        public async Task<ActionResult<IEnumerable<TableAvailabilityResponse>>> GetAvailability(
            [FromQuery] DateOnly date,
            [FromQuery] int timeSlotId)
        {
            var bookedTableIds = await context.Reservations
                .Where(r => r.Date == date
                        && r.TimeSlotId == timeSlotId
                        && r.Status != ResStatus.Cancelled)
                .Select(r => r.TableId)
                .ToListAsync();

            var tables = await context.Tables
                .Where(t => t.IsReservable)
                .Select(t => new TableAvailabilityResponse(
                    t.Id,
                    t.TableNo,
                    t.Capacity,
                    t.Position.ToString(),
                    t.ImageUrl,
                    !bookedTableIds.Contains(t.Id)
                ))
                .ToListAsync();
            
            return Ok(tables);
        }
    }
}