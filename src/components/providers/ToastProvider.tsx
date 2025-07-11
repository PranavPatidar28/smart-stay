"use client";

import { Toaster, ToastPosition } from 'react-hot-toast';

type ToastProviderProps = {
  position?: ToastPosition;
  reverseOrder?: boolean;
};

export default function ToastProvider({
  position = 'top-right',
  reverseOrder = false,
}: ToastProviderProps) {
  return (
    <Toaster
      position={position}
      reverseOrder={reverseOrder}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        className: 'bg-white shadow-lg rounded-xl p-4 border border-gray-100',
        duration: 5000,
        success: {
          className: 'bg-white border-l-4 border-l-green-500 shadow-lg rounded-xl p-4',
          iconTheme: {
            primary: '#10B981',
            secondary: '#FFFFFF',
          },
          duration: 3000,
        },
        error: {
          className: 'bg-white border-l-4 border-l-red-500 shadow-lg rounded-xl p-4',
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
          duration: 4000,
        },
        loading: {
          className: 'bg-white border-l-4 border-l-blue-500 shadow-lg rounded-xl p-4',
          iconTheme: {
            primary: '#3B82F6',
            secondary: '#FFFFFF',
          },
          duration: 10000,
        },
      }}
    />
  );
} 