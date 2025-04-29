using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Kuhinja.Models
{
    public class RecipeIngredients
    {
        [Key]
        public int Id { get; set; }
        public int RecipeId { get; set;}
        [JsonIgnore]
        public Recipe Recipe { get; set; }

        public int IngredientId { get; set; }
        public Ingredient Ingredient { get; set; }

        public double Amount { get; set; }
    }
}
