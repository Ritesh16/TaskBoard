namespace TaskBoard.Domain.User
{
    public class User : BaseDomain
    {
        public int UserId { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required bool IsActive { get; set; }
    }
}
