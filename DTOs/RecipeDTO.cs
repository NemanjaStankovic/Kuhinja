using System.ComponentModel.DataAnnotations;

namespace Kuhinja.DTOs
{
    public class RecipeDTO
    {
        [Required]
        public string Title { get; set; }

        public string Instructions { get; set; }

        public string ImageUrl { get; set; }
    }
}
