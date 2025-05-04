using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Kuhinja.Models
{
    public class Category
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [RegularExpression("\\w+")]
        public string Name { get; set; }
        public string Type { get; set; }
        [JsonIgnore]
        public List<Recipe> Recipes { get; set; }
    }
}
