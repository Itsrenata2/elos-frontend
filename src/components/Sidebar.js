// components/Sidebar.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton"; // Importe seu LogoutButton
import {
  FiPlus,
  FiList,
  FiCalendar, // FiCalendar não é usado diretamente na sidebar mas pode ser mantido se for para fins de ícones gerais
  FiMapPin, // FiMapPin não é usado diretamente na sidebar
} from "react-icons/fi";

/**
 * Componente de barra lateral de navegação.
 * Gerencia a navegação e o estado do link ativo.
 */
export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Para acessar os parâmetros da URL

  // Função para determinar as classes de estilo do link ativo
  const getLinkClasses = (linkPath, typeParam = null) => {
    // Verifica se o pathname atual corresponde ao caminho do link
    const isActivePath = router.pathname === linkPath;

    // Se houver um typeParam (para links de /records), verifica também o parâmetro 'type' na URL
    const isTypeActive = typeParam
      ? searchParams.get("type") === typeParam
      : searchParams.get("type") === null && router.pathname === "/records"; // Para "Exibir tudo" em /records

    // Lógica para determinar se o link está ativo
    const isActive =
      (linkPath === "/records" && isTypeActive) || // Para o link "Exibir tudo"
      (linkPath === "/records" && typeParam !== null && isTypeActive) || // Para links de filtro de tipo em /records
      (linkPath !== "/records" && isActivePath); // Para links de páginas distintas

    return `flex items-center p-3 rounded-md text-sm font-semibold transition-colors
      ${
        isActive ? "bg-zinc-800 text-white" : "text-zinc-800 hover:bg-zinc-300"
      }`;
  };

  return (
    <aside className="w-64 bg-zinc-100 p-6 flex flex-col shadow-md">
      <div>
        <div className="mb-8">
          <img src="/logo-elos.svg" alt="Elos Logo" className="h-10 mx-auto" />
        </div>
        <nav className="space-y-2">
          {/* Link para Nova Denúncia */}
          <Link href="/complaints" className={getLinkClasses("/complaints")}>
            <FiPlus className="mr-3 text-lg" />
            Nova denúncia
          </Link>

          {/* Link para Denúncias feitas */}
          <Link
            href="/records?type=denuncia"
            className={getLinkClasses("/records", "denuncia")}
          >
            <FiList className="mr-3 text-lg" />
            Denúncias feitas
          </Link>

          <div className="border-t border-zinc-300 my-4"></div>

          {/* Link para Nova Solicitação */}
          <Link
            href="/new-solicitacao"
            className={getLinkClasses("/new-solicitacao")}
          >
            <FiPlus className="mr-3 text-lg" />
            Nova solicitação
          </Link>

          {/* Link para Solicitações feitas */}
          <Link
            href="/records?type=solicitacao"
            className={getLinkClasses("/records", "solicitacao")}
          >
            <FiList className="mr-3 text-lg" />
            Solicitações feitas
          </Link>

          <div className="border-t border-zinc-300 my-4"></div>

          {/* Link para Exibir tudo */}
          <Link
            href="/records"
            className={getLinkClasses("/records", null)} // null indica que não há filtro de tipo específico
          >
            <FiList className="mr-3 text-lg" />
            Exibir tudo
          </Link>
        </nav>
      </div>

      {/* O botão de logout vai no final da sidebar */}
      <LogoutButton className="mt-auto" />
    </aside>
  );
}
