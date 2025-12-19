using TaskBoard.Dto;

namespace TaskBoard.Service.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<UserCategoryDto>> GetUserCategories(int userId);
        Task AddCategory(UserCategoryDto userCategoryDto);
    }
}
