using FoodPro.API.Data;
using FoodPro.API.DTOs.Order;
using FoodPro.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodPro.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController(AppDbContext context) : ControllerBase
    {
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<OrderResponse>> CreateOrder(CreateOrderRequest request)
        {
            // Validate table exists
            var table = await context.Tables
                .FirstOrDefaultAsync(t => t.TableNo == request.TableNo);
            
            if (table == null)
                return NotFound("Table not found.");

            // Fetch all foods in one query
            var foodIds = request.Items.Select(i => i.FoodId).ToList();
            var foods = await context.Foods
                .Where(f => foodIds.Contains(f.Id))
                .ToListAsync();

            if (foods.Count != foodIds.Count)
                return BadRequest("One or more food items not found.");

            // Build the order items
            var orderItems = request.Items.Select(i =>
            {
                var food = foods.First(f => f.Id == i.FoodId);
                return new OrderItem
                {
                    FoodId = i.FoodId,
                    FoodName = food.Name,
                    Price = food.Price,
                    Quantity = i.Quantity
                };
            }).ToList();

            var totalAmount = orderItems.Sum(i => i.Price * i.Quantity);

            // Create order + payment in transaction
            await using var transaction = await context.Database.BeginTransactionAsync();
            try
            {
                var order = new Order
                {
                    TableId = table.Id,
                    Pax = request.Pax,
                    Status = OrderStatus.Pending,
                    TotalAmount = totalAmount,
                    OrderItems = orderItems
                };

                context.Orders.Add(order);
                await context.SaveChangesAsync();

                var payment = new Payment
                {
                    OrderId = order.Id,
                    Amount = totalAmount,
                    Method = request.PaymentMethod,
                    Status = PaymentStatus.Pending
                };

                context.Payments.Add(payment);
                await context.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new OrderResponse(
                    order.Id,
                    table.TableNo,
                    order.Pax,
                    order.Status.ToString(),
                    order.TotalAmount,
                    order.CreatedAt,
                    [.. orderItems.Select(i => new OrderItemResponse(
                        i.FoodName,
                        i.Quantity,
                        i.Price,
                        i.Price * i.Quantity
                    ))],
                    new PaymentResponse(
                        payment.Method.ToString(),
                        payment.ReferenceNo,
                        payment.Status.ToString(),
                        payment.PaidAt
                    )
                ));
            }
            catch
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Failed to create order.");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderResponse>>> GetOrders()
        {
            var orders = await context.Orders
                .Select(o => new OrderResponse(
                    o.Id,
                    o.Table!.TableNo,
                    o.Pax,
                    o.Status.ToString(),
                    o.TotalAmount,
                    o.CreatedAt,
                    o.OrderItems.Select(i => new OrderItemResponse(
                        i.FoodName,
                        i.Quantity,
                        i.Price,
                        i.Price * i.Quantity
                    )).ToList(),
                    o.Payment == null ? null : new PaymentResponse(
                        o.Payment.Method.ToString(),
                        o.Payment.ReferenceNo,
                        o.Payment.Status.ToString(),
                        o.Payment.PaidAt
                    )
                ))
                .ToListAsync();

            return Ok(orders);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task <ActionResult<OrderResponse>> GetOrder(int id)
        {
            var order = await context.Orders
                .Where(o => o.Id == id)
                .Select(o => new OrderResponse(
                    o.Id,
                    o.Table!.TableNo,
                    o.Pax,
                    o.Status.ToString(),
                    o.TotalAmount,
                    o.CreatedAt,
                    o.OrderItems.Select(i => new OrderItemResponse(
                        i.FoodName,
                        i.Quantity,
                        i.Price,
                        i.Price * i.Quantity
                    )).ToList(),
                    o.Payment == null ? null : new PaymentResponse(
                        o.Payment.Method.ToString(),
                        o.Payment.ReferenceNo,
                        o.Payment.Status.ToString(),
                        o.Payment.PaidAt
                    )
                ))
                .FirstOrDefaultAsync();

            if (order is null)
                return NotFound(new {message = "Order not found."});
            
            return Ok(order);
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateOrder(int id, UpdateOrderStatusRequest request)
        {
            var order = await context.Orders.FindAsync(id);

            if (order is null)
                return NotFound(new {message = "Order not found."});

            if (!Enum.TryParse<OrderStatus>(request.Status, true, out var newStatus)) {
                return BadRequest(new {message = "Invalid status."});
            }

            if (order.Status == newStatus)
                return BadRequest (new {message = "New status is same with old status"});

            order.Status = newStatus;

            await context.SaveChangesAsync();

            return Ok(new {id = order.Id, message = "Order status update successfully."});
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder (int id)
        {
            var order = await context.Orders.FindAsync(id);

            if (order is null)
                return NotFound(new {message = "Order not found."});
            
            context.Orders.Remove(order);
            await context.SaveChangesAsync();

            return Ok(new {id = order.Id, message = "Order deleted successfully."});
        }
    }
}