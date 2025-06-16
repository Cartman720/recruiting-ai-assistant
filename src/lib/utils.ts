import { isValid, parse } from "date-fns";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function parseDate(date?: string | null | undefined) {
  if (!date) {
    return undefined;
  }

  const parsedDate = parse(date, "dd/MM/yyyy", new Date());

  if (isValid(parsedDate)) {
    return parsedDate;
  }

  return undefined;
}

export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(...inputs));
}

export default cn;
