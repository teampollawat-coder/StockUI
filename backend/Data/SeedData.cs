using Backend.Models;

namespace Backend.Data;

public static class SeedData
{
    static readonly Product[] Products =
    [
        new() { Code = "P001", Name = "ปากกาลูกลื่น", Price = 15 },
        new() { Code = "P002", Name = "สมุดโน้ต A5", Price = 45 },
        new() { Code = "P003", Name = "ดินสอ 2B", Price = 8 },
        new() { Code = "P004", Name = "ยางลบ", Price = 10 },
        new() { Code = "P005", Name = "แฟ้มเอกสาร", Price = 35 },
        new() { Code = "P006", Name = "เครื่องคิดเลข", Price = 199 },
        new() { Code = "P007", Name = "กระดาษ A4 (รีม)", Price = 125 },
        new() { Code = "P008", Name = "เทปใส", Price = 22.5m },
    ];

    static readonly int[] Quantities = [50, 20, 100, 5, 12, 3, 30, 0];

    // (รหัสสินค้า, จำนวนสต็อกเริ่มต้น)
    public static IEnumerable<(string Code, int Quantity)> DefaultStock =>
        Products.Select((p, i) => (p.Code, Quantities[i]));

    public static void Seed(ShopDb db)
    {
        if (db.Products.Any()) return;
        db.Products.AddRange(Products);
        db.Stocks.AddRange(DefaultStock.Select(s => new Stock { ProductCode = s.Code, Quantity = s.Quantity }));
        db.SaveChanges();
    }
}
