using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Anet.Entity;

namespace GeekGist.Entities;

public class Category : Entity
{
    ///// <summary>
    ///// 
    ///// </summary>
    //public string CategoryID { get; set; }
    /// <summary>
    /// 
    /// </summary>
    public string CategoryCode { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public string CategoryName { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public string Description { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public string CreatedBy { get; set; }

    /// <summary>
    /// 
    /// </summary>
    public string Status { get; set; }

    /// <summary>
    /// 创建日期
    /// </summary>
    public DateTime CreateDate { get; set; }
}