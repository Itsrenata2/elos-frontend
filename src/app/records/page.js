"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import {
  FiPlus,
  FiList,
  FiCheckCircle,
  FiLogOut,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";

export default function HistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeLinkLocal, setActiveLinkLocal] = useState("Exibir tudo");
  const [selectedDateLocal, setSelectedDateLocal] = useState("");
  const [selectedStatusLocal, setSelectedStatusLocal] = useState("");

  const [historyItems, setHistoryItems] = useState([
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

  useEffect(() => {
    const urlType = searchParams.get("type");
    const urlDate = searchParams.get("date");
    const urlStatus = searchParams.get("status");

    console.log(
      "useEffect: URL Params - type:",
      urlType,
      "date:",
      urlDate,
      "status:",
      urlStatus
    );

    if (router.pathname === "/complaints") {
      setActiveLinkLocal("Nova denúncia");
    } else {
      let newActiveLink = "Exibir tudo";
      if (urlType === "denuncia" && router.pathname === "/records") {
        newActiveLink = "Denúncias feitas";
      } else if (urlType === "solicitacao" && router.pathname === "/records") {
        newActiveLink = "Solicitações feitas";
      } else if (router.pathname === "/records") {
        newActiveLink = "Exibir tudo";
      }
      setActiveLinkLocal(newActiveLink);
    }
    setSelectedDateLocal(urlDate || "");
    setSelectedStatusLocal(urlStatus || "");
    console.log("useEffect: selectedStatusLocal set to:", urlStatus || "");
  }, [searchParams, router.pathname]);

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

    // *** MUDANÇA AQUI: Garante que router.pathname não seja undefined ***
    // Usa router.pathname se estiver definido e for uma string, senão usa '/records' como fallback.
    const currentPath =
      router.pathname && typeof router.pathname === "string"
        ? router.pathname
        : "/records";

    const newUrl = `${currentPath}?${currentParams.toString()}`;
    console.log("updateUrlParams: Pushing new URL:", newUrl);
    router.push(newUrl, { shallow: true });
  };

  const handleTypeFilterChange = (typeParam) => {
    setActiveLinkLocal(typeParam);
    let typeValue = "";
    if (typeParam === "Denúncias feitas") typeValue = "denuncia";
    else if (typeParam === "Solicitações feitas") typeValue = "solicitacao";

    console.log(
      "handleTypeFilterChange: typeValue:",
      typeValue,
      "selectedDateLocal:",
      selectedDateLocal,
      "selectedStatusLocal:",
      selectedStatusLocal
    );
    // Este Link.onClick já está usando um caminho fixo de '/records', então não sofreria do mesmo problema
    router.push(
      `/records?type=${typeValue}&date=${selectedDateLocal}&status=${selectedStatusLocal}`
    );
  };

  const handleDateFilterChange = (e) => {
    const newDate = e.target.value;
    setSelectedDateLocal(newDate);
    let typeValue = "";
    if (activeLinkLocal === "Denúncias feitas") typeValue = "denuncia";
    else if (activeLinkLocal === "Solicitações feitas")
      typeValue = "solicitacao";
    console.log(
      "handleDateFilterChange: newDate:",
      newDate,
      "typeValue:",
      typeValue,
      "selectedStatusLocal:",
      selectedStatusLocal
    );
    updateUrlParams({
      type: typeValue,
      date: newDate,
      status: selectedStatusLocal,
    });
  };

  const handleStatusFilterChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatusLocal(newStatus);
    let typeValue = "";
    if (activeLinkLocal === "Denúncias feitas") typeValue = "denuncia";
    else if (activeLinkLocal === "Solicitações feitas")
      typeValue = "solicitacao";
    console.log(
      "handleStatusFilterChange: newStatus:",
      newStatus,
      "typeValue:",
      typeValue,
      "selectedDateLocal:",
      selectedDateLocal
    );
    updateUrlParams({
      type: typeValue,
      date: selectedDateLocal,
      status: newStatus,
    });
  };

  const clearDateFilter = () => {
    setSelectedDateLocal("");
    let typeValue = "";
    if (activeLinkLocal === "Denúncias feitas") typeValue = "denuncia";
    else if (activeLinkLocal === "Solicitações feitas")
      typeValue = "solicitacao";
    console.log(
      "clearDateFilter: Clearing date. typeValue:",
      typeValue,
      "selectedStatusLocal:",
      selectedStatusLocal
    );
    updateUrlParams({ type: typeValue, date: "", status: selectedStatusLocal });
  };

  const clearStatusFilter = () => {
    setSelectedStatusLocal("");
    let typeValue = "";
    if (activeLinkLocal === "Denúncias feitas") typeValue = "denuncia";
    else if (activeLinkLocal === "Solicitações feitas")
      typeValue = "solicitacao";
    console.log(
      "clearStatusFilter: Clearing status. typeValue:",
      typeValue,
      "selectedDateLocal:",
      selectedDateLocal
    );
    updateUrlParams({ type: typeValue, date: selectedDateLocal, status: "" });
  };

  const updateItemStatus = (id, newStatus) => {
    setHistoryItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleMarkAsComplete = (id) => {
    updateItemStatus(id, "completo");
    alert(`Item ${id} marcado como completo!`);
  };

  const handleLogout = () => {
    alert("Sessão encerrada! Redirecionando para o login...");
    router.push("/login");
  };

  const getLinkClasses = (linkPath, linkNameForActiveState = null) => {
    const isActiveLink = linkNameForActiveState
      ? activeLinkLocal === linkNameForActiveState
      : router.pathname === linkPath;

    return `flex items-center p-3 rounded-md text-sm font-semibold transition-colors
    ${
      isActiveLink
        ? "bg-zinc-800 text-white"
        : "text-zinc-800 hover:bg-zinc-300"
    }`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "em análise":
        return "bg-yellow-500 text-white";
      case "recebido":
        return "bg-purple-500 text-white";
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

  const filteredItems = useMemo(() => {
    console.log("useMemo: Re-calculating filteredItems...");
    console.log("useMemo: current selectedStatusLocal:", selectedStatusLocal);
    console.log("useMemo: current selectedDateLocal:", selectedDateLocal);
    console.log(
      "useMemo: current searchParams.get('type'):",
      searchParams.get("type")
    );

    let items = historyItems;

    const urlType = searchParams.get("type");
    if (urlType === "denuncia") {
      items = items.filter((item) => item.type === "Denúncia");
      console.log(
        "useMemo: Filtered by type 'Denúncia'. Items left:",
        items.length
      );
    } else if (urlType === "solicitacao") {
      items = items.filter((item) => item.type === "Solicitação");
      console.log(
        "useMemo: Filtered by type 'Solicitação'. Items left:",
        items.length
      );
    }

    if (selectedDateLocal) {
      items = items.filter((item) => item.date === selectedDateLocal);
      console.log("useMemo: Filtered by date. Items left:", items.length);
    }

    if (selectedStatusLocal) {
      items = items.filter((item) => item.status === selectedStatusLocal);
      console.log(
        "useMemo: Filtered by status:",
        selectedStatusLocal,
        ". Items left:",
        items.length
      );
    } else {
      console.log("useMemo: No status selected, not filtering by status.");
    }

    return items;
  }, [
    activeLinkLocal,
    historyItems,
    selectedDateLocal,
    selectedStatusLocal,
    searchParams,
  ]);

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const allPossibleStatuses = useMemo(() => {
    const statuses = new Set(historyItems.map((item) => item.status));
    const sortedStatuses = Array.from(statuses).sort();
    console.log("useMemo: allPossibleStatuses:", sortedStatuses);
    return ["", ...sortedStatuses];
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
              href="/complaints"
              onClick={() => router.push("/complaints")}
              className={getLinkClasses("/complaints", "Nova denúncia")}
            >
              <FiPlus className="mr-3 text-lg" />
              Nova denúncia
            </Link>
            <Link
              href="/records?type=denuncia"
              onClick={() => handleTypeFilterChange("Denúncias feitas")}
              className={getLinkClasses(
                "/records?type=denuncia",
                "Denúncias feitas"
              )}
            >
              <FiList className="mr-3 text-lg" />
              Denúncias feitas
            </Link>
            <div className="border-t border-zinc-300 my-4"></div>
            <Link
              href="/new-solicitacao"
              onClick={() => router.push("/new-solicitacao")}
              className={getLinkClasses("/new-solicitacao", "Nova solicitação")}
            >
              <FiPlus className="mr-3 text-lg" />
              Nova solicitação
            </Link>
            <Link
              href="/records?type=solicitacao"
              onClick={() => handleTypeFilterChange("Solicitações feitas")}
              className={getLinkClasses(
                "/records?type=solicitacao",
                "Solicitações feitas"
              )}
            >
              <FiList className="mr-3 text-lg" />
              Solicitações feitas
            </Link>
            <div className="border-t border-zinc-300 my-4"></div>
            <Link
              href="/records"
              onClick={() => handleTypeFilterChange("Exibir tudo")}
              className={getLinkClasses("/records", "Exibir tudo")}
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

      <main className="flex-1 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">
            Histórico
          </h1>

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
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
                {item.status !== "completo" && (
                  <button
                    className="flex items-center justify-center bg-zinc-900 text-white py-2 px-4 rounded-md font-semibold hover:bg-zinc-800 transition mt-4"
                    onClick={() => handleMarkAsComplete(item.id)}
                  >
                    <FiCheckCircle className="mr-2" />
                    Marcar como completo
                  </button>
                )}
                {item.status === "completo" && (
                  <span className="text-center border-2 border-green-500 text-green-500 py-2 px-4 rounded-md font-semibold mt-4">
                    Resolvido
                  </span>
                )}
              </div>
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
