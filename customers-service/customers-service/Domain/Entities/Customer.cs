using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace customers_service.Domain.Entities
{
    public class Customer
    {
        public Customer(string firstName, string lastName, string email, string cpf, DateTime? birthDate)
        {
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Cpf = cpf;
            BirthDate = birthDate;
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        [Display(Name = "Primeiro Nome")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        [Display(Name = "Último Nome")]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(150)]
        [Display(Name = "E-mail")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        [Display(Name = "CPF")]
        public string Cpf { get; set; } = string.Empty;
        [DataType(DataType.Date)]
        [Display(Name = "Data de Nascimento")]
        public DateTime? BirthDate { get; set; }
    }
}
