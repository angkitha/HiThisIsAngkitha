export const FALLBACK_TIME_ZONE = "America/Los_Angeles";

export type VisitorClock = {
  date: string;
  time: string;
};

function resolveVisitorTimeZone(): string {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!timeZone) return FALLBACK_TIME_ZONE;
    new Intl.DateTimeFormat("en-US", { timeZone }).format(new Date());
    return timeZone;
  } catch {
    return FALLBACK_TIME_ZONE;
  }
}

function readPart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return parts.find((part) => part.type === type)?.value ?? "";
}

export function formatVisitorClock(now = new Date(), timeZone = resolveVisitorTimeZone()): VisitorClock {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now);

    const month = readPart(parts, "month").replace(".", "").toUpperCase();
    const day = readPart(parts, "day");
    const year = readPart(parts, "year");
    const hour = readPart(parts, "hour").padStart(2, "0");
    const minute = readPart(parts, "minute").padStart(2, "0");
    const second = readPart(parts, "second").padStart(2, "0");

    return {
      date: `${month} ${day}, ${year}`,
      time: `${hour}:${minute}:${second}`,
    };
  } catch {
    if (timeZone !== FALLBACK_TIME_ZONE) {
      return formatVisitorClock(now, FALLBACK_TIME_ZONE);
    }
    return { date: "", time: "" };
  }
}
