namespace FoodPro.API.DTOs.AIChat
{
    public record ChatRequest(
        string Message
    );
    public record GeminiExtractResponse(
        DateOnly? Date, 
        int? TimeSlotId
    );
}