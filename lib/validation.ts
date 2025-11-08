// Decimal helpers and basic validations for personal expenses

// Accepts positive decimal numbers with up to 2 decimal places
// Examples: "0.01", "12", "12.3", "12.30". Rejects negatives and more than 2dp.
const TWO_DP_RE = /^(?:\d+)(?:\.(\d{1,2}))?$/;

export function isAmount2dp(input: string): boolean {
  const s = (input ?? "").trim();
  if (!s) return false;
  if (!TWO_DP_RE.test(s)) return false;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0;
}

export function to2dpNumber(input: string): number {
  const n = Number((input ?? "").trim());
  if (!Number.isFinite(n)) return NaN;
  return Math.round(n * 100) / 100;
}

export function isRequiredDate(d: Date | undefined): boolean {
  return !!d && !Number.isNaN(d.getTime());
}

