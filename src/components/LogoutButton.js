// components/LogoutButton.js
"use client"; // Este componente precisa ser executado no lado do cliente

import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi"; // Assumindo que você usa react-icons para o ícone de logout

/**
 * Componente de botão de logout reutilizável.
 * Remove o token de autenticação do localStorage e redireciona para a página de login.
 *
 * @param {object} props - As propriedades do componente.
 * @param {string} [props.className] - Classes CSS adicionais para estilizar o botão.
 * @param {boolean} [props.showIcon=true] - Define se o ícone de logout deve ser exibido.
 * @param {string} [props.text="Sair"] - O texto a ser exibido no botão.
 */
export default function LogoutButton({
  className = "",
  showIcon = true,
  text = "Sair",
}) {
  const router = useRouter();

  const handleLogout = () => {
    // Garante que estamos no ambiente do navegador antes de tentar acessar localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken"); // Remove o token do localStorage
    }

    // Mantendo o alerta e o redirecionamento como você já tinha
    alert("Sessão encerrada! Redirecionando para o login...");
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      // Replicando o estilo do seu botão de logout original na HistoryPage
      className={`flex items-center p-3 rounded-md text-sm font-semibold transition-colors
                  bg-zinc-700 text-white hover:bg-zinc-800
                  ${className}`} // Permite adicionar classes externas para personalização
    >
      {showIcon && <FiLogOut className="mr-3 text-lg" />}
      {text}
    </button>
  );
}
