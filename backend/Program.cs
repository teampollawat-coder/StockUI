using Backend.BusinessLogic;
using Backend.Data;
using Backend.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// DB: เปลี่ยน connection string ใน appsettings.json ได้ (ปัจจุบันใช้ SQLite; สลับเป็น SQL Server ได้โดยเปลี่ยน UseSqlite)
builder.Services.AddDbContext<ShopDb>(o =>
    o.UseSqlite(builder.Configuration.GetConnectionString("Default") ?? "Data Source=shop.db"));

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IStockRepository, StockRepository>();
builder.Services.AddScoped<IReservationRepository, ReservationRepository>();
builder.Services.AddScoped<IDbInspectorRepository, DbInspectorRepository>();
builder.Services.AddScoped<IShopService, ShopService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins(builder.Configuration.GetSection("Cors:Origins").Get<string[]>() ?? ["http://localhost:3000"])
     .AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); // /swagger
}

using (var scope = app.Services.CreateScope())
    ShopDb.Initialize(scope.ServiceProvider.GetRequiredService<ShopDb>());

app.MapControllers();
app.Run();
