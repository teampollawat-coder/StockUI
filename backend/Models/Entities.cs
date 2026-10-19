using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class Product
{
    public string Code { get; set; } = "";
    public string Name { get; set; } = "";
    public decimal Price { get; set; }

    // คำนวณตอน query รายการสินค้า ไม่ได้เก็บในตาราง Products
    [NotMapped] public int Stock { get; set; }
    [NotMapped] public int Reserved { get; set; }
}

public class Stock
{
    public string ProductCode { get; set; } = "";
    public int Quantity { get; set; }
}

// สต็อกที่ถูกจองไว้ในตะกร้าของแต่ละ client (หักจาก Stock ไปแล้ว)
public class Reservation
{
    public string ClientId { get; set; } = "";
    public string ProductCode { get; set; } = "";
    public int Quantity { get; set; }
    public DateTime UpdatedAt { get; set; }
}
