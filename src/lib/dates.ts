/**
 * Dates are stored as `YYYY-MM` and shown as "Month Year".
 */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** "2026-05" → "May 2026". */
export function formatMonth(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");
  return `${MONTHS[Number(month) - 1]} ${year}`;
}

/** "2026-05" → "May". */
export function monthName(yearMonth: string): string {
  return MONTHS[Number(yearMonth.split("-")[1]) - 1];
}
