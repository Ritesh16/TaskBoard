namespace TaskBoard.Domain.Task
{
    public class TaskSchedule
    {
        public int TaskScheduleId { get; set; }
        public int TaskId { get; set; }
        public string Frequency { get; set; }
        public string? Interval { get; set; }
        public int[] DaysOfWeek { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int? StopAfter { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime RowCreateDate { get; set; }
        public string RowCreatedBy { get; set; }
        public DateTime RowUpdateDate { get; set; }
        public string RowUpdatedBy { get; set; }

        public TaskSchedule()
        {
            RowCreateDate = DateTime.Now;
            RowUpdateDate = DateTime.Now;
        }
    }
}
