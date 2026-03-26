using customers_service.Domain.Entities;
using customers_service.Domain.Interfaces;
using customers_service.Infrastructure.DbContextCustomers;

namespace customers_service.Infrastructure.Repository
{
    public class CustomerRepository: Repository<Customer>,ICustomerRepository
    {
        public CustomerRepository(DbContextPostgre context) : base(context) { }
    }
}
