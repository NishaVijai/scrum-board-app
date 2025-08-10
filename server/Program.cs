using Scrum_Board_Backend.Data;
using Scrum_Board_Backend.Services;

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
                "http://localhost:5173",
                "https://scrum-board-app.onrender.com"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// ✅ Apply CORS Policy
app.UseCors("AllowReactApp");

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

app.UseAuthorization();

app.MapControllers();

app.Run();
