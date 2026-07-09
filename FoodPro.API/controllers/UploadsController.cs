using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Mvc;

namespace FoodPro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadsController(IConfiguration configuration) : ControllerBase
    {
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if(file is null || file.Length == 0)
            {
                return BadRequest(new {message = "No file provided"});
            }

            var allowedExtensions = new[] {".jpg", ".jpeg", ".png", ".webp"};
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
            {
                return BadRequest(new {message = "Only .jpg, .jpeg, .png, .webp files are allowed "});
            }

            if(file.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new {message = "File size must not exceed 5MB"});
            }

            var cloudinary = new Cloudinary(new Account(
                configuration["Cloudinary:CloudName"],
                configuration["Cloudinary:ApiKey"],
                configuration["Cloudinary:ApiSecret"]
            ));

            using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = "foodpro"
            };

            var uploadResult = await cloudinary.UploadAsync(uploadParams);
            if(uploadResult.Error is not null)
            {
                return BadRequest(new {message = uploadResult.Error.Message});
            }

            return Ok(new {imageUrl = uploadResult.SecureUrl.ToString()});
        }
    }
}