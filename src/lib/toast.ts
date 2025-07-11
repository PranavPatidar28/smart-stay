import toast from 'react-hot-toast';

/**
 * Toast utility functions for displaying notifications throughout the app
 */

// Show a success toast
export const showSuccess = (message: string) => {
  return toast.success(message);
};

// Show an error toast
export const showError = (message: string) => {
  return toast.error(message);
};

// Show a loading toast that can be updated
export const showLoading = (message: string) => {
  return toast.loading(message);
};

// Update a loading toast to success
export const updateToSuccess = (toastId: string, message: string) => {
  toast.dismiss(toastId);
  return toast.success(message);
};

// Update a loading toast to error
export const updateToError = (toastId: string, message: string) => {
  toast.dismiss(toastId);
  return toast.error(message);
};

// Dismiss a toast
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

// Get the toast instance for more complex operations
export const getToast = () => toast; 