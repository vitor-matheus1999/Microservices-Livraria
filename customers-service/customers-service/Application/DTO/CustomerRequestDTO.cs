using customers_service.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace customers_service.Application.DTO
{
    public class CustomerRequestDTO
    {
        public string FirstName { get; set; } = string.Empty;

        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        public string Cpf { get; set; } = string.Empty;
        public DateTime? BirthDate { get; set; }
        public string Password {  get; set; } = string.Empty;
    }
}
