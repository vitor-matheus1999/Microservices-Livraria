using customers_service.Domain.Interfaces;
using customers_service.Infrastructure.DbContextCustomers;
using Microsoft.EntityFrameworkCore;

namespace customers_service
{
    public class Repository<T>:IRepository<T> where T : class
    {
        protected readonly DbContextPostgre _context;

        public Repository(DbContextPostgre context)
        {
            _context = context;
        }

        public async Task<T> CreateAsync(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<T> DeleteAsync(T entity)
        {
            _context.Set<T>().Remove(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<T?> GetAsync(System.Linq.Expressions.Expression<Func<T, bool>> predicate)
        {
            return await _context.Set<T>().FirstOrDefaultAsync(predicate);
        }

        public async Task<IEnumerable<T>> GetAllAsync(int pageNumber = 1, int pageSize = 10)
        {
            var list = await _context.Set<T>().AsNoTracking().ToListAsync();
            return list.Skip(pageNumber * (pageNumber - 1)).Take(pageSize);
        }

        public async Task<T> UpdateAsync(T entity)
        {
            _context.Set<T>().Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
    }
}
