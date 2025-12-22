using TaskBoard.Domain.Category;

namespace TaskBoard.Data.Interfaces
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<UserCategory>> GetUserCategories(int userId);
        Task AddCategory(UserCategory userCategory);
        Task<UserCategory> GetDefaultCategory(int userId);
    }
}
