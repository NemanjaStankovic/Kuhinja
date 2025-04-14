using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Kuhinja.Models
{
    public class RecipeCategories
    {
        [Key]
        public int Id { get; set; }
        public int RecipeId { get; set; }
        [JsonIgnore]
        public Recipe Recipe { get; set; }
        public int CategoryId { get; set; }
        public Category Category{ get; set; }
    }
}
