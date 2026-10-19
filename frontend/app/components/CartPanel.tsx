import { baht } from "../lib/format";
import CartRow from "./CartRow";
import type { Product } from "./ProductCard";
import ReceiptCard, { type Receipt } from "./ReceiptCard";

export type CartLine = { product: Product; qty: number };

export default function CartPanel({
  lines,
  receipt,
  busy,
  selecting,
  selected,
  onCloseReceipt,
  onStartSelect,
  onCancelSelect,
  onToggle,
  onSelectAll,
  onSetQty,
  onRemoveSelected,
  onCheckout,
}: {
  lines: CartLine[];
  receipt: Receipt | null;
  busy: boolean;
  selecting: boolean;
  selected: Set<string>;
  onCloseReceipt: () => void;
  onStartSelect: () => void;
  onCancelSelect: () => void;
  onToggle: (code: string) => void;
  onSelectAll: (all: boolean) => void;
  onSetQty: (code: string, qty: number) => void;
  onRemoveSelected: (codes: string[]) => void;
  onCheckout: () => void;
}) {
  const itemCount = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const selectedCodes = lines.map((l) => l.product.code).filter((c) => selected.has(c));
  const allSelected = lines.length > 0 && selectedCodes.length === lines.length;

  return (
    <aside className="card sticky">
      <h2 className="cart-title">ตะกร้าสินค้า</h2>
      {receipt && <ReceiptCard receipt={receipt} onClose={onCloseReceipt} />}
      {lines.length === 0 && (
        <div className="empty"><span className="big">🛍️</span>ยังไม่มีสินค้าในตะกร้า</div>
      )}
      {lines.length > 0 && (
        <div className="cart-bar">
          {selecting ? (
            <label className="check-all">
              <input type="checkbox" checked={allSelected} disabled={busy} onChange={() => onSelectAll(!allSelected)} />
              เลือกทั้งหมด
            </label>
          ) : (
            <span className="muted">{lines.length} รายการ · {itemCount} ชิ้น</span>
          )}
          {selecting ? (
            <span className="muted">เลือกแล้ว {selectedCodes.length} จาก {lines.length} รายการ</span>
          ) : (
            <button className="danger small" disabled={busy} onClick={onStartSelect}>🗑 ลบ</button>
          )}
        </div>
      )}
      {selecting && (
        <div className="bulk">
          <button className="ghost" disabled={busy} onClick={onCancelSelect}>ยกเลิก</button>
          <button className="danger" disabled={busy || selectedCodes.length === 0} onClick={() => onRemoveSelected(selectedCodes)}>
            ลบที่เลือก ({selectedCodes.length})
          </button>
        </div>
      )}
      {lines.map(({ product: p, qty }) => (
        <CartRow
          key={p.code}
          product={p}
          qty={qty}
          selecting={selecting}
          selected={selected.has(p.code)}
          busy={busy}
          onToggle={() => onToggle(p.code)}
          onSetQty={(q) => onSetQty(p.code, q)}
        />
      ))}
      <div className="total"><span>ยอดรวม</span><strong>{baht(total)}</strong></div>
      <button className="pay" disabled={lines.length === 0 || busy || selecting} onClick={onCheckout}>
        {busy ? "กำลังดำเนินการ..." : selecting ? "ลบให้เสร็จหรือกดยกเลิกก่อน" : "ชำระเงิน"}
      </button>
    </aside>
  );
}
