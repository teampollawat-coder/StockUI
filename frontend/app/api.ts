const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5104";

// fetch ไป backend พร้อม console.log ทุกครั้งที่ยิง API (method, path, status, เวลาที่ใช้)
export async function apiFetch(path: string, init?: RequestInit) {
  const method = init?.method ?? "GET";
  const started = performance.now();
  console.log(`[API] → ${method} ${path}`, init?.body ? JSON.parse(String(init.body)) : "");
  try {
    const res = await fetch(`${API}${path}`, init);
    console.log(`[API] ← ${method} ${path} ${res.status} (${Math.round(performance.now() - started)}ms)`);
    return res;
  } catch (e) {
    console.error(`[API] ✗ ${method} ${path} เชื่อมต่อไม่ได้`, e);
    throw e;
  }
}
