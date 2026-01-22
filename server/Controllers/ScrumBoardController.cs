using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using Scrum_Board_Backend.Models;
using Scrum_Board_Backend.Services;

namespace Scrum_Board_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScrumBoardController : ControllerBase
    {
        private readonly IScrumBoardService _service;

        public ScrumBoardController(IScrumBoardService service)
        {
            _service = service;
        }

        // GET: /api/ScrumBoard
        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks = await _service.GetAllTasksAsync();
            return Ok(tasks);
        }

        // GET: /api/ScrumBoard/{id}
        // Route constraint ensures only valid ObjectId-length values hit this method
        [HttpGet("{id:length(24)}")]
        public async Task<IActionResult> GetTaskById(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return BadRequest("Invalid task ID format");

            var task = await _service.GetTaskByIdAsync(id);
            if (task == null)
                return NotFound();

            return Ok(task);
        }

        // POST: /api/ScrumBoard
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskEntity task)
        {
            if (task == null)
                return BadRequest("Task payload is required");

            var createdTask = await _service.AddTaskAsync(task);

            return CreatedAtAction(
                nameof(GetTaskById),
                new { id = createdTask.Id },
                createdTask
            );
        }

        // PUT: /api/ScrumBoard/{id}
        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> UpdateTask(string id, [FromBody] TaskEntity task)
        {
            if (!ObjectId.TryParse(id, out _))
                return BadRequest("Invalid task ID format");

            if (task == null || id != task.Id)
                return BadRequest("Task ID mismatch");

            var success = await _service.UpdateTaskAsync(task);
            if (!success)
                return NotFound();

            return NoContent();
        }

        // DELETE: /api/ScrumBoard/{id}
        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> DeleteTask(string id)
        {
            if (!ObjectId.TryParse(id, out _))
                return BadRequest("Invalid task ID format");

            var success = await _service.DeleteTaskAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
