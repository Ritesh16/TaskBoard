namespace TaskBoard.Dto
{
    public class TaskInstanceDto
    {
        public int TaskInstanceId { get; set; }
        public int TaskId { get; set; }
        public int TaskScheduleId { get; set; }
        public DateTime CompletedDate { get; set; }
    }
}
