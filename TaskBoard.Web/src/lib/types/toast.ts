import type { JSX } from 'react';

export type ToastVariant =
  | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

export type ToastOptions = {
  id?: string;
  title?: string;
  body: string | JSX.Element;
  bg?: ToastVariant;
  autohide?: boolean;
  delay?: number;
  headerRight?: JSX.Element;
  role?: 'status' | 'alert';
};

export type ToastRecord = Required<Pick<ToastOptions, 'id'>> & ToastOptions;

export type ToastAPI = {
  success: (msg: ToastOptions['body'], opts?: Omit<ToastOptions, 'body' | 'bg'>) => string;
  error: (msg: ToastOptions['body'], opts?: Omit<ToastOptions, 'body' | 'bg'>) => string;
  info: (msg: ToastOptions['body'], opts?: Omit<ToastOptions, 'body' | 'bg'>) => string;
  warn: (msg: ToastOptions['body'], opts?: Omit<ToastOptions, 'body' | 'bg'>) => string;
  push: (opts: ToastOptions) => string;
  remove: (id: string) => void;
  clear: () => void;
};

export type ToastPosition = 'top-start' | 'top-center' | 'top-end' | 
  'middle-start' | 'middle-center' | 'middle-end' | 
  'bottom-start' | 'bottom-center' | 'bottom-end';