export type Column = { name: string; type: string; notNull: boolean; primaryKey: boolean };
export type Table = { name: string; columns: Column[]; rowCount: number; rows: Record<string, unknown>[] };

const fmt = (v: unknown) => (v === null || v === undefined ? null : String(v));

export function SchemaCard({ table }: { table: Table }) {
  return (
    <div className="card section">
      <h2 className="cart-title">Schema · {table.name}</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>คอลัมน์</th><th>ชนิดข้อมูล</th><th>Constraint</th></tr>
          </thead>
          <tbody>
            {table.columns.map((c) => (
              <tr key={c.name}>
                <td className="name-cell">{c.name}</td>
                <td><code>{c.type || "ANY"}</code></td>
                <td>
                  {c.primaryKey && <span className="badge key">PK</span>}{" "}
                  {c.notNull && <span className="badge ok">NOT NULL</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DataCard({ table }: { table: Table }) {
  return (
    <div className="card section">
      <h2 className="cart-title">
        ข้อมูล · {table.name} <span className="muted">
          ({table.rowCount} แถว{table.rowCount > table.rows.length && ` · แสดง ${table.rows.length} แถวแรก`})
        </span>
      </h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>{table.columns.map((c) => <th key={c.name}>{c.name}</th>)}</tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i}>
                {table.columns.map((c) => {
                  const v = fmt(r[c.name]);
                  return <td key={c.name}>{v ?? <span className="null">NULL</span>}</td>;
                })}
              </tr>
            ))}
            {table.rows.length === 0 && (
              <tr><td colSpan={table.columns.length} className="empty">ตารางว่าง</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
