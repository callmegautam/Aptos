export function parseId(id: string): number | null {
  const n = parseInt(id, 10);
  return Number.isNaN(n) || n <= 0 ? null : n;
}
