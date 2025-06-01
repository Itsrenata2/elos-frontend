// pages/nova-solicitacao/page.js
"use client";

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/navigation";
import { notify } from "../../utils/toastUtils";
import Cookies from "js-cookie"; // Importar Cookies para pegar o token

export default function NovaSolicitacaoPage() {
  const router = useRouter();
  const [tituloSolicitacao, setTituloSolicitacao] = useState("");
  const [tipoSolicitacao, setTipoSolicitacao] = useState("");
  const [motivoSolicitacao, setMotivoSolicitacao] = useState("");
  const [preferenciaAtendimento, setPreferenciaAtendimento] = useState("");
  const [preferenciaGeneroProfissional, setPreferenciaGeneroProfissional] =
    useState("");
  const [concordaTermos, setConcordaTermos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (
      !tituloSolicitacao ||
      !tipoSolicitacao ||
      !motivoSolicitacao ||
      !preferenciaAtendimento ||
      !preferenciaGeneroProfissional ||
      !concordaTermos
    ) {
      notify.error(
        "Por favor, preencha todos os campos obrigatórios e aceite os termos."
      );
      setIsLoading(false);
      return;
    }

    if (tituloSolicitacao.length < 3 || tituloSolicitacao.length > 50) {
      notify.error("O título da solicitação deve ter entre 3 e 50 caracteres.");
      setIsLoading(false);
      return;
    }

    if (motivoSolicitacao.length < 3 || motivoSolicitacao.length > 190) {
      notify.error(
        "A descrição da solicitação deve ter entre 3 e 190 caracteres."
      );
      setIsLoading(false);
      return;
    }

    try {
      const requestBody = {
        title: tituloSolicitacao,
        description: motivoSolicitacao,
        type: tipoSolicitacao,
      };

      console.log("Dados a serem enviados para o backend:", requestBody);

      // Usar a URL base e adicionar o caminho do endpoint de criação de solicitação
      const backendSupportRequestUrl = `${process.env.NEXT_PUBLIC_NESTJS_API_URL}/support-requests`; // Exemplo

      if (!backendSupportRequestUrl) {
        console.error(
          "Variável de ambiente NEXT_PUBLIC_NESTJS_API_URL não definida ou incorreta."
        );
        notify.error(
          "Erro de configuração: URL do backend de solicitação não encontrada."
        );
        setIsLoading(false);
        return;
      }

      // Alterado para Cookies.get para consistência, se você estiver usando js-cookie
      const authToken = Cookies.get("authToken");
      if (!authToken) {
        notify.error("Você precisa estar logado para enviar uma solicitação.");
        setIsLoading(false);
        router.push("/login");
        return;
      }

      const response = await fetch(backendSupportRequestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      console.log("Status da Resposta:", response.status);
      console.log("Corpo da Resposta (texto puro):", responseText);

      if (response.ok) {
        notify.success("Solicitação enviada com sucesso!");
        setTituloSolicitacao("");
        setTipoSolicitacao("");
        setMotivoSolicitacao("");
        setPreferenciaAtendimento("");
        setPreferenciaGeneroProfissional("");
        setConcordaTermos(false);
      } else {
        let errorMessage = "Erro ao enviar solicitação. Tente novamente.";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message
            ? Array.isArray(errorData.message)
              ? errorData.message.join(", ")
              : errorData.message
            : errorMessage;
        } catch (parseError) {
          console.error(
            "Erro ao fazer JSON.parse do erro da resposta:",
            parseError
          );
        }
        notify.error(errorMessage);
      }
    } catch (err) {
      console.error("Erro na requisição de solicitação:", err);
      notify.error(
        "Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      <Sidebar />
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
                placeholder="Ex: Dúvida sobre como fazer uma denúncia"
                value={tituloSolicitacao}
                onChange={(e) => setTituloSolicitacao(e.target.value)}
                required
                maxLength={50}
              />
              <p className="text-xs text-zinc-500 mt-1">
                Mínimo 3, máximo 50 caracteres.
              </p>
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
                <option value="PSICOLOGICO">Apoio Psicológico</option>{" "}
                {/* Alterado para maiúsculas se o backend espera */}
                <option value="JURIDICO">Apoio Jurídico</option>{" "}
                {/* Alterado para maiúsculas se o backend espera */}
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
                placeholder="Ex: Estou com dificuldades técnicas para elaborar uma denúncia formal"
                value={motivoSolicitacao}
                onChange={(e) => setMotivoSolicitacao(e.target.value)}
                required
                maxLength={190}
              ></textarea>
              <p className="text-xs text-zinc-500 mt-1">
                Mínimo 3, máximo 190 caracteres.
              </p>
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
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar solicitação"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
