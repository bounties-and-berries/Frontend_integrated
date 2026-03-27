import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Toast, { ToastType } from '@/components/Toast';

interface ToastContextData {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toastConfig, setToastConfig] = useState<{
    visible: boolean;
    message: string;
    type: ToastType;
  }>({
    visible: false,
    message: '',
    type: 'info',
  });

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    // If a toast is already shown, hide it first then show new one to restart animation
    if (toastConfig.visible) {
      setToastConfig((prev) => ({ ...prev, visible: false }));
      setTimeout(() => {
        setToastConfig({ visible: true, message, type });
      }, 350);
    } else {
      setToastConfig({ visible: true, message, type });
    }
  }, [toastConfig.visible]);

  const hideToast = useCallback(() => {
    setToastConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast 
        visible={toastConfig.visible} 
        message={toastConfig.message} 
        type={toastConfig.type} 
        onHide={hideToast} 
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
