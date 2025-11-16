namespace TaskBoard.Domain.Task
{
    public class AddTask
    {
        public required string Title { get; set; }
        public int UserId { get; set; }
        public int CategoryId { get; set; }
    }
}
