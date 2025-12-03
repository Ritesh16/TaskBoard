import { z } from 'zod';

export const taskScheduleSchema = z.object({
  taskId: z.number().optional(),
  startDate: z.date().nullable().optional(),
  quick: z.string().nullable().optional(),
  repeat: z.enum(['None', 'Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom']).default('None'),
  customRepeat: z.string().optional().default(''),
  customUnit: z.enum(['days','weeks','months','years']).default('days'),
  selectedDays: z.array(z.number()).optional().default([]),
});

export type TaskScheduleSchema = z.infer<typeof taskScheduleSchema>;