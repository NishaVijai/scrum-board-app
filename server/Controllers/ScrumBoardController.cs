using Microsoft.AspNetCore.Mvc;
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

        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks = await _service.GetAllTasksAsync();
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var task = await _service.GetTaskByIdAsync(id);
            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskEntity task)
        {
            var createdTask = await _service.AddTaskAsync(task);
            return CreatedAtAction(nameof(GetTaskById), new { id = createdTask.Id }, createdTask);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskEntity task)
        {
            if (id != task.Id) return BadRequest("Task ID mismatch");

            var success = await _service.UpdateTaskAsync(task);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var success = await _service.DeleteTaskAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
