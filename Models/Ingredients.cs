using System.ComponentModel.DataAnnotations;

namespace Kuhinja.Models
{
    public class Ingredients
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
