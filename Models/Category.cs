using System.ComponentModel.DataAnnotations;

namespace Kuhinja.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [RegularExpression("\\w+")]
        public string Name { get; set; }
        public List<Recipe> Recipes { get; set; }
    }
}
