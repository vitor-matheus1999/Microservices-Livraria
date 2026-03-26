
using customers_service.Application.Interfaces;
using customers_service.Domain.Interfaces;
using customers_service.Infrastructure.DbContextCustomers;
using customers_service.Infrastructure.Repository;
using customers_service.Infrastructure.Service;
using Microsoft.EntityFrameworkCore;

namespace customers_service
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            string postgreConnection = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<DbContextPostgre>(options =>
               options.UseNpgsql(postgreConnection));

            builder.Services.AddHttpClient("Keycloak", client =>
            {
                client.BaseAddress = new Uri("http://keycloak-service");
                client.Timeout = TimeSpan.FromSeconds(10);
            });

            builder.Services.AddScoped<IKeycloakService, KeycloakService>();

            builder.Services.AddScoped<ICustomerService, CustomerService>();

            builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();

            builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<DbContextPostgre>();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

                try
                {
                    logger.LogInformation("🔄 Verificando migrações pendentes...");

                    // Verificar se o banco existe e aplicar migrações
                    var pendingMigrations = dbContext.Database.GetPendingMigrations();

                    if (pendingMigrations.Any())
                    {
                        logger.LogInformation("📋 {Count} migrações pendentes encontradas", pendingMigrations.Count());
                        logger.LogInformation("🚀 Aplicando migrações...");

                        dbContext.Database.Migrate();

                        logger.LogInformation("✅ Migrações aplicadas com sucesso!");
                    }
                    else
                    {
                        logger.LogInformation("✅ Todas as migrações já foram aplicadas");
                    }

                    // Verificar se a tabela Customers existe
                    var hasCustomersTable = dbContext.Database.ExecuteSqlRaw(
                        "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Customers')");

                    if (hasCustomersTable == 0)
                    {
                        logger.LogWarning("⚠️  Tabela Customers não encontrada! Aplicando migrações novamente...");
                        dbContext.Database.Migrate();
                    }

                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "❌ Erro ao aplicar migrações");

                    if (app.Environment.IsDevelopment())
                    {
                        throw; // Em desenvolvimento, parar a aplicação
                    }
                    // Em produção, continuar mesmo com erro
                }
            }

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
