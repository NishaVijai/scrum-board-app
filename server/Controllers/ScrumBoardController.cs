using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Scrum_Board_Backend.Models;
using Scrum_Board_Backend.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Scrum_Board_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowReactApp")]
    public class ScrumBoardController(IScrumBoardService scrumBoardService) : ControllerBase
    {
        // GET: api/<ScrumBoardController>
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllTasks()
        {
            var result = await scrumBoardService.GetAllTasks();
            return Ok(result);
        }

        // GET api/<ScrumBoardController>/5
        [HttpGet("Get")]
        public async Task<IActionResult> GetTask(int id)
        {
            var result = await scrumBoardService.GetTaskById(id);
            return Ok(result);
        }

        // POST api/<ScrumBoardController>
        [HttpPost("Update")]
        public async Task<IActionResult> UpdateTask([FromBody] TaskEntity task)
        {
            var result = await scrumBoardService.UpdateTask(task);
            return Ok(result);
        }

        // Post api/<ScrumBoardController>/5
        [HttpPost("Create")]
        public async Task<IActionResult> CreateTask([FromBody] TaskEntity task)
        {
            var result = await scrumBoardService.CreateTask(task);
            return Ok(result);
        }

        // DELETE api/<ScrumBoardController>/5
        [HttpDelete]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var result = await scrumBoardService.DeleteTask(id);
            return Ok(result);
        }
    }
}
