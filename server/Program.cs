using Scrum_Board_Backend.Services;
using Scrum_Board_Backend.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using DotNetEnv;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// ================================
// Load Environment Variables
// ================================
var environment = builder.Environment.EnvironmentName;
var envFile = Path.Combine(
    builder.Environment.ContentRootPath,
    $".env.{environment.ToLower()}"
);

if (File.Exists(envFile))
{
    DotNetEnv.Env.Load(envFile);
    Console.WriteLine($"Loaded environment variables from: {envFile}");
}

// ================================
// Services
// ================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// MongoDB
builder.Services.AddSingleton<IScrumBoardContext, ScrumBoardContext>();
builder.Services.AddScoped<IScrumBoardService, ScrumBoardService>();

// ================================
// CORS
// ================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        var allowedOriginsEnv =
            Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS") ?? "";

        var origins = allowedOriginsEnv
            .Split(';', StringSplitOptions.RemoveEmptyEntries);

        if (origins.Length == 0)
        {
            origins = new[]
            {
                "http://localhost:5173",
                "https://scrum-board-app.onrender.com"
            };
        }

        policy
            .WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// ================================
// Middleware (ORDER MATTERS)
// ================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

// ✅ CORS MUST be here
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
