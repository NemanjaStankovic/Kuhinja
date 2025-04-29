using System.ComponentModel.DataAnnotations;

namespace Kuhinja.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [RegularExpression("\\w+")]
        public string Name { get; set; }
        [Required]
        [RegularExpression("\\w+")]
        public string Surname { get; set; }
        [Required]
        [EmailAddress]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        public DateTime createdAt { get; set; }
    }
}
