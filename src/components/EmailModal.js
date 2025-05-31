// components/EmailModal.js
"use client";

import { useState, useEffect } from "react";
// import { notify } from "../utils/toast-utils";

const EmailModal = ({ isOpen, onClose, item, onSendEmail }) => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  useEffect(() => {
    if (item) {
      setRecipientEmail(""); // Limpa o email anterior ao abrir para um novo item
      setEmailSubject(`Encaminhamento de ${item.type}: ${item.title}`);
      setEmailBody(
        `Detalhes da ${item.type}:\n\n` +
          `Título: ${item.title}\n` +
          `Descrição: ${item.description}\n` +
          `Data: ${item.date}\n` +
          (item.location ? `Local: ${item.location}\n` : "") +
          `Status Atual: ${item.status}\n\n` +
          `Por favor, tome as ações necessárias.`
      );
    }
  }, [item]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendEmail(item.id, recipientEmail, emailSubject, emailBody);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-zinc-800 mb-4">
          Encaminhar por Email
        </h2>
        {item && (
          <div className="mb-4 text-zinc-700">
            <p className="font-semibold">Item: {item.title}</p>
            <p className="text-sm">Tipo: {item.type}</p>
            <p className="text-sm">Status: {item.status}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="recipient-email"
              className="block text-zinc-700 text-sm font-bold mb-2"
            >
              Email do Destinatário:
            </label>
            <input
              type="email"
              id="recipient-email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email-subject"
              className="block text-zinc-700 text-sm font-bold mb-2"
            >
              Assunto:
            </label>
            <input
              type="text"
              id="email-subject"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email-body"
              className="block text-zinc-700 text-sm font-bold mb-2"
            >
              Corpo do Email:
            </label>
            <textarea
              id="email-body"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              required
            ></textarea>
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
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Enviar Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;
