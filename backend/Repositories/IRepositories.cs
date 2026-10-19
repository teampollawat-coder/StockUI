using Backend.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace Backend.Repositories;

public interface IUnitOfWork
{
    Task<IDbContextTransaction> BeginTransactionAsync();
    Task SaveChangesAsync();
}

public interface IProductRepository
{
    Task<Product?> FindAsync(string code);
    // สินค้า + สต็อกคงเหลือ + จำนวนที่ถูกจองในตะกร้า
    Task<List<Product>> ListWithStockAsync();
}

public interface IStockRepository
{
    Task<int> GetQuantityAsync(string code);
    // ตัดสต็อกแบบ atomic: true เฉพาะเมื่อของพอ
    Task<bool> TryDecreaseAsync(string code, int amount);
    Task IncreaseAsync(string code, int amount);
    Task SetQuantityAsync(string code, int quantity);
}

public interface IReservationRepository
{
    Task<List<CartItem>> ListByClientAsync(string clientId);
    Task<Reservation?> FindAsync(string clientId, string code);
    Task<List<Reservation>> ListExpiredAsync(DateTime cutoff);
    Task<List<ReceiptLine>> GetReceiptLinesAsync(string clientId);
    void Add(Reservation reservation);
    void Remove(Reservation reservation);
    void RemoveRange(IEnumerable<Reservation> reservations);
    Task RenewClientAsync(string clientId, DateTime now);
    Task DeleteByClientAsync(string clientId);
    Task DeleteAllAsync();
}

public interface IDbInspectorRepository
{
    Task<DbSchema> GetSchemaAsync(int maxRows);
}
