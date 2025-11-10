import { type PropsWithChildren } from 'react';
import { Toast } from 'react-bootstrap';
import type { ToastRecord } from './types';

interface ToastItemProps extends PropsWithChildren {
    toast: ToastRecord;
    onClose: () => void;
}

export function ToastItem({ toast: { id, title, body, bg, autohide, delay, headerRight, role }, onClose }: ToastItemProps) {
    return (
        <Toast
            key={id}
            className={`toast-${bg}`}
            autohide={autohide}
            delay={delay}
            onClose={onClose}
            role={role}
        >
            <Toast.Header closeButton closeVariant="dark">
                {headerRight}
                <strong className="me-auto">{title}</strong>
            </Toast.Header>
            <Toast.Body>{body}</Toast.Body>
        </Toast>
    );
}