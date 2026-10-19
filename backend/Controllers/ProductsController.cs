using Backend.BusinessLogic;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController(IShopService shop) : ControllerBase
{
    /// <summary>สินค้า + จำนวนคงเหลือ (หักของที่ถูกจองในตะกร้าแล้ว)</summary>
    [HttpGet]
    public async Task<ActionResult<List<Product>>> Get() => await shop.GetProductsAsync();
}
