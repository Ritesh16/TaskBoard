using AutoMapper;
using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Category;
using TaskBoard.Dto;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Service
{
    public class CategoryServiceMock : ICategoryService
    {
        private readonly ICategoryRepository categoryRepository;
        private readonly IMapper mapper;

        public CategoryServiceMock(ICategoryRepository categoryRepository, IMapper mapper)
        {
            this.categoryRepository = categoryRepository;
            this.mapper = mapper;
        }
        public async Task AddCategory(UserCategoryDto userCategoryDto)
        {
            var userCategory = mapper.Map<UserCategory>(userCategoryDto);
             await categoryRepository.AddCategory(userCategory);
        }

        public async Task<IEnumerable<UserCategoryDto>> GetUserCategories(int userId)
        {
            var userCategories = await categoryRepository.GetUserCategories(userId);
            return mapper.Map<IEnumerable<UserCategoryDto>>(userCategories);
        }
    }
}
