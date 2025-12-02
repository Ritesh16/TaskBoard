import { z } from 'zod';

export const taskScheduleSchema = z.object({
  taskId: z.number()
    .min(1, 'Task ID is required'),
  
  frequency: z.number()
    .min(1, 'Frequency is required'),
  
  categoryId: z.number()
    .min(1, 'Category is required'),
  
  details: z.string()
    .max(2000, 'Details must not exceed 2000 characters'),
  
});

export type TaskDetailFormData = z.infer<typeof taskScheduleSchema>;