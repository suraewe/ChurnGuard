import { useState, useEffect, useCallback } from 'react';

let toastIdCounter = 0;
const listeners = new Set();
let toasts = [];

export const toast = {
  success: (msg) => addToast(msg, 'success'),
  error: (msg) => addToast(msg, 'error'),
  info: (msg) => addToast(msg, 'info'),
};

const addToast = (message, type) => {
  const id = ++toastIdCounter;
  toasts = [...toasts, { id, message, type }];
  listeners.forEach((fn) => fn([...toasts]));
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((fn) => fn([...toasts]));
  }, 4000);
};

const icons = {
  success: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  error: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  info: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

const colors = {
  success: { icon: '#34C759', bg: 'rgba(52,199,89,0.12)' },
  error: { icon: '#FF3B30', bg: 'rgba(255,59,48,0.12)' },
  info: { icon: '#007AFF', bg: 'rgba(0,122,255,0.12)' },
};

const ToastItem = ({ toast: t, onRemove }) => {
  const c = colors[t.type] || colors.info;
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium animate-slide-down"
      style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        minWidth: '300px',
        maxWidth: '420px',
      }}>
      <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: c.bg, color: c.icon }}>
        {icons[t.type]}
      </span>
      <span className="flex-1" style={{ color: 'var(--text-primary)' }}>{t.message}</span>
      <button onClick={() => onRemove(t.id)} className="ml-2 opacity-40 hover:opacity-100 transition-opacity"
        style={{ color: 'var(--text-tertiary)' }}>×</button>
    </div>
  );
};

export const ToastContainer = () => {
  const [activeToasts, setActiveToasts] = useState([]);
  useEffect(() => { listeners.add(setActiveToasts); return () => listeners.delete(setActiveToasts); }, []);
  const remove = useCallback((id) => { toasts = toasts.filter((t) => t.id !== id); setActiveToasts([...toasts]); }, []);
  if (!activeToasts.length) return null;
  return (
    <div className="fixed top-16 right-6 z-50 flex flex-col gap-3">
      {activeToasts.map((t) => <ToastItem key={t.id} toast={t} onRemove={remove} />)}
    </div>
  );
};
