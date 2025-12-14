namespace TaskBoard.Domain.Category
{
    public class UserCategory : BaseDomain
    {
        public int CategoryId { get; set; }
        public int UserId { get; set; }
        public required string Name { get; set; }
        public string Description { get; set; } =string.Empty;
        public bool IsActive { get; set; }
    }
}
