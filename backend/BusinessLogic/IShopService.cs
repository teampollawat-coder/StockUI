using Backend.Models;

namespace Backend.BusinessLogic;

public interface IShopService
{
    Task<List<Product>> GetProductsAsync();
    Task<List<CartItem>> GetCartAsync(string clientId);
    Task<ServiceResult<bool>> SetCartQuantityAsync(string clientId, string code, int quantity);
    Task<ServiceResult<Receipt>> CheckoutAsync(string? clientId);
    Task ResetStockAsync();
}
