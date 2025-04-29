using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Kuhinja.Models
{
    public class Ingredient
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [RegularExpression("\\w+")]
        public string Name { get; set; }
        public string UnitOfMeassure { get; set; }
        [JsonIgnore]
        public List<RecipeIngredients> RecipeIngredients { get; set; }
    }
}
