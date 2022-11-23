using Anet.Models;
using GeekGist.Dtos;
using GeekGist.Services;
using Microsoft.AspNetCore.Mvc;

namespace GeekGist.Web.Api;

[ApiAuth]
[ApiController]
[Route("api/[controller]")]
public class CategorysController : ControllerBase
{
    private readonly CategoryService _categoryService;

    public CategorysController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<PagedResult<CategoryDto>>  Get(int page = 1, int size = 10, string keyword = null)
    {
        return await _categoryService.GetAsync(page, size, keyword);
    }

    [HttpPost]
    public Task Save(CategoryEditDto dto)
    {
        return _categoryService.SaveAsync(dto);
    }

    [HttpDelete("{id}")]
    public Task Delete(long id)
    {
        return _categoryService.DeleteAsync(id);
    }
}