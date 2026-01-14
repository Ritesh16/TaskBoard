namespace TaskBoard.Domain.Task
{
    public class TaskInstance : BaseDomain
    {
        public int TaskInstanceId { get; set; }
        public int TaskId { get; set; }
        public int TaskScheduleId { get; set; }
        public DateTime CompletedDate { get; set; }
    }
}
