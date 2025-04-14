using System.ComponentModel.DataAnnotations;

namespace Kuhinja.Models
{
    public class Ingredient
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [RegularExpression("\\w+")]
        public string Name { get; set; }
    }
}
