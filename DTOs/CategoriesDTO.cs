using Kuhinja.Models;
using System.ComponentModel.DataAnnotations;
namespace Kuhinja.DTOs
{
    public class CategoriesDTO
    {
        public List<Category> Time { get; set; }
        public List<Category> Portions { get; set; }
        public List<Category> Types { get; set; }
    }
}
