using customers_service.Application.DTO;
using customers_service.Domain.Entities;

namespace customers_service.Application.Interfaces
{
    public interface ICustomerService
    {
        Task<Customer> GetCustomerByIdAsync(int id);
        Task<IEnumerable<Customer>> ListCustomersAsync(int pageNumber = 1, int pageSize = 10);
        Task<CustomerRequestDTO> CreateCustormerAsync(CustomerRequestDTO customer);
    }
}
