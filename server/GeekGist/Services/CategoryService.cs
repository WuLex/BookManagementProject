using Anet;
using Anet.Data;
using Anet.Models;
using GeekGist.Dtos;
using GeekGist.Entities;
using Mapster;

namespace GeekGist.Services;

public class CategoryService : ServiceBase<Db>
{
    public CategoryService(Db db) : base(db)
    {
    }

    public async Task<PagedResult<CategoryDto>> GetAsync(int page, int size, string keyword = null)
    {
        var param = new SqlParams();
        var sql = Db.NewSql().From("Category").Where();
        //var sql = Db.NewSql()
        //    .Line("SELECT T.*")
        //    .Line("FROM Category T")
        //    //.Line("LEFT JOIN BookCategory BT ON T.Id=BT.CategoryId")
        //    .Line("WHERE 1=1");

        if (!string.IsNullOrEmpty(keyword))
        {
            sql.LineTab("AND (CategoryName LIKE @pattern) ");
            param.Add("pattern", $"%{keyword}%");
        }

        var result = new PagedResult<CategoryDto>(page, size) {
            Total = await Db.SingleAsync<int>(sql.Select("COUNT(1)"), param),
            Items = await Db.QueryAsync<CategoryDto>(sql.Select("*").Order("Id DESC").Page(page, size), param),
        };

        //var list = await Db.QueryAsync<CategoryDto>(sql, param);

        return result;
    }

    public async Task SaveAsync(CategoryEditDto dto)
    {
        using var tran = Db.BeginTransaction();

        if (dto.Id == 0) // Insert
        {
            var category = dto.Adapt<Category>();
            category.Id = IdGen.NewId();
            category.CreateDate = DateTime.Now;
            await Db.InsertAsync(category);
        }
        else // Update
        {
            var category = await Db.FindAsync<Category>(new { dto.Id });
            category.CreateDate = DateTime.Now;
            dto.Adapt(category);
            await Db.UpdateAsync(category);
        }

        tran.Commit();
    }

    public async Task DeleteAsync(long id)
    {
        var rows = await Db.DeleteAsync("Category", new { Id = id });
        if (rows == 0)
        {
            throw new NotFoundException();
        }
    }
}