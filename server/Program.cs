using Scrum_Board_Backend.Services;
using Scrum_Board_Backend.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using DotNetEnv;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// ================================
// ✅ Load Environment Variables from .env files
// ================================
var environment = builder.Environment.EnvironmentName; // "Development" or "Production"
var envFile = Path.Combine(builder.Environment.ContentRootPath, $".env.{environment.ToLower()}");

if (File.Exists(envFile))
{
    DotNetEnv.Env.Load(envFile);
    Console.WriteLine($"Loaded environment variables from: {envFile}");
}
else
{
    Console.WriteLine($"Environment file not found: {envFile}. Make sure .env.{environment.ToLower()} exists.");
}

// ================================
// ✅ Add Controllers & Swagger
// ================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ================================
// ✅ MongoDB Configuration
// ================================
builder.Services.AddSingleton<IScrumBoardContext, ScrumBoardContext>();
builder.Services.AddScoped<IScrumBoardService, ScrumBoardService>();

// ================================
// ✅ Configure CORS
// ================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        // Read allowed origins from environment variable (semicolon-separated)
        var allowedOriginsEnv = Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS") ?? "";
        var origins = allowedOriginsEnv.Split(';', StringSplitOptions.RemoveEmptyEntries);

        // Fallback if env var is not set
        if (origins.Length == 0)
        {
            origins = new[]
            {
                "http://localhost:5173",                // local dev
                "https://scrum-board-app.onrender.com" // production frontend
            };
        }

        policy.WithOrigins(origins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // necessary if frontend sends cookies or auth headers
    });
});

var app = builder.Build();

// ================================
// ✅ Middleware
// ================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS must be before UseAuthorization
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
