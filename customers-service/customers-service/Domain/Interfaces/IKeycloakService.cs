using customers_service.Domain.Entities;

namespace customers_service.Domain.Interfaces
{
    public interface IKeycloakService
    {
        Task<bool> CreateUserAsync(Customer customer,List<KeycloakCredential> credentials);
    }
}
