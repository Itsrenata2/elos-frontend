// pages/admin/dashboard.js
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import AuthWrapper from "../../components/AuthWrapper";
import Sidebar from "../../components/Sidebar"; // Importe a Sidebar atualizada
import HistoryCard from "../../components/HistoryCard"; // Importa o novo componente
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  FiList,
  FiLogOut,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiEdit,
  FiShare2,
  FiLoader,
} from "react-icons/fi";

// Componente de Modal para Envio de Email (mantido como está)
const EmailModal = ({ isOpen, onClose, item, onSendEmail }) => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  useEffect(() => {
    if (item) {
      setEmailSubject(`Encaminhamento de ${item.type}: ${item.title}`);
      setEmailBody(
        `Detalhes da ${item.type}:\n\n` +
          `Título: ${item.title}\n` +
          `Descrição: ${item.description}\n` +
          `Data: ${item.date}\n` +
          (item.location ? `Local: ${item.location}\n` : "") +
          `Status Atual: ${item.status}\n\n` +
          `Por favor, tome as ações necessárias.`
      );
    }
  }, [item]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendEmail(item.id, recipientEmail, emailSubject, emailBody);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-zinc-800 mb-4">
          Encaminhar por Email
        </h2>
        {item && (
          <div className="mb-4 text-zinc-700">
            <p className="font-semibold">Item: {item.title}</p>
            <p className="text-sm">Tipo: {item.type}</p>
            <p className="text-sm">Status: {item.status}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="recipient-email"
              className="block text-zinc-700 text-sm font-bold mb-2"
            >
              Email do Destinatário:
            </label>
            <input
              type="email"
              id="recipient-email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email-subject"
              className="block text-zinc-700 text-sm font-bold mb-2"
            >
              Assunto:
            </label>
            <input
              type="text"
              id="email-subject"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email-body"
              className="block text-zinc-700 text-sm font-bold mb-2"
            >
              Corpo do Email:
            </label>
            <textarea
              id="email-body"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Enviar Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente Principal
export default function AdminDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Estados locais para os filtros
  const [filterState, setFilterState] = useState({
    activeLink: "Exibir tudo", // Pode ser 'Denúncias', 'Solicitações', 'Exibir tudo', 'Gerenciar Usuários'
    date: "",
    status: "",
  });

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedItemForEmail, setSelectedItemForEmail] = useState(null);

  const [historyItems, setHistoryItems] = useState([
    {
      id: 1,
      type: "Denúncia",
      title: "Título da Denúncia 1",
      description: "descrição da denúncia",
      status: "recebido",
      date: "2025-05-20",
      location: "Rua das Flores, 123 - Centro",
    },
    {
      id: 2,
      type: "Solicitação",
      subType: "psicológica",
      title: "Título da Solicitação Psicológica 1",
      description: "descrição da solicitação psicológica.",
      status: "em análise",
      date: "2025-05-25",
    },
    {
      id: 3,
      type: "Solicitação",
      subType: "jurídica",
      title: "Título da Solicitação Jurídica 1",
      description: "descrição da solicitação jurídica.",
      status: "encaminhado",
      date: "2025-05-18",
    },
    {
      id: 4,
      type: "Denúncia",
      title: "Título da Denúncia 2",
      description: "descrição da denúncia",
      status: "completo",
      date: "2025-05-20",
      location: "Praça da Sé, s/n",
    },
    {
      id: 5,
      type: "Denúncia",
      title: "Título da Denúncia 3",
      description: "mais uma descrição de denúncia para teste.",
      status: "recebido",
      date: "2025-05-22",
      location: "Rua do Comércio, 789",
    },
    {
      id: 6,
      type: "Solicitação",
      subType: "psicológica",
      title: "Título da Solicitação Psicológica 2",
      description: "mais uma descrição de solicitação psicológica para teste.",
      status: "recebido",
      date: "2025-05-26",
    },
    {
      id: 7,
      type: "Solicitação",
      subType: "jurídica",
      title: "Título da Solicitação Jurídica 2",
      description: "mais uma descrição de solicitação jurídica para teste.",
      status: "em análise",
      date: "2025-05-21",
    },
  ]);

  // Função auxiliar para obter o tipo de filtro da URL (ajustada para admin)
  const getTypeParamFromActiveLink = useCallback((activeLink) => {
    if (activeLink === "Denúncias") return "denuncia";
    if (activeLink === "Solicitações") return "solicitacao";
    // O link "Gerenciar Usuários" não usa o parâmetro 'type'
    return ""; // Para "Exibir tudo"
  }, []);

  // Função auxiliar para atualizar os parâmetros da URL
  const updateUrlParams = useCallback(
    (newParams) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      Object.keys(newParams).forEach((key) => {
        if (newParams[key]) {
          currentParams.set(key, newParams[key]);
        } else {
          currentParams.delete(key);
        }
      });
      // Importante: para /admin/users, a URL não terá parâmetros de tipo/data/status
      if (pathname === "/admin/users") {
        router.push(`${pathname}`, { shallow: true });
      } else {
        router.push(`${pathname}?${currentParams.toString()}`, {
          shallow: true,
        });
      }
    },
    [searchParams, router, pathname]
  );

  // Sincroniza estados locais com a URL no carregamento ou mudança da URL
  useEffect(() => {
    const urlType = searchParams.get("type");
    const urlDate = searchParams.get("date");
    const urlStatus = searchParams.get("status");

    let newActiveLink = "Exibir tudo"; // Padrão para admin
    if (urlType === "denuncia") {
      newActiveLink = "Denúncias";
    } else if (urlType === "solicitacao") {
      newActiveLink = "Solicitações";
    } else if (pathname === "/admin/users") {
      // Se estiver na página de usuários
      newActiveLink = "Gerenciar Usuários";
    }

    setFilterState({
      activeLink: newActiveLink,
      date: urlDate || "",
      status: urlStatus || "",
    });
  }, [searchParams, pathname]); // Adicione pathname nas dependências

  // Função genérica para mudar qualquer filtro e atualizar a URL
  const handleFilterChange = useCallback(
    (filterName, value) => {
      setFilterState((prevState) => {
        const newState = { ...prevState, [filterName]: value };
        let typeValue = getTypeParamFromActiveLink(newState.activeLink);

        // Se a mudança for no activeLink (tipo de filtro), precisamos recalcular o typeValue
        if (filterName === "activeLink") {
          typeValue = getTypeParamFromActiveLink(value);
          // Se for "Gerenciar Usuários", navega para /admin/users
          if (value === "Gerenciar Usuários") {
            router.push("/admin/users", { shallow: true });
            return { activeLink: "Gerenciar Usuários", date: "", status: "" }; // Limpa outros filtros
          }
        }
        updateUrlParams({
          type: typeValue,
          date: newState.date,
          status: newState.status,
        });
        return newState;
      });
    },
    [getTypeParamFromActiveLink, updateUrlParams, router]
  );

  const handleDateFilterChange = useCallback(
    (e) => {
      handleFilterChange("date", e.target.value);
    },
    [handleFilterChange]
  );

  const handleStatusFilterChange = useCallback(
    (e) => {
      handleFilterChange("status", e.target.value);
    },
    [handleFilterChange]
  );

  const clearFilter = useCallback(
    (filterName) => {
      handleFilterChange(filterName, "");
    },
    [handleFilterChange]
  );

  // --- Funções de ação do administrador (com useCallback) ---
  const updateItemStatus = useCallback((id, newStatus) => {
    setHistoryItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  }, []);

  const handleMoveToAnalysis = useCallback(
    (id) => {
      updateItemStatus(id, "em análise");
      alert(`Item ${id} movido para 'em análise'!`);
    },
    [updateItemStatus]
  );

  const handleEditStatus = useCallback(
    (id) => {
      const newStatus = prompt(
        `Editar status do item ${id}. Digite o novo status (recebido, em análise, encaminhado, completo):`
      );
      if (newStatus) {
        updateItemStatus(id, newStatus.toLowerCase());
        alert(`Status do item ${id} alterado para: ${newStatus}!`);
      }
    },
    [updateItemStatus]
  );

  const handleForward = useCallback(
    (id) => {
      const itemToForward = historyItems.find((item) => item.id === id);
      setSelectedItemForEmail(itemToForward);
      setIsEmailModalOpen(true);
    },
    [historyItems]
  );

  const handleSendEmail = useCallback(
    (id, recipientEmail, subject, body) => {
      console.log(
        `Simulando envio de email para: ${recipientEmail}\nAssunto: ${subject}\nCorpo: ${body}`
      );
      alert(`Email para ${recipientEmail} enviado com sucesso! (Simulação)`);
      updateItemStatus(id, "encaminhado");
      setIsEmailModalOpen(false);
      setSelectedItemForEmail(null);
    },
    [updateItemStatus]
  );
  // --- Fim das funções de ação do administrador ---

  // Lógica de filtragem dos itens (agora usando filterState)
  const filteredItems = useMemo(() => {
    let items = historyItems;
    const urlTypeParam = searchParams.get("type"); // Ainda usamos o searchParams para o tipo

    // Se a página for /admin/users, não exibe itens de histórico
    if (pathname === "/admin/users") {
      return [];
    }

    if (urlTypeParam === "denuncia") {
      items = items.filter((item) => item.type === "Denúncia");
    } else if (urlTypeParam === "solicitacao") {
      items = items.filter((item) => item.type === "Solicitação");
    }

    if (filterState.date) {
      items = items.filter((item) => item.date === filterState.date);
    }

    if (filterState.status) {
      items = items.filter((item) => item.status === filterState.status);
    }

    return items;
  }, [
    historyItems,
    filterState.date,
    filterState.status,
    searchParams,
    pathname,
  ]);

  const allPossibleStatuses = useMemo(() => {
    const statuses = new Set(historyItems.map((item) => item.status));
    return ["", ...Array.from(statuses)].sort();
  }, [historyItems]);

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-zinc-900 flex">
        {/* Passe a prop isAdmin={true} para renderizar a versão de admin da Sidebar */}
        <Sidebar isAdmin={true} />

        {/* Conteúdo Principal */}
        <main className="flex-1 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
              Painel Administrativo
            </h1>

            {/* Filtros visíveis apenas se NÃO for a página de Gerenciar Usuários */}
            {pathname !== "/admin/users" && (
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Filtro de Data */}
                <div className="flex items-center bg-zinc-800 p-3 rounded-md shadow-md">
                  <label
                    htmlFor="date-filter"
                    className="text-white text-md font-semibold mr-3 whitespace-nowrap"
                  >
                    Data:
                  </label>
                  <input
                    type="date"
                    id="date-filter"
                    value={filterState.date}
                    onChange={handleDateFilterChange}
                    className="px-3 py-2 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {filterState.date && (
                    <button
                      onClick={() => clearFilter("date")}
                      className="ml-4 px-3 py-2 rounded-md bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition whitespace-nowrap"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {/* Filtro de Status */}
                <div className="flex items-center bg-zinc-800 p-3 rounded-md shadow-md">
                  <label
                    htmlFor="status-filter"
                    className="block text-white text-md font-semibold mr-3 whitespace-nowrap"
                  >
                    Status:
                  </label>
                  <select
                    id="status-filter"
                    value={filterState.status}
                    onChange={handleStatusFilterChange}
                    className="px-3 py-2 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Todos</option>
                    {allPossibleStatuses.map(
                      (status) =>
                        status && (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        )
                    )}
                  </select>
                  {filterState.status && (
                    <button
                      onClick={() => clearFilter("status")}
                      className="ml-4 px-3 py-2 rounded-md bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition whitespace-nowrap"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Conteúdo dinâmico baseado no pathname (Gerenciar Usuários vs. Histórico) */}
          {pathname === "/admin/users" ? (
            <div className="text-white text-center p-8 border border-zinc-700 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">
                Gerenciamento de Usuários
              </h2>
              <p>
                Esta é uma área para gerenciar usuários. Em uma aplicação real,
                você teria uma tabela com a lista de usuários, opções para
                editar, excluir, etc.
              </p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <HistoryCard key={item.id} item={item}>
                  {item.status !== "completo" ? (
                    <>
                      {/* Botão "Mover para em análise" */}
                      {item.status === "recebido" && (
                        <button
                          className="flex items-center justify-center bg-gray-700 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-800 transition"
                          onClick={() => handleMoveToAnalysis(item.id)}
                        >
                          <FiLoader className="mr-2" />
                          Mover para em análise
                        </button>
                      )}

                      {/* Botão "Editar status" */}
                      <button
                        className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition"
                        onClick={() => handleEditStatus(item.id)}
                      >
                        <FiEdit className="mr-2" />
                        Editar status
                      </button>

                      {/* Botão "Encaminhar" */}
                      <button
                        className="flex items-center justify-center bg-purple-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-purple-700 transition"
                        onClick={() => handleForward(item.id)}
                      >
                        <FiShare2 className="mr-2" />
                        Encaminhar
                      </button>
                    </>
                  ) : (
                    <span className="text-center border-2 border-green-500 text-green-500 py-2 px-4 rounded-md font-semibold mt-4">
                      Resolvido
                    </span>
                  )}
                </HistoryCard>
              ))}
            </div>
          ) : (
            <p className="text-white text-lg col-span-full text-center">
              Nenhum item encontrado para o filtro selecionado.
            </p>
          )}
        </main>

        {/* Modal de Email */}
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          item={selectedItemForEmail}
          onSendEmail={handleSendEmail}
        />
      </div>
    </AuthWrapper>
  );
}
