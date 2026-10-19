using Backend.BusinessLogic;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/cart/{clientId}")]
public class CartController(IShopService shop) : ControllerBase
{
    /// <summary>รายการที่จองไว้ในตะกร้า (ใช้กู้ตะกร้าหลังรีเฟรชหน้า)</summary>
    [HttpGet]
    public async Task<ActionResult<List<CartItem>>> Get(string clientId) => await shop.GetCartAsync(clientId);

    /// <summary>ตั้งจำนวนในตะกร้า และตัด/คืนสต็อกส่วนต่างทันที (0 = เอาออก)</summary>
    [HttpPut("items/{code}")]
    public async Task<IActionResult> SetQuantity(string clientId, string code, SetQuantityRequest req)
    {
        var result = await shop.SetCartQuantityAsync(clientId, code, req.Quantity);
        return result.IsSuccess ? NoContent() : StatusCode(result.Status, result.Error);
    }
}
