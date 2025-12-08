using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TaskBoard.Domain.Category;
using TaskBoard.Domain.Task;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Service
{
    public class CategoryServiceMock : ICategoryService
    {
        List<UserCategory> list = new List<UserCategory>();

        public Task AddCategory(UserCategory userCategory)
        {
            list.Add(userCategory);
            return Task.CompletedTask;
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
