// app/records/page.js
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import HistoryCard from "../../components/HistoryCard";
import FilterControls from "../../components/FilterControls";
import { useUrlFilters } from "../../hooks/useUrlFilters";
import { FiCheckCircle } from "react-icons/fi";
import { notify } from "../../utils/toastUtils";
import Cookies from "js-cookie";

const STATUS_MAP_BACKEND_TO_FRONTEND = {
  RECEIVED: "recebido",
  IN_REVIEW: "em análise",
  FORWARDED: "encaminhado",
  COMPLETED: "completo",
};

const STATUS_MAP_FRONTEND_TO_BACKEND = {
  recebido: "RECEIVED",
  "em análise": "IN_REVIEW",
  encaminhado: "FORWARDED",
  completo: "COMPLETED",
};

// Ajuste este mapeamento conforme o seu backend retorna os tipos.
// Ex: se o backend tem 'DENUNCIA' e 'SOLICITACAO_JURIDICA', 'SOLICITACAO_PSICOLOGICA'
const TYPE_MAP_BACKEND_TO_FRONTEND = {
  JURIDICO: { type: "Solicitação", subType: "jurídica" },
  PSICOLOGICO: { type: "Solicitação", subType: "psicológica" },
  // Exemplo para denúncias (se seu backend as retornar):
  // "COMPLAINT": { type: "Denúncia", subType: null }
};

export default function HistoryPage() {
  const router = useRouter();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const linkTypeMapping = useMemo(
    () => ({
      "Exibir tudo": "",
      "Denúncias feitas": "denuncia",
      "Solicitações feitas": "solicitacao",
    }),
    []
  );

  const { filterState, handleFilterChange, clearFilter } = useUrlFilters(
    "Exibir tudo",
    linkTypeMapping,
    false
  );

  const fetchHistoryItems = useCallback(async () => {
    setLoading(true);
    try {
      const authToken = Cookies.get("authToken");
      if (!authToken) {
        notify.error("Você não está autenticado. Redirecionando para login.");
        router.push("/login");
        return;
      }

      // Usar a URL base e adicionar o caminho do endpoint de listagem
      const backendApiUrl = `${process.env.NEXT_PUBLIC_NESTJS_API_URL}/support-requests`; // Exemplo

      if (!backendApiUrl) {
        console.error(
          "Variável de ambiente NEXT_PUBLIC_NESTJS_API_URL não definida ou incorreta."
        );
        notify.error(
          "Erro de configuração: URL do backend de histórico não encontrada."
        );
        setLoading(false);
        return;
      }

      const response = await fetch(backendApiUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao carregar histórico.");
      }

      const data = await response.json();
      console.log("Dados brutos recebidos do backend:", data);

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
        };
      });
      setHistoryItems(mappedItems);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      notify.error(`Erro ao carregar histórico: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchHistoryItems();
  }, [fetchHistoryItems]);

  const handleMarkAsComplete = useCallback(
    async (id) => {
      const confirmed = confirm(
        "Tem certeza que deseja marcar esta solicitação/denúncia como 'completa'?"
      );
      if (!confirmed) return;

      const itemToUpdate = historyItems.find((item) => item.id === id);
      if (!itemToUpdate) {
        notify.error("Item não encontrado para atualização.");
        return;
      }

      const newBackendStatus = STATUS_MAP_FRONTEND_TO_BACKEND["completo"];

      if (!newBackendStatus) {
        notify.error(
          "Status 'completo' não mapeado para o formato do backend."
        );
        return;
      }

      try {
        const authToken = Cookies.get("authToken");
        if (!authToken) {
          notify.error("Você não está autenticado.");
          router.push("/login");
          return;
        }

        // Usar a URL base e adicionar o caminho do endpoint de atualização
        const backendUpdateUrl = `${process.env.NEXT_PUBLIC_NESTJS_API_URL}/support-requests/${id}/status`; // Exemplo

        const response = await fetch(backendUpdateUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ status: newBackendStatus }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Falha ao atualizar status.");
        }

        setHistoryItems((prevItems) =>
          prevItems.map((item) =>
            item.id === id ? { ...item, status: "completo" } : item
          )
        );
        notify.success(`Item ${id} marcado como completo!`);
      } catch (error) {
        console.error("Erro ao marcar como completo:", error);
        notify.error(`Erro ao marcar como completo: ${error.message}`);
      }
    },
    [historyItems, router]
  );

  const filteredItems = useMemo(() => {
    let items = historyItems;

    if (filterState.typeParam === "denuncia") {
      items = items.filter((item) => item.type === "Denúncia");
    } else if (filterState.typeParam === "solicitacao") {
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
    filterState.typeParam,
    filterState.date,
    filterState.status,
  ]);

  const allPossibleStatuses = useMemo(() => {
    const statuses = new Set(Object.values(STATUS_MAP_BACKEND_TO_FRONTEND));
    const sortedStatuses = Array.from(statuses).sort();
    return ["", ...sortedStatuses];
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <p className="text-white text-xl">Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      <Sidebar isAdmin={false} />
      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
            Histórico
          </h1>

          <FilterControls
            filterState={filterState}
            allPossibleStatuses={allPossibleStatuses}
            onDateChange={(e) => handleFilterChange("date", e.target.value)}
            onStatusChange={(e) => handleFilterChange("status", e.target.value)}
            onClearFilter={clearFilter}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <HistoryCard key={item.id} item={item}>
                {item.status !== "completo" ? (
                  <button
                    className="flex items-center justify-center bg-zinc-900 text-white py-2 px-4 rounded-md font-semibold hover:bg-zinc-800 transition mt-4"
                    onClick={() => handleMarkAsComplete(item.id)}
                  >
                    <FiCheckCircle className="mr-2" />
                    Marcar como completo
                  </button>
                ) : (
                  <span className="text-center border-2 border-green-500 text-green-500 py-2 px-4 rounded-md font-semibold mt-4">
                    Resolvido
                  </span>
                )}
              </HistoryCard>
            ))
          ) : (
            <p className="text-white text-lg col-span-full text-center">
              Nenhum item encontrado para o filtro selecionado.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
