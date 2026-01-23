using Microsoft.AspNetCore.Mvc;

namespace Scrum_Board_Backend.Controllers
{
    [ApiController]
    [Route("api/health")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Health()
        {
            return Ok("OK");
        }
    }
}
