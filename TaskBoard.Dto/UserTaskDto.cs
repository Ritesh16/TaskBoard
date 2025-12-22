namespace TaskBoard.Dto
{
    public class UserTaskDto
    {
        public int TaskId { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int UserId { get; set; }
        public required string Title { get; set; }
        public string Details { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime Date { get; set; }
        //public DateTime RowUpdateDate { get; set; }
    }
}
