import { baht } from "../lib/format";

export type StockProduct = { code: string; name: string; price: number; stock: number; reserved: number };

export const LOW = 5;

const status = (p: StockProduct) =>
  p.stock === 0 ? { cls: "out", text: "หมด" } : p.stock <= LOW ? { cls: "low", text: "ใกล้หมด" } : { cls: "ok", text: "ปกติ" };

export default function StockTable({ rows }: { rows: StockProduct[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>รหัส</th>
            <th>สินค้า</th>
            <th className="num">ราคา</th>
            <th className="num">คงเหลือ</th>
            <th className="num">ถูกจองในตะกร้า</th>
            <th>สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const st = status(p);
            return (
              <tr key={p.code}>
                <td className="code">{p.code}</td>
                <td className="name-cell">{p.name}</td>
                <td className="num">{baht(p.price)}</td>
                <td className="num"><b>{p.stock}</b></td>
                <td className="num muted">{p.reserved || "–"}</td>
                <td><span className={`badge ${st.cls}`}>{st.text}</span></td>
              </tr>
            );
          })}
          {rows.length === 0 && (
            <tr><td colSpan={6} className="empty">ไม่พบสินค้า</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
