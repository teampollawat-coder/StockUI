"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api";
import PageHeader from "../components/PageHeader";
import { DataCard, SchemaCard, type Table } from "../components/TableView";

type Db = { provider: string; tables: Table[] };

export default function DatabasePage() {
  const [db, setDb] = useState<Db | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch(`/api/db`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      setDb(await res.json());
      setError(null);
    } catch {
      setError("ไม่สามารถอ่านข้อมูลฐานข้อมูลจาก backend ได้ (เปิดใช้เฉพาะโหมด Development)");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <main>
      <PageHeader
        logo="🗄️"
        title="ฐานข้อมูล"
        tagline={`Schema และข้อมูลทุกตาราง${db ? ` · ${db.provider?.split(".").pop()} · ${db.tables.length} ตาราง` : ""}`}
      >
        <Link href="/" className="pill navlink">← กลับหน้าร้าน</Link>
      </PageHeader>

      {error && <div className="msg err">{error}</div>}

      {db && (
        <>
          <div className="tabs table-tabs">
            {db.tables.map((t) => (
              <a key={t.name} href={`#table-${t.name}`} className="tab">
                {t.name} <span className="count">{t.rowCount}</span>
              </a>
            ))}
          </div>

          {db.tables.map((t) => (
            <section key={t.name} id={`table-${t.name}`}>
              <SchemaCard table={t} />
              <DataCard table={t} />
            </section>
          ))}
        </>
      )}
    </main>
  );
}
