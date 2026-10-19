using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class StockRepository(ShopDb db) : IStockRepository
{
    public Task<int> GetQuantityAsync(string code) =>
        db.Stocks.Where(s => s.ProductCode == code).Select(s => s.Quantity).FirstAsync();

    public async Task<bool> TryDecreaseAsync(string code, int amount) =>
        await db.Stocks.Where(s => s.ProductCode == code && s.Quantity >= amount)
            .ExecuteUpdateAsync(s => s.SetProperty(x => x.Quantity, x => x.Quantity - amount)) > 0;

    public Task IncreaseAsync(string code, int amount) =>
        db.Stocks.Where(s => s.ProductCode == code)
            .ExecuteUpdateAsync(s => s.SetProperty(x => x.Quantity, x => x.Quantity + amount));

    public Task SetQuantityAsync(string code, int quantity) =>
        db.Stocks.Where(s => s.ProductCode == code)
            .ExecuteUpdateAsync(s => s.SetProperty(x => x.Quantity, quantity));
}
