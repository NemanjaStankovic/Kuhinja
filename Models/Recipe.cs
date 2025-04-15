using System.ComponentModel.DataAnnotations;

namespace Kuhinja.Models
{
    public class Recipe
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        public string Instructions { get; set; }
        public string ImageUrl { get; set; }    
        public List<Category> Categories { get; set; }
        public List<Ingredient> Ingredients { get; set; }
        public int UserId { get; set; }  // Foreign key to User (must be of type 'int')
        public User User { get; set; }    // Navigation property
        public DateTime Created_at { get; set; }
    }
}
