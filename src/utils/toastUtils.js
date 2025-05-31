"use client";

import { toast } from "react-toastify";

const showSuccessToast = (message) => {
  toast.success(message); // Usa as configurações padrão do ToastContainer
};

const showErrorToast = (message) => {
  toast.error(message); // Usa as configurações padrão do ToastContainer
};

const showInfoToast = (message) => {
  toast.info(message); // Usa as configurações padrão do ToastContainer
};

const showWarningToast = (message) => {
  toast.warn(message); // Usa as configurações padrão do ToastContainer
};

// Você pode exportar um objeto ou funções individuais
export const notify = {
  success: showSuccessToast,
  error: showErrorToast,
  info: showInfoToast,
  warn: showWarningToast,
  // Para toasts genéricos sem tipo específico (com o tema padrão)
  default: (message) => toast(message),
};

// Ou você pode exportar um hook, se preferir
// export function useToasts() {
//   return {
//     success: showSuccessToast,
//     error: showErrorToast,
//     info: showInfoToast,
//     warn: showWarningToast,
//     default: (message) => toast(message),
//   };
// }
