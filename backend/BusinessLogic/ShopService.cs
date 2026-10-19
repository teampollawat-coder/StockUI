using Backend.Data;
using Backend.Models;
using Backend.Repositories;

namespace Backend.BusinessLogic;

public class ShopService(
    IProductRepository products,
    IStockRepository stocks,
    IReservationRepository reservations,
    IUnitOfWork uow) : IShopService
{
    // ตะกร้าที่ไม่มีความเคลื่อนไหวเกินเวลานี้จะถูกคืนสต็อก
    static readonly TimeSpan ReservationTtl = TimeSpan.FromMinutes(10);

    // สินค้า + จำนวนคงเหลือ (หักของที่ถูกจองในตะกร้าแล้ว)
    public async Task<List<Product>> GetProductsAsync()
    {
        await ReleaseExpiredAsync();
        return await products.ListWithStockAsync();
    }

    // รายการที่จองไว้ในตะกร้า (ใช้กู้ตะกร้าหลังรีเฟรชหน้า)
    public async Task<List<CartItem>> GetCartAsync(string clientId)
    {
        await ReleaseExpiredAsync();
        return await reservations.ListByClientAsync(clientId);
    }

    // ตั้งจำนวนในตะกร้า และตัด/คืนสต็อกส่วนต่างทันที (0 = เอาออก)
    public async Task<ServiceResult<bool>> SetCartQuantityAsync(string clientId, string code, int quantity)
    {
        if (quantity < 0)
            return ServiceResult<bool>.Fail(400, new { error = "จำนวนสินค้าไม่ถูกต้อง" });

        await ReleaseExpiredAsync();
        await using var tx = await uow.BeginTransactionAsync();

        var product = await products.FindAsync(code);
        if (product is null)
            return ServiceResult<bool>.Fail(404, new { error = $"ไม่พบสินค้า: {code}" });

        var res = await reservations.FindAsync(clientId, code);
        var delta = quantity - (res?.Quantity ?? 0);

        if (delta > 0)
        {
            if (!await stocks.TryDecreaseAsync(code, delta))
            {
                var left = await stocks.GetQuantityAsync(code);
                return ServiceResult<bool>.Fail(409, new
                {
                    error = $"สินค้า {product.Name} มีในสต็อกเพียง {left} ชิ้น",
                    code,
                    available = left
                });
            }
        }
        else if (delta < 0)
        {
            await stocks.IncreaseAsync(code, -delta);
        }

        if (quantity == 0)
        {
            if (res is not null) reservations.Remove(res);
        }
        else if (res is null)
            reservations.Add(new Reservation { ClientId = clientId, ProductCode = code, Quantity = quantity, UpdatedAt = DateTime.UtcNow });
        else
            res.Quantity = quantity;
        await uow.SaveChangesAsync();

        // ต่ออายุทั้งตะกร้า
        await reservations.RenewClientAsync(clientId, DateTime.UtcNow);

        await tx.CommitAsync();
        return ServiceResult<bool>.Ok(true);
    }

    // สต็อกถูกตัดตอนใส่ตะกร้าแล้ว จึงเพียงยืนยันการจองและคืนยอดชำระ
    public async Task<ServiceResult<Receipt>> CheckoutAsync(string? clientId)
    {
        if (string.IsNullOrWhiteSpace(clientId))
            return ServiceResult<Receipt>.Fail(400, new { error = "ไม่พบตะกร้าสินค้า" });

        await ReleaseExpiredAsync();
        await using var tx = await uow.BeginTransactionAsync();

        var lines = await reservations.GetReceiptLinesAsync(clientId);
        if (lines.Count == 0)
            return ServiceResult<Receipt>.Fail(400, new { error = "ตะกร้าว่างหรือหมดอายุแล้ว" });

        await reservations.DeleteByClientAsync(clientId);
        await tx.CommitAsync();
        return ServiceResult<Receipt>.Ok(new Receipt(lines, lines.Sum(l => l.LineTotal)));
    }

    // คืนค่าสต็อก mock กลับเป็นค่าเริ่มต้น (สำหรับทดสอบ)
    public async Task ResetStockAsync()
    {
        await reservations.DeleteAllAsync();
        foreach (var (code, qty) in SeedData.DefaultStock)
            await stocks.SetQuantityAsync(code, qty);
    }

    // คืนสต็อกของการจองที่หมดอายุ
    async Task ReleaseExpiredAsync()
    {
        var cutoff = DateTime.UtcNow - ReservationTtl;
        await using var tx = await uow.BeginTransactionAsync();
        var expired = await reservations.ListExpiredAsync(cutoff);
        foreach (var r in expired)
            await stocks.IncreaseAsync(r.ProductCode, r.Quantity);
        reservations.RemoveRange(expired);
        await uow.SaveChangesAsync();
        await tx.CommitAsync();
    }
}
