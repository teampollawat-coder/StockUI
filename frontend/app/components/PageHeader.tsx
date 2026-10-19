import type { ReactNode } from "react";

export default function PageHeader({
  logo,
  title,
  tagline,
  children,
}: {
  logo: string;
  title: string;
  tagline?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo">{logo}</div>
        <div>
          <h1>{title}</h1>
          {tagline && <p className="tagline">{tagline}</p>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>{children}</div>
    </header>
  );
}
