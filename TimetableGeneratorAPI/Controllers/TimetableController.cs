using Microsoft.AspNetCore.Mvc;
using TimetableGeneratorAPI.Models;


[Route("api/[controller]")]
[ApiController]
public class TimetableController : ControllerBase
{
    [HttpPost("calculate-total-hours")]
    public IActionResult CalculateTotalHours([FromBody] TimetableInputDto input)
    {
        if (input.WorkingDays < 1 || input.WorkingDays > 7 ||
            input.SubjectsPerDay < 1 || input.SubjectsPerDay > 8 ||
            input.TotalSubjects <= 0)
        {
            return BadRequest("Invalid input.");
        }

        int totalHours = input.WorkingDays * input.SubjectsPerDay;

        return Ok(new { totalHours });
    }

    [HttpPost("generate-timetable")]
    public IActionResult GenerateTimetable([FromBody] TimetableRequestDto input)
    {
        if (input.Subjects == null || input.Subjects.Count != input.TotalSubjects)
            return BadRequest("Invalid subject count.");

        int total = input.Subjects.Sum(s => s.Hours);
        if (total != input.TotalHours)
            return BadRequest("Total subject hours must equal weekly total hours.");

        List<string> pool = new();
        foreach (var subject in input.Subjects)
        {
            for (int i = 0; i < subject.Hours; i++)
                pool.Add(subject.Name);
        }

        var rand = new Random();
        pool = pool.OrderBy(x => rand.Next()).ToList();

        string[][] result = new string[input.SubjectsPerDay][];

        int idx = 0;
        for (int row = 0; row < input.SubjectsPerDay; row++)
        {
            result[row] = new string[input.WorkingDays];
            for (int col = 0; col < input.WorkingDays; col++)
            {
                result[row][col] = pool[idx++];
            }
        }

        return Ok(new
        {
            days = input.WorkingDays,
            periods = input.SubjectsPerDay,
            timetable = result
        });
    }
}
