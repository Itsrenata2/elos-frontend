// components/StatusEditModal.js
"use client";

import { useState, useEffect } from "react";
import { notify } from "../utils/toastUtils"; // Ajuste o caminho conforme sua estrutura de pastas

const StatusEditModal = ({ isOpen, onClose, item, onSaveStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (item) {
      setSelectedStatus(item.status);
    }
  }, [item]);

  if (!isOpen) return null;

  const validStatuses = ["recebido", "em análise", "encaminhado", "completo"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStatus) {
      onSaveStatus(item.id, selectedStatus);
      onClose();
    } else {
      notify.error("Por favor, selecione um status.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-zinc-800 mb-4">
          Editar Status do Item
        </h2>
        {item && (
          <div className="mb-4 text-zinc-700">
            <p className="font-semibold">Item: {item.title}</p>
            <p className="text-sm">Tipo: {item.type}</p>
            <p className="text-sm">Status Atual: {item.status}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="status-select"
              className="block text-zinc-700 text-sm font-bold mb-2"
            >
              Novo Status:
            </label>
            <select
              id="status-select"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              required
            >
              <option value="" disabled>
                Selecione um status
              </option>
              {validStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Salvar Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusEditModal;
