using TaskBoard.Domain.Category;

namespace TaskBoard.Service.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<UserCategory>> GetUserCategories(int userId);
        Task AddCategory(UserCategory userCategory);
    }
}
