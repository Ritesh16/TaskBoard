namespace TaskBoard.Domain.Account
{
    public class AuthResponse
    {
        public required string Email { get; set; }
        public required string Token { get; set; }
    }
}
