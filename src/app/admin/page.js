// pages/admin/dashboard.js
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useMemo, useEffect, useCallback } from "react";
import { FiEdit, FiShare2, FiLoader } from "react-icons/fi";
import Cookies from "js-cookie";

// Importações dos componentes de UI
import Sidebar from "../../components/Sidebar";
import HistoryCard from "../../components/HistoryCard";
import EmailModal from "../../components/EmailModal";
import StatusEditModal from "../../components/StatusEditModal";

// Importações de utilitários
import { notify } from "../../utils/toastUtils";

// --- Mapeamentos de Status (garanta que correspondam ao backend) ---
const STATUS_MAP_BACKEND_TO_FRONTEND = {
  RECEIVED: "recebido",
  IN_REVIEW: "em análise",
  FORWARDED: "encaminhado",
  COMPLETED: "completo",
  // Adicione status específicos do admin se houver (e.g., CANCELED, REJECTED)
};

const STATUS_MAP_FRONTEND_TO_BACKEND = {
  recebido: "RECEIVED",
  "em análise": "IN_REVIEW",
  encaminhado: "FORWARDED",
  completo: "COMPLETED",
};

const TYPE_MAP_BACKEND_TO_FRONTEND = {
  JURIDICO: { type: "Solicitação", subType: "jurídica" },
  PSICOLOGICO: { type: "Solicitação", subType: "psicológica" },
  COMPLAINT: { type: "Denúncia", subType: null }, // Adicione o tipo de denúncia se seu backend o tiver
  // Adicione outros tipos se houver
};

const HistoryCardActions = ({
  item,
  handleMoveToAnalysis,
  handleEditStatus,
  handleForward,
}) => {
  if (item.status === "completo") {
    return (
      <span className="text-center border-2 border-green-500 text-green-500 py-2 px-4 rounded-md font-semibold mt-4">
        Resolvido
      </span>
    );
  }

  return (
    <>
      {item.status === "recebido" && (
        <button
          className="flex items-center justify-center bg-gray-700 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-800 transition"
          onClick={() => handleMoveToAnalysis(item.id)}
        >
          <FiLoader className="mr-2" />
          Mover para em análise
        </button>
      )}

      {/* Botão de editar status */}
      <button
        className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 transition"
        onClick={() => handleEditStatus(item.id)}
      >
        <FiEdit className="mr-2" />
        Editar status
      </button>

      {/* Botão de encaminhar */}
      <button
        className="flex items-center justify-center bg-purple-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-purple-700 transition"
        onClick={() => handleForward(item.id)}
      >
        <FiShare2 className="mr-2" />
        Encaminhar
      </button>
    </>
  );
};
// --- Fim do componente HistoryCardActions ---

export default function AdminDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Estados locais para os filtros
  const [filterState, setFilterState] = useState({
    activeLink: "Exibir tudo", // Corresponde ao texto do link na Sidebar
    date: "",
    status: "",
  });

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedItemForEmail, setSelectedItemForEmail] = useState(null);

  const [isStatusEditModalOpen, setIsStatusEditModalOpen] = useState(false);
  const [selectedItemForStatusEdit, setSelectedItemForStatusEdit] =
    useState(null);

  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Acessando a URL da API do NestJS ---
  const NESTJS_API_URL = process.env.NEXT_PUBLIC_NESTJS_API_URL;

  // Função auxiliar para obter o tipo de filtro da URL (ajustada para admin)
  const getTypeParamFromActiveLink = useCallback((activeLink) => {
    switch (activeLink) {
      case "Denúncias":
        return "COMPLAINT";
      case "Solicitações":
        return "JURIDICO,PSICOLOGICO"; // Assumindo que seu backend pode filtrar por múltiplos tipos
      case "Gerenciar Usuários":
        return ""; // Esta opção não filtra histórico
      default:
        return ""; // "Exibir tudo" ou qualquer outro que não seja específico
    }
  }, []);

  // Função auxiliar para atualizar os parâmetros da URL
  // Agora recebe um objeto com os novos parâmetros para aplicar
  const updateUrlParams = useCallback(
    (newFilterValues) => {
      const currentParams = new URLSearchParams(searchParams.toString());

      // Aplicar as novas chaves/valores
      Object.entries(newFilterValues).forEach(([key, value]) => {
        if (value) {
          currentParams.set(key, value);
        } else {
          currentParams.delete(key);
        }
      });

      // Navegar sem recarregar a página (shallow routing)
      router.push(`${pathname}?${currentParams.toString()}`, { shallow: true });
    },
    [searchParams, router, pathname]
  );

  // --- Funções de manipulação de filtros ---
  const handleDateFilterChange = useCallback(
    (e) => {
      const newDate = e.target.value;
      setFilterState((prevState) => ({ ...prevState, date: newDate }));
      updateUrlParams({ date: newDate });
    },
    [updateUrlParams]
  );

  const handleStatusFilterChange = useCallback(
    (e) => {
      const newStatus = e.target.value;
      setFilterState((prevState) => ({ ...prevState, status: newStatus }));
      updateUrlParams({ status: newStatus });
    },
    [updateUrlParams]
  );

  const handleActiveLinkChange = useCallback(
    (linkText) => {
      setFilterState((prevState) => ({ ...prevState, activeLink: linkText }));

      const typeParam = getTypeParamFromActiveLink(linkText);

      // Limpa os outros filtros quando o link principal da sidebar muda
      updateUrlParams({
        type: typeParam,
        date: "",
        status: "",
      });

      // Se for a página de usuários, navega diretamente
      if (linkText === "Gerenciar Usuários") {
        router.push("/admin/users", { shallow: true });
      } else {
        // Redireciona para o dashboard com os novos parâmetros (se não for users)
        router.push(`/admin/dashboard?type=${typeParam}`, { shallow: true });
      }
    },
    [updateUrlParams, getTypeParamFromActiveLink, router]
  );

  const clearFilter = useCallback(
    (filterKey) => {
      setFilterState((prevState) => ({ ...prevState, [filterKey]: "" }));
      updateUrlParams({ [filterKey]: "" });
    },
    [updateUrlParams]
  );

  // Função para buscar os itens do histórico (agora do backend)
  const fetchHistoryItems = useCallback(async () => {
    setLoading(true);
    try {
      const authToken = Cookies.get("authToken");
      if (!authToken) {
        notify.error("Você não está autenticado. Redirecionando para login.");
        router.push("/login");
        return;
      }

      if (!NESTJS_API_URL) {
        console.error(
          "Variável de ambiente NEXT_PUBLIC_NESTJS_API_URL não definida."
        );
        notify.error("Erro de configuração: URL do backend não encontrada.");
        setLoading(false);
        return;
      }

      // Constrói a URL com base nos filtros ativos
      const queryParams = new URLSearchParams();

      // Mapeia o activeLink da sidebar para o parâmetro 'type' do backend
      const backendType = getTypeParamFromActiveLink(filterState.activeLink);
      if (backendType) {
        queryParams.append("type", backendType);
      }

      // Adiciona filtros de data e status
      if (filterState.date) {
        queryParams.append("date", filterState.date);
      }
      if (filterState.status) {
        const backendStatus =
          STATUS_MAP_FRONTEND_TO_BACKEND[filterState.status];
        if (backendStatus) {
          queryParams.append("status", backendStatus);
        }
      }

      // ** ATENÇÃO: Endpoint do Backend para Admin **
      // Se seu backend tiver endpoints diferentes para Denúncias vs. Solicitações,
      // ou um endpoint geral para o admin, ajuste a URL base aqui.
      // Assumindo um endpoint `/support-requests` que um admin pode acessar todas
      // e que o backend filtra por `type` (seja 'COMPLAINT' ou 'JURIDICO,PSICOLOGICO').
      const apiUrl = `${NESTJS_API_URL}/support-requests?${queryParams.toString()}`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao carregar histórico.");
      }

      const data = await response.json();
      console.log("Dados brutos recebidos do backend (Admin):", data);

      const mappedItems = data.map((item) => {
        const { type, subType } = TYPE_MAP_BACKEND_TO_FRONTEND[item.type] || {
          type: "Desconhecido",
          subType: null,
        };
        const statusFrontend =
          STATUS_MAP_BACKEND_TO_FRONTEND[item.status] || item.status;

        return {
          id: item.id,
          type: type,
          subType: subType,
          title: item.title,
          description: item.description,
          status: statusFrontend,
          date: item.createdAt
            ? new Date(item.createdAt).toISOString().split("T")[0]
            : null,
          location: item.location || null, // Adapte conforme seu backend
        };
      });
      setHistoryItems(mappedItems);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      notify.error(`Erro ao carregar histórico: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [NESTJS_API_URL, router, filterState, getTypeParamFromActiveLink]);

  // Sincroniza estados locais com a URL no carregamento ou mudança da URL
  useEffect(() => {
    const urlTypeParam = searchParams.get("type");
    const urlDate = searchParams.get("date");
    const urlStatus = searchParams.get("status");

    let newActiveLink = "Exibir tudo"; // Padrão
    // Inverte a lógica do getTypeParamFromActiveLink para encontrar o activeLink correto
    if (urlTypeParam === "COMPLAINT") {
      newActiveLink = "Denúncias";
    } else if (urlTypeParam === "JURIDICO,PSICOLOGICO") {
      newActiveLink = "Solicitações";
    } else if (pathname === "/admin/users") {
      newActiveLink = "Gerenciar Usuários";
    }

    setFilterState({
      activeLink: newActiveLink,
      date: urlDate || "",
      status: urlStatus || "",
    });
  }, [searchParams, pathname]);

  // Chama fetchHistoryItems quando os filtros mudam ou a página carrega
  useEffect(() => {
    // Só busca dados se não estiver na página de gerenciamento de usuários
    if (pathname !== "/admin/users") {
      fetchHistoryItems();
    } else {
      setHistoryItems([]); // Limpa os itens se for para a página de usuários
      setLoading(false);
    }
  }, [fetchHistoryItems, pathname]);

  // --- Funções de ação do administrador que interagem com o backend ---
  const handleUpdateStatusBackend = useCallback(
    async (id, newStatusFrontend) => {
      const newStatusBackend =
        STATUS_MAP_FRONTEND_TO_BACKEND[newStatusFrontend];
      if (!newStatusBackend) {
        notify.error("Status inválido para atualização.");
        return false;
      }

      try {
        const authToken = Cookies.get("authToken");
        if (!authToken) {
          notify.error("Você não está autenticado. Redirecionando para login.");
          router.push("/login");
          return false;
        }

        const response = await fetch(
          `${NESTJS_API_URL}/support-requests/${id}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ status: newStatusBackend }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Falha ao atualizar status.");
        }

        // Se o backend for bem-sucedido, atualize o estado local
        // Não é estritamente necessário se fetchHistoryItems for chamado logo depois
        // Mas é bom para uma atualização visual imediata antes do re-fetch
        setHistoryItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, status: newStatusFrontend } : item
          )
        );
        notify.success(
          `Status do item ${id} alterado para: ${newStatusFrontend}!`
        );
        return true; // Indica sucesso
      } catch (error) {
        console.error("Erro ao atualizar status via backend:", error);
        notify.error(`Erro ao atualizar status: ${error.message}`);
        return false; // Indica falha
      }
    },
    [NESTJS_API_URL, router]
  );

  const handleMoveToAnalysis = useCallback(
    async (id) => {
      const success = await handleUpdateStatusBackend(id, "em análise");
      if (success) {
        fetchHistoryItems(); // Re-fetch para garantir consistência e aplicar filtros
      }
    },
    [handleUpdateStatusBackend, fetchHistoryItems]
  );

  const handleEditStatus = useCallback(
    (id) => {
      const itemToEdit = historyItems.find((item) => item.id === id);
      setSelectedItemForStatusEdit(itemToEdit);
      setIsStatusEditModalOpen(true);
    },
    [historyItems]
  );

  const handleSaveStatusFromModal = useCallback(
    async (id, newStatusFrontend) => {
      const success = await handleUpdateStatusBackend(id, newStatusFrontend);
      if (success) {
        setIsStatusEditModalOpen(false);
        setSelectedItemForStatusEdit(null);
        fetchHistoryItems(); // Re-fetch para garantir que a lista esteja atualizada
      }
    },
    [handleUpdateStatusBackend, fetchHistoryItems]
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
    async (id, recipientEmail, subject, body) => {
      try {
        const authToken = Cookies.get("authToken");
        if (!authToken) {
          notify.error("Você não está autenticado. Redirecionando para login.");
          router.push("/login");
          return;
        }

        const response = await fetch(
          `${NESTJS_API_URL}/support-requests/${id}/forward-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ recipientEmail, subject, body }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Falha ao encaminhar email.");
        }

        notify.success(`Email para ${recipientEmail} enviado com sucesso!`);
        // Atualize o status para "encaminhado" no frontend após o sucesso do backend
        setHistoryItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, status: "encaminhado" } : item
          )
        );
        setIsEmailModalOpen(false);
        setSelectedItemForEmail(null);
        fetchHistoryItems(); // Re-fetch para garantir que a lista esteja atualizada
      } catch (error) {
        console.error("Erro ao encaminhar email:", error);
        notify.error(`Erro ao encaminhar email: ${error.message}`);
      }
    },
    [NESTJS_API_URL, router, fetchHistoryItems]
  );
  // --- Fim das funções de ação do administrador ---

  // Itens filtrados são simplesmente os historyItems quando não está na página de usuários,
  // já que fetchHistoryItems já aplica os filtros do lado do servidor.
  const filteredItems = useMemo(() => {
    if (pathname === "/admin/users") {
      return [];
    }
    return historyItems;
  }, [historyItems, pathname]);

  const allPossibleStatuses = useMemo(() => {
    // Garanta que você está usando os valores que o frontend espera exibir
    const statuses = new Set(Object.values(STATUS_MAP_BACKEND_TO_FRONTEND));
    // Adicione um valor vazio para a opção "Todos"
    return ["", ...Array.from(statuses)].sort();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <p className="text-white text-xl">Carregando painel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      <Sidebar
        isAdmin={true}
        activeLink={filterState.activeLink}
        onLinkClick={handleActiveLinkChange}
      />

      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
            Painel Administrativo
          </h1>

          {pathname !== "/admin/users" && (
            <div className="flex flex-col sm:flex-row gap-4">
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
                  onChange={handleDateFilterChange} // CORRIGIDO AQUI
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
                  onChange={handleStatusFilterChange} // CORRIGIDO AQUI
                  className="px-3 py-2 rounded-md bg-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Todos</option>
                  {allPossibleStatuses.map(
                    (status) =>
                      status && ( // Evita renderizar a opção vazia se `status` for uma string vazia
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

        {pathname === "/admin/users" ? (
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
              <HistoryCard key={item.id} item={item}>
                <HistoryCardActions
                  item={item}
                  handleMoveToAnalysis={handleMoveToAnalysis}
                  handleEditStatus={handleEditStatus}
                  handleForward={handleForward}
                />
              </HistoryCard>
            ))}
          </div>
        ) : (
          <p className="text-white text-lg col-span-full text-center">
            Nenhum item encontrado para o filtro selecionado.
          </p>
        )}
      </main>

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        item={selectedItemForEmail}
        onSendEmail={handleSendEmail}
      />

      <StatusEditModal
        isOpen={isStatusEditModalOpen}
        onClose={() => setIsStatusEditModalOpen(false)}
        item={selectedItemForStatusEdit}
        onSaveStatus={handleSaveStatusFromModal}
        allPossibleStatuses={allPossibleStatuses.filter((s) => s !== "")} // Passa apenas os status reais
      />
    </div>
  );
}
