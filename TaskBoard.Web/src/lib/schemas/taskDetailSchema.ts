import { z } from 'zod';

export const taskDetailSchema = z.object({
  taskId: z.number()
    .min(1, 'Task ID is required'),
  
  title: z.string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  
  categoryId: z.number()
    .min(1, 'Category is required'),
  
  details: z.string()
    .max(2000, 'Details must not exceed 2000 characters'),
  
});

export type TaskDetailFormData = z.infer<typeof taskDetailSchema>;
