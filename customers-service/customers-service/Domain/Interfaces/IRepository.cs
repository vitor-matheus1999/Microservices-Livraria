using System.Linq.Expressions;

namespace customers_service.Domain.Interfaces
{
    public interface IRepository<T>
    {
        Task<IEnumerable<T>> GetAllAsync(int pageNumber = 1, int pageSize = 10);
        Task<T?> GetAsync(Expression<Func<T, bool>> predicate);
        Task<T> CreateAsync(T entity);
        Task<T> UpdateAsync(T entity);
        Task<T> DeleteAsync(T entity);
    }
}
