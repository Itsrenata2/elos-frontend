// pages/nova-denuncia/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import { FiPlus, FiList, FiLogOut, FiUploadCloud } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { notify } from "../../utils/toastUtils";

export default function NovaDenunciaPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataOcorrido, setDataOcorrido] = useState("");
  const [localOcorrido, setLocalOcorrido] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("Bahia");
  const [arquivos, setArquivos] = useState(null);
  const [concordaTermos, setConcordaTermos] = useState(false);

  // Access the environment variable
  const NESTJS_API_URL = process.env.NEXT_PUBLIC_NESTJS_API_URL;

  const handleSubmit = async (event) => {
    // Made handleSubmit async
    event.preventDefault();

    if (!titulo || !tipo || !descricao || !arquivos || !concordaTermos) {
      notify.error(
        "Por favor, preencha todos os campos obrigatórios e anexe pelo menos um arquivo."
      );
      return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("tipo", tipo);
    formData.append("descricao", descricao);
    formData.append("dataOcorrido", dataOcorrido);
    formData.append("localOcorrido", localOcorrido);
    formData.append("cidade", cidade);
    formData.append("estado", estado);
    Array.from(arquivos).forEach((file) => {
      formData.append("arquivos", file); // 'arquivos' should match the field name in your NestJS multer setup
    });

    try {
      // Use the API URL from the environment variable
      const response = await fetch(`${NESTJS_API_URL}/denuncias`, {
        // Adjust endpoint as needed
        method: "POST",
        body: formData,
        // No 'Content-Type': 'multipart/form-data' header needed here; fetch sets it automatically with FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao enviar denúncia.");
      }

      notify.success("Denúncia enviada com sucesso!");
      // Optionally, redirect the user after successful submission
      router.push("/dashboard"); // Example: redirect to a dashboard page

      // Clear the form after submission
      setTitulo("");
      setTipo("");
      setDescricao("");
      setDataOcorrido("");
      setLocalOcorrido("");
      setCidade("");
      setEstado("Bahia");
      setArquivos(null);
      setConcordaTermos(false);
    } catch (error) {
      console.error("Erro ao enviar denúncia:", error);
      notify.error(`Falha ao enviar denúncia: ${error.message}`);
    }
  };

  const handleArquivoChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      setArquivos(selectedFiles);
    } else {
      setArquivos(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      setArquivos(droppedFiles);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-zinc-800 mb-6">
            Nova denúncia
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="titulo"
                className="block text-zinc-700 text-sm font-bold mb-2"
              >
                Título da denúncia*
              </label>
              <input
                type="text"
                id="titulo"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="tipo"
                className="block text-zinc-700 text-sm font-bold mb-2"
              >
                Tipo de denúncia*
              </label>
              <select
                id="tipo"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              >
                <option value="">Selecione o tipo</option>
                <option value="assedio">Assédio</option>
                <option value="discriminacao">Discriminação</option>
                <option value="violencia">Violência</option>
                <option value="outros">Outros</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="descricao"
                className="block text-zinc-700 text-sm font-bold mb-2"
              >
                Descrição da denúncia*
              </label>
              <textarea
                id="descricao"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <label
                htmlFor="dataOcorrido"
                className="block text-zinc-700 text-sm font-bold mb-2"
              >
                Data do ocorrido (opcional)
              </label>
              <input
                type="date"
                id="dataOcorrido"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                value={dataOcorrido}
                onChange={(e) => setDataOcorrido(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="localOcorrido"
                className="block text-zinc-700 text-sm font-bold mb-2"
              >
                Local do ocorrido (opcional)
              </label>
              <input
                type="text"
                id="localOcorrido"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                value={localOcorrido}
                onChange={(e) => setLocalOcorrido(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="cidade"
                className="block text-zinc-700 text-sm font-bold mb-2"
              >
                Cidade (opcional)
              </label>
              <input
                type="text"
                id="cidade"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="estado"
                className="block text-zinc-700 text-sm font-bold mb-2"
              >
                Estado
              </label>
              <select
                id="estado"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 leading-tight focus:outline-none focus:shadow-outline"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="Bahia">Bahia</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="arquivos"
                className="block text-zinc-700 text-sm font-bold mb-2"
              >
                Anexar arquivos (imagem, vídeo, áudio, PDF...)*
              </label>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed rounded-lg p-6 text-center text-zinc-500 cursor-pointer hover:border-blue-500 transition-colors"
              >
                {arquivos && arquivos.length > 0 ? (
                  <p>
                    Arquivos selecionados:{" "}
                    {Array.from(arquivos)
                      .map((file) => file.name)
                      .join(", ")}
                  </p>
                ) : (
                  <>
                    <FiUploadCloud className="w-12 h-12 mx-auto mb-2 text-zinc-400" />
                    <p className="text-sm">
                      Insira aqui os arquivos ou arraste para esse campo os
                      arquivos
                    </p>
                    <input
                      type="file"
                      id="arquivos"
                      className="hidden"
                      onChange={handleArquivoChange}
                      multiple
                      accept="image/*,video/*,audio/*,.pdf"
                    />
                    <label
                      htmlFor="arquivos"
                      className="text-blue-600 hover:underline text-sm cursor-pointer"
                    >
                      Clique para selecionar arquivos
                    </label>
                  </>
                )}
              </div>
              {!arquivos && (
                <p className="text-red-500 text-xs mt-1">
                  É necessário anexar pelo menos um arquivo.
                </p>
              )}
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
                {`Ao clicar em 'Enviar denúncia', você concorda com o envio das informações fornecidas e autoriza seu uso para análise e possível encaminhamento a órgãos competentes, conforme nossa política de privacidade.`}
              </label>
            </div>
            <button
              type="submit"
              className="bg-zinc-900 text-white font-bold py-3 px-6 rounded-md hover:bg-zinc-800 focus:outline-none focus:shadow-outline"
            >
              Enviar denúncia
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
