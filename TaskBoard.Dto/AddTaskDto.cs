namespace TaskBoard.Dto
{
    public class AddTaskDto
    {
        public required string Title { get; set; }
        public int UserId { get; set; }
        public int CategoryId { get; set; }
    }
}
