using Microsoft.EntityFrameworkCore;
using Scrum_Board_Backend.Data;
using Scrum_Board_Backend.Services;
using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

// ✅ Add Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ Configure PostgreSQL connection dynamically
string connectionString;
var renderDbUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

if (!string.IsNullOrEmpty(renderDbUrl))
{
    // Parse Render PostgreSQL URL
    var databaseUri = new Uri(renderDbUrl);
    var userInfo = databaseUri.UserInfo.Split(':');
    var host = databaseUri.Host;
    var port = databaseUri.Port;
    var username = userInfo[0];
    var password = userInfo[1];
    var database = databaseUri.AbsolutePath.TrimStart('/');

    connectionString = $"Host={host};Port={port};Username={username};Password={password};Database={database};SSL Mode=Require;Trust Server Certificate=true";
}
else
{
    // Local development fallback
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                       ?? "Host=localhost;Port=5432;Username=postgres;Password=yourpassword;Database=scrumboard_dev";
}

// ✅ Register DbContext & Services
builder.Services.AddDbContext<ScrumBoardContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddScoped<IScrumBoardContext>(provider => provider.GetRequiredService<ScrumBoardContext>());
builder.Services.AddTransient<IScrumBoardService, ScrumBoardService>();

// ✅ Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
                "https://scrum-board-app.onrender.com",
                "http://localhost:5173"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// ✅ Apply CORS early
app.UseCors("AllowReactApp");

// ✅ Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    // ✅ Optional: Auto-migrate locally only
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ScrumBoardContext>();
        dbContext.Database.Migrate();
    }
}

app.UseAuthorization();
app.MapControllers();

// Run using ASPNETCORE_URLS from Docker / Render
app.Run();
