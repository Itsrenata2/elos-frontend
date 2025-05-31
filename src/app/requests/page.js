"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import { FiPlus, FiList, FiLogOut } from "react-icons/fi"; // FiUploadCloud não é necessário aqui
import { useRouter } from "next/navigation";

export default function NovaSolicitacaoPage() {
  const router = useRouter();
  const [tituloSolicitacao, setTituloSolicitacao] = useState("");
  const [tipoSolicitacao, setTipoSolicitacao] = useState("");
  const [motivoSolicitacao, setMotivoSolicitacao] = useState("");
  const [preferenciaAtendimento, setPreferenciaAtendimento] = useState("");
  const [preferenciaGeneroProfissional, setPreferenciaGeneroProfissional] =
    useState("");
  const [concordaTermos, setConcordaTermos] = useState(false);

  const getLinkClasses = (linkPath) =>
    `flex items-center p-3 rounded-md text-sm font-semibold transition-colors
    ${
      router.pathname === linkPath
        ? "bg-zinc-800 text-white"
        : "text-zinc-800 hover:bg-zinc-300"
    }`;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !tituloSolicitacao ||
      !tipoSolicitacao ||
      !motivoSolicitacao ||
      !preferenciaAtendimento ||
      !preferenciaGeneroProfissional ||
      !concordaTermos
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    console.log({
      tituloSolicitacao,
      tipoSolicitacao,
      motivoSolicitacao,
      preferenciaAtendimento,
      preferenciaGeneroProfissional,
      concordaTermos,
    });
    alert("Solicitação enviada com sucesso! (Simulação)");
    setTituloSolicitacao("");
    setTipoSolicitacao("");
    setMotivoSolicitacao("");
    setPreferenciaAtendimento("");
    setPreferenciaGeneroProfissional("");
    setConcordaTermos(false);
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      <Sidebar />
      {/* Main Content - Form for New Request */}
      <main className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-zinc-800 mb-6">
            Nova solicitação
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="tituloSolicitacao"
                className="block text-zinc-700 text-sm font-bold mb-2"
              >
                Título da solicitação*
              </label>
              <input
                type="text"
                id="tituloSolicitacao"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                value={tituloSolicitacao}
                onChange={(e) => setTituloSolicitacao(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="tipoSolicitacao"
                className="block text-zinc-700 text-sm font-bold mb-2"
              >
                Tipo de solicitação*
              </label>
              <select
                id="tipoSolicitacao"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                value={tipoSolicitacao}
                onChange={(e) => setTipoSolicitacao(e.target.value)}
                required
              >
                <option value="">Selecione o tipo</option>
                <option value="psicologico">Apoio Psicológico</option>
                <option value="juridico">Apoio Jurídico</option>
                <option value="social">Apoio Social</option>
                <option value="outros">Outros</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="motivoSolicitacao"
                className="block text-zinc-700 text-sm font-bold mb-2"
              >
                Motivo da solicitação*
              </label>
              <textarea
                id="motivoSolicitacao"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                value={motivoSolicitacao}
                onChange={(e) => setMotivoSolicitacao(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="preferenciaAtendimento"
                className="block text-zinc-700 text-sm font-bold mb-2"
              >
                Preferencia de atendimento*
              </label>
              <select
                id="preferenciaAtendimento"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                value={preferenciaAtendimento}
                onChange={(e) => setPreferenciaAtendimento(e.target.value)}
                required
              >
                <option value="">Selecione a preferência</option>
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="preferenciaGeneroProfissional"
                className="block text-zinc-700 text-sm font-bold mb-2"
              >
                Preferencia de gênero do profissional*
              </label>
              <select
                id="preferenciaGeneroProfissional"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                value={preferenciaGeneroProfissional}
                onChange={(e) =>
                  setPreferenciaGeneroProfissional(e.target.value)
                }
                required
              >
                <option value="">Selecione a preferência</option>
                <option value="sem_preferencia">Sem preferência</option>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
                <option value="nao_binario">Não binário</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="termos"
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                checked={concordaTermos}
                onChange={(e) => setConcordaTermos(e.target.checked)}
                required
              />
              <label htmlFor="termos" className="ml-2 text-zinc-700 text-sm">
                {`Ao clicar em 'Enviar solicitação', você concorda com o envio das informações fornecidas e autoriza seu uso para análise e possível encaminhamento a órgãos competentes, conforme nossa política de privacidade.`}
              </label>
            </div>
            <button
              type="submit"
              className="bg-zinc-900 text-white font-bold py-3 px-6 rounded-md hover:bg-zinc-800 focus:outline-none focus:shadow-outline"
            >
              Enviar solicitação
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
