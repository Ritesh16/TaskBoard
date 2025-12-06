namespace TaskBoard.Domain.Task
{
    public class TaskSchedule
    {
        public int TaskId { get; set; }
        //public int CustomRepeat { get; set; }
        //public string CustomUnit { get; set; }
        //public int? EndAfter { get; set; }
        //public DateTime EndDate { get; set; }
        public string OneTimeOption { get; set; }
        public string Repeat { get; set; }
        //public int[] SelectedDays { get; set; }
        public DateTime StartDate { get; set; }
    }
}
