// components/HistoryCard.js
import React from "react";
import { FiCalendar, FiMapPin } from "react-icons/fi"; // Mantenha apenas os ícones que são usados diretamente no HistoryCard
import {
  getStatusColor,
  getSubTypeColor,
  formatDateForDisplay,
} from "../utils/itemHelpers"; // Importe as funções aqui

const HistoryCard = ({ item, children }) => {
  return (
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
              ${getSubTypeColor(item.subType)} // Agora usa a função importada
            `}
            >
              {item.subType}
            </span>
          )}
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize
            ${getStatusColor(item.status)} // Agora usa a função importada
          `}
          >
            {item.status}
          </span>
        </div>

        <h2 className="text-xl font-bold text-zinc-800 mb-2">{item.title}</h2>
        <p className="text-zinc-700 text-sm mb-4">{item.description}</p>

        <div className="flex items-center text-zinc-700 text-sm mb-2">
          <FiCalendar className="mr-2 text-base" />
          <span>Data: {formatDateForDisplay(item.date)}</span>{" "}
          {/* Agora usa a função importada */}
        </div>

        {item.type === "Denúncia" && item.location && (
          <div className="flex items-center text-zinc-700 text-sm">
            <FiMapPin className="mr-2 text-base" />
            <span>Local: {item.location}</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-col gap-2">{children}</div>
    </div>
  );
};

export default HistoryCard;
