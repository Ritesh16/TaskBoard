import z from "zod";
import { type DateArg, format } from "date-fns";

export const requiredString = (fieldName: string) => z
    .string({ required_error: `${fieldName} is required` })
    .min(1, { message: `${fieldName} is required` });

export function formatDate(date?: DateArg<Date>) {
    if(!date) return "";

    return format(date, 'dd MMM yyyy h:mm a');
}