namespace TaskBoard.Domain
{
    public class BaseDomain
    {
        public DateTime RowCreateDate { get; set; }
        public string RowCreatedBy { get; set; }
        public DateTime RowUpdateDate { get; set; }
        public string RowUpdatedBy { get; set; }

    }
}
