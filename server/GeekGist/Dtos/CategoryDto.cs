namespace GeekGist.Dtos;

public class CategoryDto
{
    public long Id { get; set; }

    /// <summary>
    /// 名称
    /// </summary>
    public string CategoryName { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public string Description { get; set; }


    /// <summary>
    /// 
    /// </summary>
    public int CreatedBy { get; set; }

    public int Status { get; set; }

    public DateTime CreateDate { get; set; }
     
}