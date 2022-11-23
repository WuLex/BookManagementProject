using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeekGist.Dtos.QueryDto;
public class GetInputQueryDto
{
    public GetInputQueryDto(int page = 1, int size = 10, string keyword = null, long? categoryId = null)
    {
        Page = page;
        Size = size;
        Keyword = keyword;
        CategoryId = categoryId;
    }

    public int Page { get; private set; }
    public int Size { get; private set; }
    public string Keyword { get; private set; }
    public long? CategoryId { get; private set; }
}

