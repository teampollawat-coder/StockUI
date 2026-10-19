import { baht, iconOf } from "../lib/format";

export type Line = { code: string; name: string; unitPrice: number; quantity: number; lineTotal: number };
export type Receipt = { lines: Line[]; total: number };

export default function ReceiptCard({ receipt, onClose }: { receipt: Receipt; onClose: () => void }) {
  return (
    <div className="receipt">
      <div className="receipt-head">
        <div className="check">✓</div>
        <div>
          <div className="receipt-title">ชำระเงินสำเร็จ</div>
          <div className="muted">ขอบคุณที่ใช้บริการ</div>
        </div>
        <button className="close" onClick={onClose} title="ปิด">✕</button>
      </div>
      <div className="receipt-body">
        {receipt.lines.map((l) => (
          <div className="rline" key={l.code}>
            <span>{iconOf(l.code)} {l.name} <span className="muted">× {l.quantity}</span></span>
            <span>{baht(l.lineTotal)}</span>
          </div>
        ))}
      </div>
      <div className="rtotal"><span>ยอดชำระ</span><strong>{baht(receipt.total)}</strong></div>
    </div>
  );
}
