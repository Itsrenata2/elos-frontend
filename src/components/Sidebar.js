// components/Sidebar.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { FiPlus, FiList, FiUsers, FiMenu, FiX } from "react-icons/fi";

/**
 * Componente de barra lateral de navegação.
 * Gerencia a navegação e o estado do link ativo.
 * @param {boolean} isAdmin - Se true, renderiza a sidebar para a área de administração.
 */
export default function Sidebar({ isAdmin = false }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname(); // Usar usePathname para o caminho atual
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar a abertura/fechamento da sidebar em mobile

  // Fechar a sidebar mobile ao mudar de rota
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  // Função para determinar as classes de estilo do link ativo
  const getLinkClasses = (linkHref, expectedTypeParam = null) => {
    const currentPathname = pathname;
    const currentTypeParam = searchParams.get("type");

    let isActive = false;

    // Remove query params do linkHref para comparar apenas o pathname
    const cleanLinkPath = linkHref.split("?")[0];

    if (isAdmin) {
      // Lógica para Sidebar de ADMIN
      if (cleanLinkPath === "/admin/users") {
        isActive = currentPathname === "/admin/users";
      } else if (cleanLinkPath === "/admin") {
        if (expectedTypeParam === null) {
          // "Exibir tudo" para admin: ativo se pathname é /admin E NÃO há type param na URL
          isActive = currentPathname === "/admin" && currentTypeParam === null;
        } else {
          // "Denúncias" ou "Solicitações" para admin: ativo se pathname é /admin E type param corresponde
          isActive =
            currentPathname === "/admin" &&
            currentTypeParam === expectedTypeParam;
        }
      }
    } else {
      // Lógica para Sidebar PADRÃO (usuário)
      if (cleanLinkPath === "/records") {
        if (expectedTypeParam === null) {
          // "Exibir tudo" para user: ativo se pathname é /records E NÃO há type param na URL
          isActive =
            currentPathname === "/records" && currentTypeParam === null;
        } else {
          // "Denúncias feitas" ou "Solicitações feitas" para user: ativo se pathname é /records E type param corresponde
          isActive =
            currentPathname === "/records" &&
            currentTypeParam === expectedTypeParam;
        }
      } else {
        // Links diretos como "/complaints" ou "/new-solicitacao"
        isActive = currentPathname === cleanLinkPath;
      }
    }

    return `flex items-center p-3 rounded-md text-sm font-semibold transition-colors
      ${
        isActive ? "bg-zinc-800 text-white" : "text-zinc-800 hover:bg-zinc-300"
      }`;
  };

  return (
    <>
      {/* Botão de Hambúrguer - Visível apenas em telas menores */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-zinc-800 text-white md:hidden shadow-lg"
        aria-label="Abrir ou fechar menu"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay para mobile quando a sidebar está aberta */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true" // Esconde o overlay de leitores de tela
        ></div>
      )}

      {/* Sidebar - Oculta por padrão em mobile, aparece quando isOpen é true. Visível em telas maiores. */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-zinc-100 p-6 flex flex-col shadow-md z-40
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:flex md:w-64`} // md:w-64 garante a largura em desktop
      >
        <div>
          <div className="mb-8">
            <img
              src="/logo-elos.svg"
              alt="Elos Logo"
              className="h-10 mx-auto"
            />
          </div>
          <nav className="space-y-2">
            {isAdmin ? (
              // Conteúdo da Sidebar para a página de administração
              <>
                {/* Link para Denúncias (ADMIN) */}
                <Link
                  href="/admin?type=denuncia"
                  className={getLinkClasses("/admin?type=denuncia", "denuncia")}
                  onClick={() => setIsOpen(false)} // Fecha a sidebar ao clicar em um link
                >
                  <FiList className="mr-3 text-lg" />
                  Denúncias
                </Link>

                {/* Link para Solicitações (ADMIN) */}
                <Link
                  href="/admin?type=solicitacao"
                  className={getLinkClasses(
                    "/admin?type=solicitacao",
                    "solicitacao"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <FiList className="mr-3 text-lg" />
                  Solicitações
                </Link>

                {/* Link para Gerenciar Usuários (ADMIN) */}
                <Link
                  href="/admin/users"
                  className={getLinkClasses("/admin/users")}
                  onClick={() => setIsOpen(false)}
                >
                  <FiUsers className="mr-3 text-lg" />
                  Gerenciar Usuários
                </Link>

                <div className="border-t border-zinc-300 my-4"></div>

                {/* Link para Exibir tudo (ADMIN) */}
                <Link
                  href="/admin"
                  className={getLinkClasses("/admin", null)} // null indica que não há filtro de tipo específico
                  onClick={() => setIsOpen(false)}
                >
                  <FiList className="mr-3 text-lg" />
                  Exibir tudo
                </Link>
              </>
            ) : (
              // Conteúdo da Sidebar para as páginas padrão
              <>
                {/* Link para Nova Denúncia */}
                <Link
                  href="/complaints"
                  className={getLinkClasses("/complaints")}
                  onClick={() => setIsOpen(false)}
                >
                  <FiPlus className="mr-3 text-lg" />
                  Nova denúncia
                </Link>

                {/* Link para Denúncias feitas */}
                <Link
                  href="/records?type=denuncia"
                  className={getLinkClasses(
                    "/records?type=denuncia",
                    "denuncia"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <FiList className="mr-3 text-lg" />
                  Denúncias feitas
                </Link>

                <div className="border-t border-zinc-300 my-4"></div>

                {/* Link para Nova Solicitação */}
                <Link
                  href="/requests"
                  className={getLinkClasses("/requests")}
                  onClick={() => setIsOpen(false)}
                >
                  <FiPlus className="mr-3 text-lg" />
                  Nova solicitação
                </Link>

                {/* Link para Solicitações feitas */}
                <Link
                  href="/records?type=solicitacao"
                  className={getLinkClasses(
                    "/records?type=solicitacao",
                    "solicitacao"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <FiList className="mr-3 text-lg" />
                  Solicitações feitas
                </Link>

                <div className="border-t border-zinc-300 my-4"></div>

                {/* Link para Exibir tudo */}
                <Link
                  href="/records"
                  className={getLinkClasses("/records", null)} // null indica que não há filtro de tipo específico
                  onClick={() => setIsOpen(false)}
                >
                  <FiList className="mr-3 text-lg" />
                  Exibir tudo
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* O botão de logout vai no final da sidebar */}
        <LogoutButton className="mt-auto" />
      </aside>
    </>
  );
}
