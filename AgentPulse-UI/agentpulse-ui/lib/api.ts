export const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/backend';
export type JsonRecord = Record<string, unknown>;
export async function api<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path.startsWith('/') ? path : `/${path}`}`, { ...init, cache: 'no-store', headers: { ...(init?.body ? { 'Content-Type': 'application/json' } : {}), ...init?.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(typeof body?.detail === 'string' ? body.detail : `Backend request failed (${response.status})`);
  return body as T;
}
export function recordsFrom(payload: unknown): JsonRecord[] {
  if (Array.isArray(payload)) return payload.filter((x): x is JsonRecord => !!x && typeof x === 'object');
  if (payload && typeof payload === 'object') {
    const obj = payload as JsonRecord;
    for (const key of ['events', 'items', 'results', 'data', 'records', 'history']) if (Array.isArray(obj[key])) return (obj[key] as unknown[]).filter((x): x is JsonRecord => !!x && typeof x === 'object');
  }
  return [];
}
export function value(record: JsonRecord, ...keys: string[]): string {
  for (const key of keys) { const v = record[key]; if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v); }
  return '—';
}
