using TaskBoard.Data.Interfaces;
using TaskBoard.Domain.Category;

namespace TaskBoard.Data.Mock
{
    public class CategoryRepositoryMock : ICategoryRepository
    {
        List<UserCategory> list = new List<UserCategory>();
        public Task AddCategory(UserCategory userCategory)
        {
            userCategory.CategoryId = list.Count + 1;
            list.Add(userCategory);
            return Task.CompletedTask;
        }

        public Task<UserCategory> GetDefaultCategory(int userId)
        {
            var userCategory = GetTasks().FirstOrDefault(x => x.UserId == userId &&
                    x.Name.ToLower() == "general");

            return Task.FromResult(userCategory);
        }

        public Task<IEnumerable<UserCategory>> GetUserCategories(int userId)
        {
            return Task.FromResult(GetTasks().Where(x => x.UserId == userId));
        }

        private IEnumerable<UserCategory> GetTasks()
        {
            var userCategory = new UserCategory()
            {
                CategoryId = 1,
                Description = "General category",
                IsActive = true,
                Name = "General",
                UserId = 2
            };

            var userCategory1 = new UserCategory()
            {
                CategoryId = 2,
                Description = "Learning",
                IsActive = true,
                Name = "Learning",
                UserId = 2
            };

            if (list.Count == 0)
            {
                list.Add(userCategory);
                list.Add(userCategory1);
            }

            return list;
        }
    }
}
