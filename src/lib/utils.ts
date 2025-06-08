import { isValid, parse } from "date-fns";

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
