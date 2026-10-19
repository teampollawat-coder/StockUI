"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StockTable, { LOW, type StockProduct } from "../components/StockTable";
import { baht } from "../lib/format";

type Filter = "all" | "low" | "out";

export default function StockPage() {
  const [products, setProducts] = useState<StockProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [updated, setUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch(`/api/products`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      setProducts(await res.json());
      setUpdated(new Date());
      setError(null);
    } catch {
      setError("ไม่สามารถเชื่อมต่อ backend ได้");
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 3000);
    return () => clearInterval(timer);
  }, [load]);

  const rows = products.filter(
    (p) =>
      (filter === "all" || (filter === "out" ? p.stock === 0 : p.stock > 0 && p.stock <= LOW)) &&
      (p.name + p.code).toLowerCase().includes(query.trim().toLowerCase()),
  );
  const outCount = products.filter((p) => p.stock === 0).length;
  const lowCount = products.filter((p) => p.stock > 0 && p.stock <= LOW).length;
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);
  const totalValue = products.reduce((s, p) => s + p.stock * p.price, 0);

  return (
    <main>
      <PageHeader
        logo="📦"
        title="สต็อกสินค้า"
        tagline={`สินค้าทั้งหมด · อัปเดตอัตโนมัติ${updated ? ` · ล่าสุด ${updated.toLocaleTimeString("th-TH")}` : ""}`}
      >
        <Link href="/database" className="pill navlink">🗄️ ฐานข้อมูล</Link>
        <Link href="/" className="pill navlink">← กลับหน้าร้าน</Link>
      </PageHeader>

      {error && <div className="msg err">{error}</div>}

      <div className="stats">
        <StatCard label="รายการสินค้า">{products.length}</StatCard>
        <StatCard label="จำนวนคงเหลือรวม">{totalUnits.toLocaleString("th-TH")} ชิ้น</StatCard>
        <StatCard label="มูลค่าสต็อก">{baht(totalValue)}</StatCard>
        <StatCard label="ใกล้หมด / หมด">{lowCount} / {outCount}</StatCard>
      </div>

      <div className="card">
        <div className="toolbar">
          <input
            className="search"
            placeholder="ค้นหาชื่อหรือรหัสสินค้า"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="tabs">
            {([["all", "ทั้งหมด"], ["low", "ใกล้หมด"], ["out", "หมด"]] as const).map(([k, label]) => (
              <button key={k} className={filter === k ? "tab active" : "tab"} onClick={() => setFilter(k)}>{label}</button>
            ))}
          </div>
        </div>

        <StockTable rows={rows} />
      </div>
    </main>
  );
}
