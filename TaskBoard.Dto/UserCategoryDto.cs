namespace TaskBoard.Dto
{
    public class UserCategoryDto
    {
        public int CategoryId { get; set; }
        public int UserId { get; set; }
        public required string Name { get; set; }
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public List<UserTaskDto> Tasks { get; set; } = [];
    }
}
