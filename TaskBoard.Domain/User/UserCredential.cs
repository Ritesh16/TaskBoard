namespace TaskBoard.Domain.User
{
    public class UserCredential : BaseDomain
    {
        public int UserCredentialId { get; set; }
        public int UserId { get; set; }
        public required string Password { get; set; }
        public bool IsActive { get; set; }
    }
}
