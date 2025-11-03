import { z } from 'zod';
import { requiredString } from '../util/util';

export const loginSchema = z.object({
    email: requiredString('Email'),
    password: requiredString('Password')
});

export type LoginSchema = z.infer<typeof loginSchema>;