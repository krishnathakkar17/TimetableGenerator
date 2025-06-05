namespace TimetableGeneratorAPI.Models
{
    public class TimetableRequestDto
    {
        public int WorkingDays { get; set; }
        public int SubjectsPerDay { get; set; }
        public int TotalHours { get; set; }
        public int TotalSubjects { get; set; }
        public List<SubjectHourDto> Subjects { get; set; }
    }
}
