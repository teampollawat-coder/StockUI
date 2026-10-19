using Backend.BusinessLogic;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/stock")]
public class StockController(IShopService shop) : ControllerBase
{
    /// <summary>คืนค่าสต็อก mock กลับเป็นค่าเริ่มต้น (สำหรับทดสอบ)</summary>
    [HttpPost("reset")]
    public async Task<IActionResult> Reset()
    {
        await shop.ResetStockAsync();
        return NoContent();
    }
}
