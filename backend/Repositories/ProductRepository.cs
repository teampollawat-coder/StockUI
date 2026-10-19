using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class ProductRepository(ShopDb db) : IProductRepository
{
    public async Task<Product?> FindAsync(string code) => await db.Products.FindAsync(code);

    public Task<List<Product>> ListWithStockAsync() =>
        (from p in db.Products
         join s in db.Stocks on p.Code equals s.ProductCode
         orderby p.Code
         select new Product
         {
             Code = p.Code,
             Name = p.Name,
             Price = p.Price,
             Stock = s.Quantity,
             Reserved = db.Reservations.Where(r => r.ProductCode == p.Code).Sum(r => (int?)r.Quantity) ?? 0
         }).ToListAsync();
}
