"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "./api";
import CartPanel from "./components/CartPanel";
import PageHeader from "./components/PageHeader";
import ProductCard, { type Product } from "./components/ProductCard";
import type { Receipt } from "./components/ReceiptCard";

const getClientId = () => {
  let id = localStorage.getItem("clientId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("clientId", id);
  }
  return id;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({}); // code -> quantity
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [busy, setBusy] = useState(false);
  const [pick, setPick] = useState<Record<string, number>>({}); // จำนวนที่เลือกก่อนกดเพิ่มลงตะกร้า (ค่าเริ่มต้น 1)
  const [selecting, setSelecting] = useState(false); // โหมดเลือกรายการเพื่อลบ
  const [selected, setSelected] = useState<Set<string>>(new Set()); // รายการที่ติ๊กเลือกในตะกร้า

  const load = useCallback(async () => {
    try {
      const res = await apiFetch(`/api/products`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      setProducts(await res.json());
    } catch {
      setError("ไม่สามารถเชื่อมต่อ backend ได้");
    }
  }, []);

  useEffect(() => {
    load();
    // กู้ตะกร้าที่จองไว้ (สต็อกถูกหักไปแล้ว) หลังรีเฟรชหน้า
    apiFetch(`/api/cart/${getClientId()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((items: { code: string; quantity: number }[]) =>
        setCart(Object.fromEntries(items.map((i) => [i.code, i.quantity]))))
      .catch(() => {});
    // ดึงสต็อกล่าสุดเป็นระยะ เพื่อให้เห็นการเปลี่ยนแปลงจากผู้ใช้อื่น
    const timer = setInterval(load, 3000);
    return () => clearInterval(timer);
  }, [load]);

  const byCode = useMemo(() => Object.fromEntries(products.map((p) => [p.code, p])), [products]);
  const cartLines = Object.entries(cart)
    .filter(([code]) => byCode[code])
    .map(([code, qty]) => ({ product: byCode[code], qty }));
  const itemCount = cartLines.reduce((n, l) => n + l.qty, 0);

  // เปลี่ยนจำนวนในตะกร้า: backend ตัด/คืนสต็อกส่วนต่างทันที (0 = ลบออก)
  const setQty = async (code: string, qty: number) => {
    setReceipt(null);
    setError(null);
    let ok = false;
    try {
      const res = await apiFetch(`/api/cart/${getClientId()}/items/${code}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: Math.max(qty, 0) }),
      });
      if (!res.ok) setError((await res.json()).error ?? "อัปเดตตะกร้าไม่สำเร็จ");
      else {
        ok = true;
        setCart((c) => {
          const next = { ...c };
          if (qty <= 0) delete next[code];
          else next[code] = qty;
          return next;
        });
      }
    } catch {
      setError("ไม่สามารถเชื่อมต่อ backend ได้");
    }
    await load();
    return ok;
  };

  const addToCart = async (p: Product, inCart: number) => {
    const n = Math.min(Math.max(pick[p.code] ?? 1, 1), p.stock);
    if (await setQty(p.code, inCart + n)) setPick((x) => ({ ...x, [p.code]: 1 }));
  };

  // ลบหลายรายการพร้อมกัน: คืนสต็อกทีละรายการ แล้วรีเฟรชครั้งเดียว
  const removeMany = async (codes: string[]) => {
    if (codes.length === 0) return;
    setBusy(true);
    setReceipt(null);
    setError(null);
    try {
      for (const code of codes) {
        const res = await apiFetch(`/api/cart/${getClientId()}/items/${code}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: 0 }),
        });
        if (!res.ok) throw new Error();
        setCart((c) => {
          const next = { ...c };
          delete next[code];
          return next;
        });
      }
      setSelected(new Set());
      setSelecting(false);
    } catch {
      setError("ลบสินค้าไม่สำเร็จ");
    } finally {
      await load();
      setBusy(false);
    }
  };

  const cancelSelect = () => {
    setSelecting(false);
    setSelected(new Set());
  };

  const toggle = (code: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (!next.delete(code)) next.add(code);
      return next;
    });

  const checkout = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: getClientId() }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "ชำระเงินไม่สำเร็จ");
      else {
        setReceipt(data);
        setCart({});
      }
    } catch {
      setError("ไม่สามารถเชื่อมต่อ backend ได้");
    } finally {
      await load(); // รีเฟรชสต็อกล่าสุด
      setBusy(false);
    }
  };

  const resetStock = async () => {
    await apiFetch(`/api/stock/reset`, { method: "POST" });
    setCart({});
    setReceipt(null);
    setError(null);
    load();
  };

  return (
    <main>
      <PageHeader logo="🛒" title="ร้านค้า">
        <Link href="/stock" className="pill navlink">📦 สต็อกสินค้า</Link>
        <Link href="/database" className="pill navlink">🗄️ ฐานข้อมูล</Link>
        <div className="pill">ตะกร้า <b>{itemCount}</b></div>
      </PageHeader>
      {error && <div className="msg err">{error}</div>}
      <div className="layout">
        <section>
          <div className="grid">
            {products.map((p) => (
              <ProductCard
                key={p.code}
                product={p}
                inCart={cart[p.code] ?? 0}
                pick={pick[p.code] ?? 1}
                onPick={(v) => setPick((x) => ({ ...x, [p.code]: v }))}
                onAdd={() => addToCart(p, cart[p.code] ?? 0)}
              />
            ))}
          </div>
          <div className="footer">
            <button className="link" onClick={resetStock}>รีเซ็ตสต็อก (mock)</button>
          </div>
        </section>

        <CartPanel
          lines={cartLines}
          receipt={receipt}
          busy={busy}
          selecting={selecting}
          selected={selected}
          onCloseReceipt={() => setReceipt(null)}
          onStartSelect={() => setSelecting(true)}
          onCancelSelect={cancelSelect}
          onToggle={toggle}
          onSelectAll={(all) => setSelected(all ? new Set(cartLines.map((l) => l.product.code)) : new Set())}
          onSetQty={setQty}
          onRemoveSelected={removeMany}
          onCheckout={checkout}
        />
      </div>
    </main>
  );
}
