using System.Text.Json.Serialization;

namespace customers_service.Domain.Entities
{
    public class KeycloakCredential
    {
        public KeycloakCredential(string value)
        {
            Value = value;
        }

        [JsonPropertyName("type")]
        public string Type { get; set; } = "password";

        [JsonPropertyName("value")]
        public string Value { get; set; } = string.Empty;

        [JsonPropertyName("temporary")]
        public bool Temporary { get; set; } = false;
    }
}
