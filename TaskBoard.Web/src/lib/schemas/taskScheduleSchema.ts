import { z } from 'zod';

export const taskScheduleSchema = z.object({
  taskId: z.number().optional(),
  startDate: z.union([z.date(), z.string()]).nullable().optional(),
  oneTimeOption: z.string().nullable().optional(),
  repeat: z.enum(['OneTime', 'Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom']).optional(),
  customRepeat: z.string().optional(),
  customUnit: z.enum(['days','weeks','months','years']).optional(),
  selectedDays: z.array(z.number()).optional(),
  endType: z.enum(['never', 'endDate', 'endAfter']).optional(),
  endDate: z.union([z.date(), z.string()]).nullable().optional(),
  endAfter: z.string().optional(),
});

export type TaskScheduleSchema = z.infer<typeof taskScheduleSchema>;