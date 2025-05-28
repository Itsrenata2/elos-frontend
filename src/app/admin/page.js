"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
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

// Componente de Modal para Envio de Email
const EmailModal = ({ isOpen, onClose, item, onSendEmail }) => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  useEffect(() => {
    if (item) {
      // Pre-fill subject and body with item details
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

export default function AdminDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Estados locais para os filtros
  const [activeLinkLocal, setActiveLinkLocal] = useState("Exibir tudo");
  const [selectedDateLocal, setSelectedDateLocal] = useState("");
  const [selectedStatusLocal, setSelectedStatusLocal] = useState("");

  // --- Novos estados para o Modal de Email ---
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedItemForEmail, setSelectedItemForEmail] = useState(null);
  // --- Fim dos novos estados ---

  // Dados de histórico/chamados para o administrador (Atualizados com 'id' para uso)
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

  // Sincroniza estados locais com a URL no carregamento ou mudança da URL
  useEffect(() => {
    const urlType = searchParams.get("type");
    const urlDate = searchParams.get("date");
    const urlStatus = searchParams.get("status");

    let newActiveLink = "Exibir tudo";
    if (urlType === "denuncia") {
      newActiveLink = "Denúncias";
    } else if (urlType === "solicitacao") {
      newActiveLink = "Solicitações";
    } else if (urlType === "usuarios") {
      newActiveLink = "Gerenciar Usuários";
    }
    setActiveLinkLocal(newActiveLink);
    setSelectedDateLocal(urlDate || "");
    setSelectedStatusLocal(urlStatus || "");
  }, [searchParams]);

  // Função auxiliar para atualizar os parâmetros da URL
  const updateUrlParams = (newParams) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    Object.keys(newParams).forEach((key) => {
      if (newParams[key]) {
        currentParams.set(key, newParams[key]);
      } else {
        currentParams.delete(key);
      }
    });
    router.push(`${pathname}?${currentParams.toString()}`, { shallow: true });
  };

  const handleDateFilterChange = (e) => {
    const newDate = e.target.value;
    setSelectedDateLocal(newDate);
    const currentUrlType = searchParams.get("type");
    updateUrlParams({
      type: currentUrlType,
      date: newDate,
      status: selectedStatusLocal,
    });
  };

  const handleStatusFilterChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatusLocal(newStatus);
    const currentUrlType = searchParams.get("type");
    updateUrlParams({
      type: currentUrlType,
      date: selectedDateLocal,
      status: newStatus,
    });
  };

  const clearDateFilter = () => {
    setSelectedDateLocal("");
    const currentUrlType = searchParams.get("type");
    updateUrlParams({
      type: currentUrlType,
      date: "",
      status: selectedStatusLocal,
    });
  };

  const clearStatusFilter = () => {
    setSelectedStatusLocal("");
    const currentUrlType = searchParams.get("type");
    updateUrlParams({
      type: currentUrlType,
      date: selectedDateLocal,
      status: "",
    });
  };

  // --- Funções de ação do administrador (Atualizadas) ---
  const updateItemStatus = (id, newStatus) => {
    setHistoryItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleMoveToAnalysis = (id) => {
    updateItemStatus(id, "em análise");
    alert(`Item ${id} movido para 'em análise'!`);
  };

  const handleEditStatus = (id) => {
    const newStatus = prompt(
      `Editar status do item ${id}. Digite o novo status (recebido, em análise, encaminhado, completo):`
    );
    if (newStatus) {
      updateItemStatus(id, newStatus.toLowerCase()); // Certifica que o status é minúsculo
      alert(`Status do item ${id} alterado para: ${newStatus}!`);
    }
  };

  const handleForward = (id) => {
    const itemToForward = historyItems.find((item) => item.id === id);
    setSelectedItemForEmail(itemToForward);
    setIsEmailModalOpen(true);
  };

  const handleSendEmail = (id, recipientEmail, subject, body) => {
    // Aqui você enviaria o email de fato, provavelmente via uma API
    console.log(
      `Simulando envio de email para: ${recipientEmail}\nAssunto: ${subject}\nCorpo: ${body}`
    );
    alert(`Email para ${recipientEmail} enviado com sucesso! (Simulação)`);
    updateItemStatus(id, "encaminhado"); // Muda o status para 'encaminhado' após o envio
    setIsEmailModalOpen(false);
    setSelectedItemForEmail(null); // Limpa o item selecionado
  };

  const handleLogout = () => {
    alert("Sessão encerrada! Redirecionando para o login...");
    router.push("/login");
  };
  // --- Fim das funções de ação do administrador ---

  const getLinkClasses = (linkName) =>
    `flex items-center p-3 rounded-md text-sm font-semibold transition-colors
    ${
      activeLinkLocal === linkName
        ? "bg-zinc-800 text-white"
        : "text-zinc-800 hover:bg-zinc-300"
    }`;

  const getStatusColor = (status) => {
    switch (status) {
      case "recebido":
        return "bg-blue-500 text-white";
      case "em análise":
        return "bg-yellow-500 text-white";
      case "encaminhado":
        return "bg-orange-500 text-white";
      case "completo":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getSubTypeColor = (subType) => {
    switch (subType) {
      case "psicológica":
        return "bg-pink-500 text-white";
      case "jurídica":
        return "bg-indigo-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  // Lógica de filtragem dos itens
  const filteredItems = useMemo(() => {
    let items = historyItems;
    const urlTypeParam = searchParams.get("type");

    if (urlTypeParam === "denuncia") {
      items = items.filter((item) => item.type === "Denúncia");
    } else if (urlTypeParam === "solicitacao") {
      items = items.filter((item) => item.type === "Solicitação");
    } else if (urlTypeParam === "usuarios") {
      return [];
    }

    if (selectedDateLocal) {
      items = items.filter((item) => item.date === selectedDateLocal);
    }

    if (selectedStatusLocal) {
      items = items.filter((item) => item.status === selectedStatusLocal);
    }

    return items;
  }, [historyItems, selectedDateLocal, selectedStatusLocal, searchParams]);

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const allPossibleStatuses = useMemo(() => {
    const statuses = new Set(historyItems.map((item) => item.status));
    return ["", ...Array.from(statuses)].sort();
  }, [historyItems]);

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-100 p-6 flex flex-col shadow-md">
        <div>
          <div className="mb-8">
            <img
              src="/logo-elos.svg"
              alt="Elos Logo"
              className="h-10 mx-auto"
            />
          </div>
          <nav className="space-y-2">
            <Link
              href={{ pathname: pathname, query: { type: "denuncia" } }}
              onClick={() => setActiveLinkLocal("Denúncias")}
              className={getLinkClasses("Denúncias")}
            >
              <FiList className="mr-3 text-lg" />
              Denúncias
            </Link>
            <Link
              href={{ pathname: pathname, query: { type: "solicitacao" } }}
              onClick={() => setActiveLinkLocal("Solicitações")}
              className={getLinkClasses("Solicitações")}
            >
              <FiList className="mr-3 text-lg" />
              Solicitações
            </Link>
            <div className="border-t border-zinc-300 my-4"></div>
            <Link
              href={{ pathname: pathname, query: { type: "usuarios" } }}
              onClick={() => setActiveLinkLocal("Gerenciar Usuários")}
              className={getLinkClasses("Gerenciar Usuários")}
            >
              <FiUsers className="mr-3 text-lg" />
              Gerenciar Usuários
            </Link>
            <div className="border-t border-zinc-300 my-4"></div>
            <Link
              href={{ pathname: pathname, query: {} }}
              onClick={() => setActiveLinkLocal("Exibir tudo")}
              className={getLinkClasses("Exibir tudo")}
            >
              <FiList className="mr-3 text-lg" />
              Exibir tudo
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center p-3 rounded-md text-sm font-semibold transition-colors bg-zinc-700 text-white hover:bg-zinc-800"
        >
          <FiLogOut className="mr-3 text-lg" />
          Sair
        </button>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
            Painel Administrativo
          </h1>

          {/* Filtros visíveis apenas se não for a página de Gerenciar Usuários */}
          {activeLinkLocal !== "Gerenciar Usuários" && (
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
                  value={selectedDateLocal}
                  onChange={handleDateFilterChange}
                  className="px-3 py-2 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {selectedDateLocal && (
                  <button
                    onClick={clearDateFilter}
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
                  className="text-white text-md font-semibold mr-3 whitespace-nowrap"
                >
                  Status:
                </label>
                <select
                  id="status-filter"
                  value={selectedStatusLocal}
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
                {selectedStatusLocal && (
                  <button
                    onClick={clearStatusFilter}
                    className="ml-4 px-3 py-2 rounded-md bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition whitespace-nowrap"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Conteúdo dinâmico baseado no activeLinkLocal (URL type param) */}
        {activeLinkLocal === "Gerenciar Usuários" ? (
          <div className="text-white text-center p-8 border border-zinc-700 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              Gerenciamento de Usuários
            </h2>
            <p>
              Esta é uma área para gerenciar usuários. Em uma aplicação real,
              você teria uma tabela com a lista de usuários, opções para editar,
              excluir, etc.
            </p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-100 p-6 rounded-xl shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        item.type === "Denúncia"
                          ? "bg-red-500 text-white"
                          : "bg-blue-500 text-white"
                      }
                    `}
                    >
                      {item.type}
                    </span>
                    {item.type === "Solicitação" && item.subType && (
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize
                        ${getSubTypeColor(item.subType)}
                      `}
                      >
                        {item.subType}
                      </span>
                    )}
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize
                      ${getStatusColor(item.status)}
                    `}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-zinc-800 mb-2">
                    {item.title}
                  </h2>
                  <p className="text-zinc-700 text-sm mb-4">
                    {item.description}
                  </p>

                  <div className="flex items-center text-zinc-700 text-sm mb-2">
                    <FiCalendar className="mr-2 text-base" />
                    <span>Data: {formatDateForDisplay(item.date)}</span>
                  </div>

                  {item.type === "Denúncia" && item.location && (
                    <div className="flex items-center text-zinc-700 text-sm">
                      <FiMapPin className="mr-2 text-base" />
                      <span>Local: {item.location}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  {/* Botões de ação do administrador */}
                  {item.status !== "completo" && (
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
                  )}
                  {item.status === "completo" && (
                    <span className="text-center border-2 border-green-500 text-green-500 py-2 px-4 rounded-md font-semibold mt-4">
                      Resolvido
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          activeLinkLocal !== "Gerenciar Usuários" && (
            <p className="text-white text-lg col-span-full text-center">
              Nenhum item encontrado para o filtro selecionado.
            </p>
          )
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
  );
}
