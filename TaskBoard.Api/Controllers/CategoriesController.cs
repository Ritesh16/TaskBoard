using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskBoard.Dto;
using TaskBoard.Service.Interfaces;

namespace TaskBoard.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            this.categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = User.FindFirstValue("UserId");
            var id = Convert.ToInt32(userId);

            var tasks = await categoryService.GetUserCategories(id);
            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> AddUserCategory([FromBody]UserCategoryDto userCategoryDto)
        {
            var userId = User.FindFirstValue("UserId");
            var id = Convert.ToInt32(userId);
            userCategoryDto.UserId = id;

            await categoryService.AddCategory(userCategoryDto);
            return Ok();
        }
    }
}
