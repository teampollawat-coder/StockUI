using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

// อ่าน schema + ข้อมูลทุกตารางของ SQLite (อ่านอย่างเดียว)
public class DbInspectorRepository(ShopDb db) : IDbInspectorRepository
{
    public async Task<DbSchema> GetSchemaAsync(int maxRows)
    {
        var conn = db.Database.GetDbConnection();
        await conn.OpenAsync();
        try
        {
            var names = new List<string>();
            using (var c = conn.CreateCommand())
            {
                c.CommandText = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name";
                using var r = await c.ExecuteReaderAsync();
                while (await r.ReadAsync()) names.Add(r.GetString(0));
            }

            var tables = new List<DbTable>();
            foreach (var name in names)
            {
                var q = name.Replace("\"", "\"\""); // ชื่อมาจาก sqlite_master เอง ไม่ใช่จาก input
                var cols = new List<DbColumn>();
                using (var c = conn.CreateCommand())
                {
                    c.CommandText = $"PRAGMA table_info(\"{q}\")";
                    using var r = await c.ExecuteReaderAsync();
                    while (await r.ReadAsync())
                        cols.Add(new DbColumn(r.GetString(1), r.GetString(2), r.GetInt32(3) == 1, r.GetInt32(5) > 0));
                }

                long count;
                using (var c = conn.CreateCommand())
                {
                    c.CommandText = $"SELECT COUNT(*) FROM \"{q}\"";
                    count = Convert.ToInt64(await c.ExecuteScalarAsync());
                }

                var rows = new List<Dictionary<string, object?>>();
                using (var c = conn.CreateCommand())
                {
                    c.CommandText = $"SELECT * FROM \"{q}\" LIMIT {maxRows}";
                    using var r = await c.ExecuteReaderAsync();
                    while (await r.ReadAsync())
                    {
                        var row = new Dictionary<string, object?>();
                        for (var i = 0; i < r.FieldCount; i++)
                            row[r.GetName(i)] = await r.IsDBNullAsync(i) ? null : r.GetValue(i);
                        rows.Add(row);
                    }
                }
                tables.Add(new DbTable(name, cols, count, rows));
            }
            return new DbSchema(db.Database.ProviderName, tables);
        }
        finally { await conn.CloseAsync(); }
    }
}
