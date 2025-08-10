using Scrum_Board_Backend.Data;
using Scrum_Board_Backend.Services;
using Microsoft.AspNetCore.Builder;

var builder = WebApplication.CreateBuilder(args);

// ✅ Configure Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ Register DbContext & Services
builder.Services.AddDbContext<ScrumBoardContext>();
builder.Services.AddTransient<IScrumBoardContext, ScrumBoardContext>();
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

// ✅ Ensure DB is created (best inside a scope)
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ScrumBoardContext>();
    dbContext.Database.EnsureCreated();
}

// ✅ Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// ✅ Apply CORS Policy early to handle OPTIONS preflight
app.UseCors("AllowReactApp");

// ✅ Handle OPTIONS requests (preflight) explicitly
app.Use(async (context, next) =>
{
    if (context.Request.Method == HttpMethods.Options)
    {
        context.Response.StatusCode = 200;
        return;
    }
    await next();
});

app.UseAuthorization();

app.MapControllers();

app.Run();
