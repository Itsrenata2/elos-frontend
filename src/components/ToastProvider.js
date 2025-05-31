"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componente para o ToastContainer
export default function ToastProvider() {
  return (
    <ToastContainer
      position="bottom-right" // Posição padrão para todos os toasts
      autoClose={5000} // Fecha automaticamente após 5 segundos
      hideProgressBar={false}
      newestOnTop={true} // Novas notificações aparecem no topo das antigas
      closeOnClick // Fecha ao clicar
      rtl={false} // Suporte a idiomas da direita para a esquerda
      pauseOnFocusLoss // Pausa o timer se a janela perder o foco
      draggable // Pode arrastar para fechar
      pauseOnHover // Pausa o timer ao passar o mouse
      theme="colored" // Usa os temas de cor padrão (success, error, info, etc.)
    />
  );
}
