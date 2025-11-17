import { z } from 'zod';
import { requiredString } from '../util/util';

export const addTaskTitleSchema = z.object({
    title: requiredString('title')
});

export type AddTaskTitleSchema = z.infer<typeof addTaskTitleSchema>;