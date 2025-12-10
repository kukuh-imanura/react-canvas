// utils/perlin.ts
// Simplex noise sederhana (cukup untuk terrain)
export function perlin(x: number, y: number) {
  return Math.sin(x * 0.1) * Math.cos(y * 0.1);
}
