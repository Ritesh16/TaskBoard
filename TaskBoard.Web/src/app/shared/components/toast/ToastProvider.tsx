import { useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { ToastContainer } from 'react-bootstrap';
import { CheckCircle, Info, AlertTriangle, XOctagon } from 'react-feather';
import { ToastContext, generateToastId } from './context';
import { ToastItem } from './ToastItem';
import type { ToastOptions, ToastRecord, ToastPosition } from './types';
import './toast.css';

interface ToastProviderProps extends PropsWithChildren {
    position?: ToastPosition;
    defaultDelay?: number;
}

export function ToastProvider({
    children,
    position = 'bottom-end',
    defaultDelay = 3000,
}: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastRecord[]>([]);

    const remove = useCallback((id: string) => {
        setToasts((t) => t.filter((x) => x.id !== id));
    }, []);

    const push = useCallback(
        (toast: ToastOptions) => {
            const id = toast.id ?? generateToastId();
            const item: ToastRecord = {
                id,
                title: toast.title ?? 'Notification',
                body: toast.body,
                bg: toast.bg ?? 'dark',
                autohide: toast.autohide ?? true,
                delay: toast.delay ?? defaultDelay,
                headerRight: toast.headerRight,
                role: toast.role ?? (toast.bg === 'danger' ? 'alert' : 'status'),
            };
            setToasts((t) => [...t, item]);
            return id;
        },
        [defaultDelay]
    );

    const api = useMemo(
        () => ({
            success: (msg: ToastOptions['body'], opts?: Omit<ToastOptions, 'body' | 'bg'>) => push({
                body: msg,
                bg: 'light',
                headerRight: <CheckCircle className="toast-icon text-success" size={18} />,
                ...opts
            }),
            error: (msg: ToastOptions['body'], opts?: Omit<ToastOptions, 'body' | 'bg'>) => push({
                body: msg,
                bg: 'light',
                headerRight: <XOctagon className="toast-icon text-danger" size={18} />,
                ...opts
            }),
            info: (msg: ToastOptions['body'], opts?: Omit<ToastOptions, 'body' | 'bg'>) => push({
                body: msg,
                bg: 'light',
                headerRight: <Info className="toast-icon text-info" size={18} />,
                ...opts
            }),
            warn: (msg: ToastOptions['body'], opts?: Omit<ToastOptions, 'body' | 'bg'>) => push({
                body: msg,
                bg: 'light',
                headerRight: <AlertTriangle className="toast-icon text-warning" size={18} />,
                ...opts
            }),
            push,
            remove,
            clear: () => setToasts([]),
        }),
        [push, remove]
    );

    return (
        <ToastContext.Provider value={api}>
            {children}
            <ToastContainer position={position} className="p-3">
                {toasts.map((toast) => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onClose={() => remove(toast.id)}
                    />
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
}