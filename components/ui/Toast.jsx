'use client';

/**
 * Toast.jsx
 * Simple bottom-center toast notification.
 * Usage: import { useToast } from './Toast'; const { showToast } = useToast();
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ visible: false, message: '' });
  const timerRef = { current: null };

  const showToast = useCallback((message, duration = 2200) => {
    setToast({ visible: true, message });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div role="status" aria-live="polite" aria-atomic="true" className={`toast ${toast.visible ? 'visible' : ''}`}  >
        {toast.message}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}