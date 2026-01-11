import { z } from 'zod';
import { requiredString } from '../util/util';

export const addCategorySchema = z.object({
    name: requiredString('Name'),
    description: z.string().nullable()
});

export type AddCategorySchema = z.infer<typeof addCategorySchema>;