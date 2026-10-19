import type { ReactNode } from "react";

export default function StatCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="card stat"><span className="muted">{label}</span><strong>{children}</strong></div>
  );
}
