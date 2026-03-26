using customers_service.Domain.Entities;
using customers_service.Domain.Interfaces;
using System.Net.Http;
using System.Runtime;
using System.Text;
using System.Text.Json;

namespace customers_service.Infrastructure.Service
{
    public class KeycloakService:IKeycloakService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private string tokenKeycloak = "";

        public KeycloakService (IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<bool> CreateUserAsync(Customer customer, List<KeycloakCredential> credentials)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("Keycloak");
                if (string.IsNullOrEmpty(tokenKeycloak)) { await CreateTokenAsync(); }
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", tokenKeycloak);

                var user = new KeycloakUser($"{customer.FirstName}.{customer.LastName}",customer.Email,customer.FirstName,customer.LastName,true, credentials);
                var json = JsonSerializer.Serialize(user);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                using (var response = await client.PostAsync("admin/realms/master/users", content))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"Usuário {user.Username} criado com sucesso no Keycloak");
                        return true;
                    }
                    else
                    {
                        var error = await response.Content.ReadAsStringAsync();
                        Console.WriteLine("Erro ao criar usuário: {StatusCode} - {Error}", response.StatusCode, error);
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message,ex);
            }
        }

        private async Task CreateTokenAsync()
        {
            try
            {
                var client = _httpClientFactory.CreateClient("Keycloak");


                var formData = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("client_id","admin-cli"),
                    new KeyValuePair<string, string>("username", "admin"),
                    new KeyValuePair<string, string>("password", "admin"),
                    new KeyValuePair<string, string>("grant_type", "password")
                };

                var content = new FormUrlEncodedContent(formData);

                using (var response = await client.PostAsync("realms/master/protocol/openid-connect/token",content))
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonResponse = await response.Content.ReadAsStringAsync();
                        var tokenResponse = JsonSerializer.Deserialize<KeycloakResponse>(jsonResponse);


                        tokenKeycloak = tokenResponse.AccessToken.ToString();
                    }
                }
            }
            catch (Exception ex) {
                throw new Exception(ex.Message, ex);
            }
        }
    }
}
