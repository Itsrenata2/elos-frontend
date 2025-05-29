// utils/itemHelpers.js

export const getStatusColor = (status) => {
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

export const getSubTypeColor = (subType) => {
  switch (subType) {
    case "psicológica":
      return "bg-pink-500 text-white";
    case "jurídica":
      return "bg-indigo-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

export const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};
