using Backend.BusinessLogic;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/checkout")]
public class CheckoutController(IShopService shop) : ControllerBase
{
    /// <summary>ยืนยันการจองในตะกร้าและคืนยอดชำระ</summary>
    [HttpPost]
    public async Task<ActionResult<Receipt>> Post(CheckoutRequest req)
    {
        var result = await shop.CheckoutAsync(req.ClientId);
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.Status, result.Error);
    }
}
