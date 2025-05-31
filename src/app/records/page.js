// app/records/page.js
"use client";

import Sidebar from "../../components/Sidebar";
import HistoryCard from "../../components/HistoryCard";
import FilterControls from "../../components/FilterControls";
import { useUrlFilters } from "../../hooks/useUrlFilters"; // Importe seu hook
import { useState, useMemo, useCallback } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { notify } from "../../utils/toastUtils";

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState([
    // ... seus dados ...
    {
      id: 1,
      type: "Denúncia",
      title: "Título da Denúncia 1",
      description: "descrição da denúncia",
      status: "em análise",
      date: "2025-05-20",
      location: "Rua das Flores, 123 - Centro",
    },
    {
      id: 2,
      type: "Solicitação",
      subType: "psicológica",
      title: "Título da Solicitação Psicológica 1",
      description: "descrição da solicitação psicológica.",
      status: "recebido",
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
      status: "em análise",
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

  // Mapeamento específico para os links da página de histórico
  const linkTypeMapping = useMemo(
    () => ({
      "Exibir tudo": "", // Vazio para "Exibir tudo"
      "Denúncias feitas": "denuncia",
      "Solicitações feitas": "solicitacao",
    }),
    []
  );

  // Use o hook, passando o mapeamento e indicando que não é admin
  const { filterState, handleFilterChange, clearFilter } = useUrlFilters(
    "Exibir tudo",
    linkTypeMapping,
    false // isAdmin = false para a página de histórico
  );

  const updateItemStatus = useCallback((id, newStatus) => {
    setHistoryItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  }, []);

  const handleMarkAsComplete = useCallback(
    (id) => {
      updateItemStatus(id, "completo");
      notify.success(`Item ${id} marcado como completo!`);
    },
    [updateItemStatus]
  );

  const filteredItems = useMemo(() => {
    let items = historyItems;

    // Filtra por tipo usando o typeParam do filterState
    if (filterState.typeParam === "denuncia") {
      items = items.filter((item) => item.type === "Denúncia");
    } else if (filterState.typeParam === "solicitacao") {
      items = items.filter((item) => item.type === "Solicitação");
    }

    // Filtra por data
    if (filterState.date) {
      items = items.filter((item) => item.date === filterState.date);
    }

    // Filtra por status
    if (filterState.status) {
      items = items.filter((item) => item.status === filterState.status);
    }

    return items;
  }, [
    historyItems,
    filterState.typeParam, // Depende do typeParam do filterState
    filterState.date,
    filterState.status,
  ]);

  const allPossibleStatuses = useMemo(() => {
    const statuses = new Set(historyItems.map((item) => item.status));
    const sortedStatuses = Array.from(statuses).sort();
    return ["", ...sortedStatuses];
  }, [historyItems]);

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      {/*
          Passa o activeLink para a Sidebar e a função handleFilterChange.
          A Sidebar usará esses para gerenciar seus links internos.
          Não precisa mais de onLinkClick. Os links internos da Sidebar já chamam handleFilterChange.
        */}
      <Sidebar isAdmin={false} /> {/* Não é admin, então isAdmin é false */}
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
