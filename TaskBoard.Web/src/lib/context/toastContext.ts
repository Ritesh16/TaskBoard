import { createContext } from 'react';
import type { ToastAPI } from './types';

export const ToastContext = createContext<ToastAPI | null>(null);

export function generateToastId(): string {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto 
        ? crypto.randomUUID() 
        : `${Date.now()}-${Math.random()}`;
}