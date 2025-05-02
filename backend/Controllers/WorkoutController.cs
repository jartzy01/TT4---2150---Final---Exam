using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class WorkoutsController : ControllerBase
{
    private readonly AppDbContext _context;

    public WorkoutsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Workout>>> GetWorkouts() => await _context.Workouts.ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Workout>> GetWorkout(int id)
    {
        var workout = await _context.Workouts.FindAsync(id);
        return workout == null ? NotFound() : Ok(workout);
    }

    [HttpPost]
    public async Task<ActionResult<Workout>> CreateWorkout(Workout workout)
    {
        _context.Workouts.Add(workout);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetWorkout), new { id = workout.Id }, workout);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkout(int id, Workout workout)
    {
        if (id != workout.Id) return BadRequest();
        _context.Entry(workout).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkout(int id)
    {
        var workout = await _context.Workouts.FindAsync(id);
        if (workout == null) return NotFound();
        _context.Workouts.Remove(workout);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
