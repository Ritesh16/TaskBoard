import { z } from 'zod';

export const taskDetailSchema = z.object({
  taskId: z.number().optional(),
  
  categoryId: z.number().optional(),
  
  details: z.string().optional(),
  
});

export type TaskDetailFormData = z.infer<typeof taskDetailSchema>;
