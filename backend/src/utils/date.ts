export function getToday(timezone: string): string {
  try {
    return new Date().toLocaleDateString("en-CA", { timeZone: timezone }); // YYYY-MM-DD
  } catch {
    return new Date().toISOString().slice(0, 10); // invalid timezone string
  }
}
