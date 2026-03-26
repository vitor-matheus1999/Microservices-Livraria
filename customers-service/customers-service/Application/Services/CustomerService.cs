using customers_service.Application;
using customers_service.Application.DTO;
using customers_service.Application.Interfaces;
using customers_service.Domain.Entities;
using customers_service.Domain.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;

namespace customers_service
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _repo;
        private readonly IKeycloakService _keycloakService;

        public CustomerService(ICustomerRepository repo, IKeycloakService keycloakService)
        {
            _repo = repo;
            _keycloakService = keycloakService;
        }


        public async Task<CustomerRequestDTO> CreateCustormerAsync(CustomerRequestDTO customer)
        {
            try
            {
                var entitieCustomer = new Customer(customer.FirstName, customer.LastName,customer.Email,customer.Cpf,customer.BirthDate);
                var keycloakCredentials = new List<KeycloakCredential>();
                keycloakCredentials.Add(new KeycloakCredential(customer.Password));
                await _repo.CreateAsync(entitieCustomer);
                await _keycloakService.CreateUserAsync(entitieCustomer, keycloakCredentials);
                return customer;
            }
            catch (Exception ex) 
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task<Customer> GetCustomerByIdAsync(int id)
        {
            try
            {
                var customer = await _repo.GetAsync(customer => customer.Id == id);
                return customer;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task<IEnumerable<Customer>> ListCustomersAsync(int pageNumber = 1, int pageSize = 10)
        {
            try
            {
                return await _repo.GetAllAsync(pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }
    }
}
