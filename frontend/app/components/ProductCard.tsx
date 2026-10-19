import { baht, iconOf } from "../lib/format";

export type Product = { code: string; name: string; price: number; stock: number };

export default function ProductCard({
  product: p,
  inCart,
  pick,
  onPick,
  onAdd,
}: {
  product: Product;
  inCart: number;
  pick: number;
  onPick: (value: number) => void;
  onAdd: () => void;
}) {
  const max = Math.max(p.stock, 1);
  const n = Math.min(Math.max(pick, 1), max);
  const setN = (v: number) => onPick(Math.min(Math.max(v || 1, 1), max));
  const canAdd = p.stock > 0; // stock คือของที่เหลือหลังหักตะกร้าแล้ว

  return (
    <div className={`card product ${!canAdd && inCart === 0 ? "soldout" : ""}`}>
      <div className="thumb">
        {iconOf(p.code)}
        {inCart > 0 && <span className="incart">ในตะกร้า {inCart}</span>}
      </div>
      <div className="code">{p.code}</div>
      <div className="name">{p.name}</div>
      <div className="price">{baht(p.price)}</div>
      <div className={`stock ${p.stock === 0 ? "out" : p.stock <= 5 ? "low" : ""}`}>
        {p.stock === 0 ? (inCart > 0 ? "คงเหลือ 0 ชิ้น" : "สินค้าหมด") : `คงเหลือ ${p.stock} ชิ้น`}
      </div>
      {canAdd && (
        <div className="picker">
          <button className="ghost" disabled={n <= 1} onClick={() => setN(n - 1)} aria-label="ลดจำนวน">−</button>
          <input
            type="number"
            min={1}
            max={p.stock}
            value={n}
            onChange={(e) => setN(parseInt(e.target.value, 10))}
            aria-label="จำนวนที่ต้องการ"
          />
          <button className="ghost" disabled={n >= p.stock} onClick={() => setN(n + 1)} aria-label="เพิ่มจำนวน">+</button>
        </div>
      )}
      <button disabled={!canAdd} onClick={onAdd}>
        {canAdd ? `+ เพิ่มลงตะกร้า${n > 1 ? ` (${n})` : ""}` : inCart > 0 ? "ครบตามสต็อกแล้ว" : "สินค้าหมด"}
      </button>
    </div>
  );
}
