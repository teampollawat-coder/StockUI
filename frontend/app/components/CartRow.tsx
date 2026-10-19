import { baht, iconOf } from "../lib/format";
import type { Product } from "./ProductCard";

export default function CartRow({
  product: p,
  qty,
  selecting,
  selected,
  busy,
  onToggle,
  onSetQty,
}: {
  product: Product;
  qty: number;
  selecting: boolean;
  selected: boolean;
  busy: boolean;
  onToggle: () => void;
  onSetQty: (qty: number) => void;
}) {
  return (
    <div className={`row ${selected ? "selected" : ""}`}>
      {selecting && (
        <input
          type="checkbox"
          className="pick"
          checked={selected}
          disabled={busy}
          onChange={onToggle}
          aria-label={`เลือก ${p.name}`}
        />
      )}
      <div className="info">
        <div className="ttl">{iconOf(p.code)} {p.name}</div>
        <div className="muted">{baht(p.price)} × {qty} = {baht(p.price * qty)}</div>
      </div>
      {!selecting && (
        <div className="qty">
          <button className="ghost" onClick={() => onSetQty(qty - 1)}>−</button>
          <span>{qty}</span>
          <button className="ghost" disabled={p.stock === 0} onClick={() => onSetQty(qty + 1)}>+</button>
          <button className="danger" onClick={() => onSetQty(0)} title="ลบ">✕</button>
        </div>
      )}
    </div>
  );
}
