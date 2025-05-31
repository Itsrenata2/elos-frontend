// utils/itemHelpers.js

/**
 * Retorna as classes CSS para a cor de fundo e texto de um status específico.
 * @param {string} status O status do item (e.g., "Recebido", "Em análise", "Encaminhado", "Completo").
 * @returns {string} As classes CSS do Tailwind.
 */

export const formatDateForDisplay = (dateString) => {
  // <-- Verifique se 'export const' está aqui
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

export const getStatusColor = (status) => {
  const normalizedStatus = status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  console.log(
    `[getStatusColor] Input: "${status}" -> Normalized: "${normalizedStatus}"`
  ); // <-- CRUCIAL PARA DEPURAR

  switch (normalizedStatus) {
    case "recebido": // Certifique-se de que este seja EXATAMENTE o que você espera após a normalização
      return "bg-yellow-500 text-white";
    case "em analise": // Certifique-se de que este seja EXATAMENTE o que você espera após a normalização
      return "bg-orange-500 text-white";
    case "encaminhado": // Certifique-se de que este seja EXATAMENTE o que você espera após a normalização
      return "bg-purple-500 text-white";
    case "completo": // ESTE ESTÁ FUNCIONANDO, então o case está correto!
      return "bg-green-500 text-white";
    default:
      console.warn(
        `[getStatusColor] Status desconhecido ou não mapeado: "${status}" (normalized: "${normalizedStatus}"). Retornando cor padrão.`
      );
      return "bg-gray-400 text-white";
  }
};

export const getSubTypeColor = (subType) => {
  const normalizedSubType = subType
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  console.log(
    `[getSubTypeColor] Input: "${subType}" -> Normalized: "${normalizedSubType}"`
  ); // <-- CRUCIAL PARA DEPURAR

  switch (normalizedSubType) {
    case "psicologica": // Certifique-se de que este seja EXATAMENTE o que você espera após a normalização
      return "bg-pink-500 text-white";
    case "juridica": // Certifique-se de que este seja EXATAMENTE o que você espera após a normalização
      return "bg-teal-500 text-white";
    case "social":
      return "bg-indigo-500 text-white";
    default:
      console.warn(
        `[getSubTypeColor] Subtipo desconhecido ou não mapeado: "${subType}" (normalized: "${normalizedSubType}"). Retornando cor padrão.`
      );
      return "bg-gray-400 text-white";
  }
};

// Mantenha getTypeColor e formatDateForDisplay inalteradas se já estão funcionando.
// Caso contrário, use as versões normalizadas que passei na última resposta.
