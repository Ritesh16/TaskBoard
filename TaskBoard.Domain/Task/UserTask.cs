namespace TaskBoard.Domain.Task
{
    public class UserTask
    {
        public int TaskId { get; set; }
        public int UserId { get; set; }
        public required string Title { get; set; }
        public required string CategoryName { get; set; }
        public int CategoryId { get; set; }
        public string Details { get; set; }
        public bool IsActive { get; set; }
        public DateTime Date { get; set; }
    }
}
