import z from "zod";
import { type DateArg, format } from "date-fns";

export const requiredString = (fieldName: string) => z
    .string({ required_error: `${fieldName} is required` })
    .min(1, { message: `${fieldName} is required` });

export function formatDate(date?: DateArg<Date>) {
    if(!date) return "";

    return format(date, 'dd MMM yyyy h:mm a');
}

export const formatToYMD = (val: Date | string | null | undefined): string | null => {
  if (!val) return null;
  const d = val instanceof Date ? val : new Date(val as string);
  if (isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};