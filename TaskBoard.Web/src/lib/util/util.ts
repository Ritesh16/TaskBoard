import z from "zod";
import { type DateArg, format } from "date-fns";

export const requiredString = (fieldName: string) => z
    .string({ required_error: `${fieldName} is required` })
    .min(1, { message: `${fieldName} is required` });

export function formatDate(date?: DateArg<Date>) {
    if(!date) return "";

    return format(date, 'dd MMM yyyy h:mm a');
}

// export const formatToYMD = (val: Date | string | null | undefined): string | null => {
//   debugger;
//   if (!val) return null;
//   const d = val instanceof Date ? val : new Date(val as string);
//   if (isNaN(d.getTime())) return null;
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, '0');
//   const dd = String(d.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// };

export const formatToYMD = (val: Date | null | undefined): string | null => {
  if (!val) return null;
  const yyyy = val.getFullYear();               // local date (what user picked)
  const mm = String(val.getMonth() + 1).padStart(2, '0');
  const dd = String(val.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
