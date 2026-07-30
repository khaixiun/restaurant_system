using FoodPro.API.DTOs.AIChat;
using FoodPro.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace FoodPro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController(ChatService chatService) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<string>> Chat(ChatRequest request)
        {
            if(string.IsNullOrWhiteSpace(request.Message))
                return BadRequest("Message cannot be empty.");

            var response = await chatService.HandleMessageAsync(request.Message);
            return Ok(new { reply = response });
        }
    }
}