import { useContext } from 'react';
import { ToastContext } from './context';
import type { ToastAPI } from './types';

export function useToast(): ToastAPI {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
    return ctx;
}