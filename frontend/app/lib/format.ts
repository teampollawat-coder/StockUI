export const baht = (n: number) => n.toLocaleString("th-TH", { minimumFractionDigits: 2 }) + " ฿";

export const ICONS: Record<string, string> = {
  P001: "🖊️", P002: "📓", P003: "✏️", P004: "🧽", P005: "📁", P006: "🧮", P007: "📄", P008: "🎞️",
};

export const iconOf = (code: string) => ICONS[code] ?? "📦";
