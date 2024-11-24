import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

// Toast Utility Component
const Toast = () => {
  return <Toaster position="top-center" reverseOrder={false} />;
};

// Export reusable toast functions
export const showToast = {
  success: (message: string) =>
    toast.success(message, {
      style: { background: '#4caf50', color: '#fff' },
      duration: 3000,
    }),
  error: (message: string) =>
    toast.error(message, {
      style: { background: '#f44336', color: '#fff' },
      duration: 3000,
    }),
  info: (message: string) =>
    toast(message, {
      style: { background: '#2196f3', color: '#fff' },
      duration: 3000,
    }),
};

export default Toast;
