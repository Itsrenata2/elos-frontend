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

  const [filterState, setFilterState] = useState({
    activeLink: initialActiveLink,
    typeParam: searchParams.get("type") || "", // Adiciona typeParam diretamente ao estado
    date: "",
    status: "",
  });

  // Função para mapear o nome do link da sidebar para o parâmetro 'type' da URL
  // Agora recebe o linkTypeMapping para ser mais genérico
  const getTypeParamFromLinkName = useCallback(
    (linkName) => {
      // Usa o mapeamento fornecido, se o linkName existir, retorna o tipo
      if (linkTypeMapping[linkName] !== undefined) {
        return linkTypeMapping[linkName];
      }
      return ""; // Padrão para quando não há um tipo específico (Ex: "Exibir tudo")
    },
    [linkTypeMapping]
  );

  // Função para atualizar os parâmetros da URL.
  // Será chamada pelo handleFilterChange.
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
        router.push(newUrl, { shallow: true });
      }
    },
    [searchParams, router, pathname]
  );

  // Função genérica para mudar qualquer filtro e atualizar a URL
  const handleFilterChange = useCallback(
    (filterName, value) => {
      setFilterState((prevState) => {
        let newState = { ...prevState, [filterName]: value };

        // Lógica específica para quando o 'activeLink' (link da sidebar) muda
        if (filterName === "activeLink") {
          // Se for "Gerenciar Usuários" (apenas para admin), navega diretamente e reseta filtros
          if (isAdmin && value === "Gerenciar Usuários") {
            router.push("/admin/users", { shallow: true });
            return {
              activeLink: "Gerenciar Usuários",
              typeParam: "",
              date: "",
              status: "",
            };
          }
          // Mapeia o nome do link para o 'typeParam' da URL
          newState.typeParam = getTypeParamFromLinkName(value);
          // Quando um link da sidebar é clicado, geralmente queremos limpar outros filtros
          newState.date = "";
          newState.status = "";
        }

        // Determina os parâmetros da URL a serem atualizados
        const paramsToUpdate = {
          type: newState.typeParam,
          date: newState.date,
          status: newState.status,
        };

        // Chama updateUrlParams para refletir as mudanças na URL
        updateUrlParams(paramsToUpdate);

        return newState;
      });
    },
    [isAdmin, getTypeParamFromLinkName, updateUrlParams, router]
  );

  // Sincroniza estados locais com a URL no carregamento ou mudança da URL
  // ESTE useEffect DEVE APENAS LER E ATUALIZAR O ESTADO LOCAL, NUNCA NAVEGAR.
  useEffect(() => {
    const urlType = searchParams.get("type") || "";
    const urlDate = searchParams.get("date") || "";
    const urlStatus = searchParams.get("status") || "";

    let newActiveLink = initialActiveLink;

    // Lógica para determinar o activeLink baseado na URL atual
    // Itera sobre o linkTypeMapping para encontrar o nome do link correspondente ao urlType
    let foundActiveLinkByUrl = false;
    for (const linkName in linkTypeMapping) {
      if (linkTypeMapping[linkName] === urlType) {
        newActiveLink = linkName;
        foundActiveLinkByUrl = true;
        break;
      }
    }

    // Caso o urlType seja vazio e a URL seja o caminho base (records ou admin),
    // o "Exibir tudo" deve ser o ativo.
    if (
      !foundActiveLinkByUrl &&
      urlType === "" &&
      (pathname === "/records" || pathname === "/admin")
    ) {
      // Encontra o nome do link que mapeia para vazio (Exibir tudo)
      for (const linkName in linkTypeMapping) {
        if (linkTypeMapping[linkName] === "") {
          newActiveLink = linkName;
          break;
        }
      }
    }

    // Lógica específica para Gerenciar Usuários no Admin
    if (isAdmin && pathname === "/admin/users") {
      newActiveLink = "Gerenciar Usuários";
    }

    setFilterState({
      activeLink: newActiveLink,
      typeParam: urlType, // Atualiza typeParam do estado com o da URL
      date: urlDate,
      status: urlStatus,
    });
  }, [searchParams, pathname, initialActiveLink, linkTypeMapping, isAdmin]);

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
    // Não precisamos expor getTypeParamFromLinkName diretamente aqui
  };
}
