using System.Text;
using System.Text.Json;
using FoodPro.API.Data;
using FoodPro.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodPro.API.Services
{
    public class ChatService(AppDbContext context, IConfiguration config, HttpClient httpClient)
    {
        private readonly string _apiKey = config["Gemini:ApiKey"]!;
        private const string GeminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";
        
        public async Task<string> HandleMessageAsync(string userMessage)
        {
            var foods = await context.Foods
                .Include(f => f.Category)
                .Select(f => new{ f.Name, f.Description, f.Price, Category = f.Category!.Name })
                .ToListAsync();
            
            var tables = await context.Tables
                .Where(t => t.IsReservable)
                .Select(t => new { t.TableNo, t.Capacity, Position = t.Position.ToString() })
                .ToListAsync();
            
            var timeSlots = await context.TimeSlots
                .Select(t => new { t.Id, StartTime = t.StartTime.ToString("hh:mm tt") })
                .ToListAsync();

            var jsonExample = """{"needsAvailability": true, "date": "yyyy-MM-dd", "timeSlotId": 3}""";

            var systemPrompt = $"""
                You are a helpful assistant for FoodPro restaurant.
                Today's date is {DateOnly.FromDateTime(DateTime.UtcNow):yyyy-MM-dd} ({DateTime.UtcNow:dddd}).

                You have access to the following data:
                MENU:
                {JsonSerializer.Serialize(foods)}

                TABLES:
                {JsonSerializer.Serialize(tables)}

                TIMESLOTS:
                {JsonSerializer.Serialize(timeSlots)}

                You do NOT have info on: ingredients, allergens, nutritional info.
                If asked about these, say the restaurant hasn't provided that info yet and suggest asking staff directly.

                If the user asks about table availability for a specific date and time:
                - Extract the date as yyyy-MM-dd and the matching timeSlotId from the timeslots list above
                - Reply ONLY with this JSON (no extra text): {jsonExample}
                - If the date or time is unclear, ask the user to clarify instead

                If the user wants to make a reservation or asks how to book:
                - Tell them to visit our reservation page at /reservations to complete their booking.
                - Do not attempt to book on their behalf.

                For all other questions, answer naturally and helpfully.
                """;

            var firstResponse = await CallGeminiAsync(systemPrompt, userMessage);

            var trimmed = firstResponse.Trim();
            if (trimmed.StartsWith("{") && trimmed.Contains("needsAvailability"))
            {
                try
                {
                    var extracted = JsonSerializer.Deserialize<JsonElement>(firstResponse);
                    var date = DateOnly.Parse(extracted.GetProperty("date").GetString()!);
                    var timeSlotId = extracted.GetProperty("timeSlotId").GetInt32();

                    var bookedTableIds = await context.Reservations
                        .Where(r => r.Date == date
                            && r.TimeSlotId == timeSlotId
                            && r.Status != ResStatus.Cancelled)
                        .Select(r => r.TableId)
                        .ToListAsync();

                    var availability = await context.Tables
                        .Where(t => t.IsReservable)
                        .Select(t => new
                        {
                            t.TableNo,
                            t.Capacity,
                            Position = t.Position.ToString(),
                            IsAvailable = !bookedTableIds.Contains(t.Id)
                        })
                        .ToListAsync();
                    
                    var availabilityPrompt = $"""
                        {systemPrompt}

                        AVAILABILITY DATA for {date:yyyy-MM-dd} timeslot {timeSlotId}:
                        {JsonSerializer.Serialize(availability)}

                        IMPORTANT: You now have the availability data above. Answer the user's question naturally.
                        Do NOT return JSON. Give a friendly human response about which tables are available.
                        """;

                    return await CallGeminiAsync(availabilityPrompt, userMessage);
                }
                catch
                {
                    return firstResponse;
                }
            }

            return firstResponse;
        }

        private async Task<string> CallGeminiAsync(string systemPrompt, string userMessage)
        {
            var payload = new
            {
                system_instruction = new
                {
                    parts = new[] { new { text = systemPrompt } }
                },
                contents = new[]
                {
                    new
                    {
                        role = "user",
                        parts = new[] { new { text = userMessage } }
                    }
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync($"{GeminiUrl}?key={_apiKey}", content);
            var responseBody = await response.Content.ReadAsStringAsync();

            Console.WriteLine("=== GEMINI RAW RESPONSE ===");
            Console.WriteLine(responseBody);
            Console.WriteLine("===========================");

            var doc = JsonDocument.Parse(responseBody);
            return doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString() ?? "Sorry, I couldn't process that";
        }
    }
}