import { z } from 'zod';
import { requiredString } from '../util/util';

export const passwordSchema = z.string()
  .min(6, 'Password must be at least 6 characters')
  .max(20, 'Password must be at most 20 characters');

export const registerSchema = z.object({
    name: requiredString('name'),
    email: z.email(),
    password: passwordSchema,
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type RegisterSchema = z.infer<typeof registerSchema>;