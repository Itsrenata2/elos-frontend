// src/hooks/useUrlFilters.js
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback, useEffect } from "react";

/**
 * Hook para gerenciar filtros de URL (type, date, status) e sincronizar com o estado local.
 *
 * @param {string} initialActiveLink O nome do link ativo inicial (ex: "Exibir tudo").
 * @param {object} linkTypeMapping Um objeto mapeando nomes de link da sidebar para seus 'type' params (ex: { "Denúncias feitas": "denuncia" }).
 * @param {boolean} isAdmin Indica se o hook está sendo usado no contexto de admin.
 */
export function useUrlFilters(
  initialActiveLink = "Exibir tudo",
  linkTypeMapping = {},
  isAdmin = false
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Inicializa o estado com base nos searchParams ATUAIS da URL.
  // Isso garante que o estado inicial já reflita a URL.
  const [filterState, setFilterState] = useState(() => {
    const urlType = searchParams.get("type") || "";
    const urlDate = searchParams.get("date") || "";
    const urlStatus = searchParams.get("status") || "";

    let initialLink = initialActiveLink;
    // Tenta encontrar o activeLink com base na URL inicial
    for (const linkName in linkTypeMapping) {
      if (linkTypeMapping[linkName] === urlType) {
        initialLink = linkName;
        break;
      }
    }
    if (isAdmin && pathname === "/admin/users") {
      initialLink = "Gerenciar Usuários"; // Se for a página de usuários no admin
    }

    return {
      activeLink: initialLink,
      typeParam: urlType,
      date: urlDate,
      status: urlStatus,
    };
  });

  // Função para atualizar os parâmetros da URL.
  // Esta função SÓ DEVE SER CHAMADA EM RESPOSTA A EVENTOS (cliques, submits, etc.)
  const updateUrlParams = useCallback(
    (newParams) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      Object.keys(newParams).forEach((key) => {
        const value = newParams[key];
        if (value === null || value === undefined || value === "") {
          currentParams.delete(key);
        } else {
          currentParams.set(key, value);
        }
      });

      const newUrl = `${pathname}?${currentParams.toString()}`;
      if (router.asPath !== newUrl) {
        // router.push deve ser chamado APENAS em resposta a eventos
        router.push(newUrl, { shallow: true });
      }
    },
    [searchParams, router, pathname]
  );

  // Mapeamento de link para tipo (passado como prop)
  const getTypeParamFromLinkName = useCallback(
    (linkName) => {
      if (linkTypeMapping[linkName] !== undefined) {
        return linkTypeMapping[linkName];
      }
      return "";
    },
    [linkTypeMapping]
  );

  // Função genérica para mudar qualquer filtro e ATUALIZAR A URL
  const handleFilterChange = useCallback(
    (filterName, value) => {
      setFilterState((prevState) => {
        let newState = { ...prevState, [filterName]: value };

        if (filterName === "activeLink") {
          if (isAdmin && value === "Gerenciar Usuários") {
            router.push("/admin/users", { shallow: true });
            // Se navegamos, não precisamos atualizar o estado local aqui,
            // o useEffect na nova página ou a própria Next.js lidará com isso.
            return {
              activeLink: "Gerenciar Usuários",
              typeParam: "",
              date: "",
              status: "",
            };
          }
          newState.typeParam = getTypeParamFromLinkName(value);
          newState.date = "";
          newState.status = "";
        }

        const paramsToUpdate = {
          type: newState.typeParam,
          date: newState.date,
          status: newState.status,
        };

        // Chama updateUrlParams APENAS AQUI (em resposta a uma mudança de filtro)
        updateUrlParams(paramsToUpdate);

        return newState;
      });
    },
    [isAdmin, getTypeParamFromLinkName, updateUrlParams, router]
  );

  // UseEffect para sincronizar o estado LOCAL do hook com as mudanças na URL.
  // Este useEffect NÃO DEVE CHAMAR router.push.
  // Ele APENAS LÊ a URL e atualiza o estado interno do hook.
  useEffect(() => {
    const urlType = searchParams.get("type") || "";
    const urlDate = searchParams.get("date") || "";
    const urlStatus = searchParams.get("status") || "";

    let newActiveLink = initialActiveLink;

    let foundActiveLinkByUrl = false;
    for (const linkName in linkTypeMapping) {
      if (linkTypeMapping[linkName] === urlType) {
        newActiveLink = linkName;
        foundActiveLinkByUrl = true;
        break;
      }
    }

    if (
      !foundActiveLinkByUrl &&
      urlType === "" &&
      (pathname === "/records" || pathname === "/admin")
    ) {
      for (const linkName in linkTypeMapping) {
        if (linkTypeMapping[linkName] === "") {
          // Mapeia "Exibir tudo"
          newActiveLink = linkName;
          break;
        }
      }
    }

    if (isAdmin && pathname === "/admin/users") {
      newActiveLink = "Gerenciar Usuários";
    }

    // Apenas atualiza o estado local do hook com base na URL
    setFilterState({
      activeLink: newActiveLink,
      typeParam: urlType,
      date: urlDate,
      status: urlStatus,
    });
  }, [searchParams, pathname, initialActiveLink, linkTypeMapping, isAdmin]); // Dependências do useEffect

  return {
    filterState,
    handleFilterChange,
    handleDateFilterChange: useCallback(
      (e) => handleFilterChange("date", e.target.value),
      [handleFilterChange]
    ),
    handleStatusFilterChange: useCallback(
      (e) => handleFilterChange("status", e.target.value),
      [handleFilterChange]
    ),
    clearFilter: useCallback(
      (filterName) => handleFilterChange(filterName, ""),
      [handleFilterChange]
    ),
  };
}
