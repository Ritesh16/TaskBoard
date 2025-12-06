namespace TaskBoard.Domain.Task
{
    public class TaskDetail
    {
        public int TaskId { get; set; }
        public int CategoryId { get; set; }
        public string Details { get; set; } = string.Empty;
    }
}
