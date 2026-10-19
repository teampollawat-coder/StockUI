namespace Backend.Models;

public record CartItem(string Code, int Quantity);
public record CheckoutRequest(string? ClientId);
public record SetQuantityRequest(int Quantity);
public record ReceiptLine(string Code, string Name, decimal UnitPrice, int Quantity, decimal LineTotal);
public record Receipt(List<ReceiptLine> Lines, decimal Total);
public record DbColumn(string Name, string Type, bool NotNull, bool PrimaryKey);
public record DbTable(string Name, List<DbColumn> Columns, long RowCount, List<Dictionary<string, object?>> Rows);
public record DbSchema(string? Provider, List<DbTable> Tables);
