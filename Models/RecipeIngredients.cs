using System.ComponentModel.DataAnnotations;

namespace Kuhinja.Models
{
    public class RecipeIngredients
    {
        [Key]
        public int Id { get; set; }
        public int recipeId { get; set; }
        public Recipe Recipes { get; set; }
        public int ingredientId { get; set; }
        public Ingredients Ingredients{ get; set; }
        [Required]
        [RegularExpression("\\d+")]
        public string Amount { get; set; }
    }
}
