using Backend.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/db")]
public class DbController(IDbInspectorRepository inspector, IWebHostEnvironment env) : ControllerBase
{
    const int MaxRows = 200;

    /// <summary>schema + ข้อมูลทุกตาราง (อ่านอย่างเดียว, เปิดเฉพาะ Development)</summary>
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        if (!env.IsDevelopment()) return NotFound();
        var schema = await inspector.GetSchemaAsync(MaxRows);
        return Ok(new { provider = schema.Provider, tables = schema.Tables });
    }
}
