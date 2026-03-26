using customers_service.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace customers_service.Infrastructure.DbContextCustomers
{
    public class DbContextPostgre:DbContext
    {
        public DbContextPostgre(DbContextOptions<DbContextPostgre> options) : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
    }
}
