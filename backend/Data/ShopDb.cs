using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class ShopDb(DbContextOptions<ShopDb> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Stock> Stocks => Set<Stock>();
    public DbSet<Reservation> Reservations => Set<Reservation>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Product>().HasKey(p => p.Code);
        b.Entity<Product>().Property(p => p.Price).HasPrecision(18, 2);
        b.Entity<Stock>().HasKey(s => s.ProductCode);
        b.Entity<Reservation>().HasKey(r => new { r.ClientId, r.ProductCode });
    }

    // สร้างตาราง + seed ตอนเริ่มระบบ
    public static void Initialize(ShopDb db)
    {
        db.Database.EnsureCreated();
        // EnsureCreated ไม่เพิ่มตารางใหม่ให้ DB ที่มีอยู่แล้ว
        db.Database.ExecuteSqlRaw("""
            CREATE TABLE IF NOT EXISTS "Reservations" (
                "ClientId" TEXT NOT NULL,
                "ProductCode" TEXT NOT NULL,
                "Quantity" INTEGER NOT NULL,
                "UpdatedAt" TEXT NOT NULL,
                CONSTRAINT "PK_Reservations" PRIMARY KEY ("ClientId", "ProductCode"))
            """);
        SeedData.Seed(db);
    }
}
