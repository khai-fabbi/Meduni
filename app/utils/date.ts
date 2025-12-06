import dayjs from "dayjs";

export const DATE_FORMAT = {
  DOT: "YYYY.MM.DD", // Dotted format
  SLASH: "YYYY/MM/DD", // Slash format
  DASH: "YYYY-MM-DD", // ISO-like format
  TIME: "HH:mm:ss", // Time only
  COMPACT: "YYYYMMDD",
  YEAR: "YYYY",
  DATE_TIME: "YYYY/MM/DD HH:mm:ss",
  DATE_TIME_PRELINE: "YYYY/MM/DD\nHH:mm",
};

export function formatDate(
  date: Date | string,
  format = DATE_FORMAT.DASH,
): string {
  if (!date) return "";
  const d = dayjs(date);

  return d.isValid() ? d.format(format) : "";
}
