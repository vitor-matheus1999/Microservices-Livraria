using System.Text.Json.Serialization;

namespace customers_service.Domain.Entities
{
    public class KeycloakUser
    {
        public KeycloakUser(string username, string email, string firstName, string lastName, bool enabled, List<KeycloakCredential> credentials)
        {
            Username = username;
            Email = email;
            FirstName = firstName;
            LastName = lastName;
            Enabled = enabled;
            Credentials = credentials;
        }

        [JsonPropertyName("username")]
        public string Username { get; set; } = string.Empty;

        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        [JsonPropertyName("firstName")]
        public string FirstName { get; set; } = string.Empty;

        [JsonPropertyName("lastName")]
        public string LastName { get; set; } = string.Empty;

        [JsonPropertyName("enabled")]
        public bool Enabled { get; set; } = true;

        [JsonPropertyName("credentials")]
        public List<KeycloakCredential> Credentials { get; set; } = new();
    }
}
