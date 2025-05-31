// pages/register/page.js
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { notify } from "../../utils/toastUtils"; // Importe seu utilitário de toast

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Removendo o estado 'error' local, pois os erros serão exibidos via toast
  // const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    // Não precisamos mais limpar o estado de erro, pois o toast é efêmero
    // setError("");
    setIsLoading(true);
    try {
      // **URL do endpoint de registro do seu NestJS**
      const backendRegisterUrl =
        process.env.NEXT_PUBLIC_NESTJS_API_URL_REGISTER;

      if (!backendRegisterUrl) {
        console.error(
          "Variável de ambiente NEXT_PUBLIC_API_URL_REGISTER não definida."
        );
        notify.error(
          "Erro de configuração: URL do backend de registro não encontrada."
        );
        setIsLoading(false);
        return;
      }
      console.log("Tentando registrar em:", backendRegisterUrl);

      const response = await fetch(backendRegisterUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      // **DEBUG: log da resposta bruta antes de tentar JSON.parse**
      const responseText = await response.text();
      console.log("Status da Resposta:", response.status);
      console.log("Corpo da Resposta (texto puro):", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Erro ao fazer JSON.parse da resposta:", parseError);
        notify.error(
          "Erro inesperado na resposta do servidor. Consulte o console para mais detalhes."
        );
        setIsLoading(false);
        return;
      }

      if (response.ok) {
        notify.success(
          "Cadastro realizado com sucesso! Faça login para acessar sua conta."
        );
        router.push("/login");
      } else {
        const errorMessage = data.message
          ? Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message
          : "Erro ao criar conta. Verifique os dados e tente novamente.";
        notify.error(errorMessage);
      }
    } catch (err) {
      console.error("Erro na requisição de registro:", err);
      notify.error(
        "Não foi possível conectar ao servidor. Tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="bg-zinc-100 p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/logo-elos.svg" alt="Elos Logo" className="h-10" />
        </div>
        <h1 className="text-center text-lg font-bold mb-6 uppercase text-zinc-800">
          Crie sua conta!
        </h1>
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm font-semibold text-zinc-800 mb-1">
              Nome
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md bg-zinc-300 text-zinc-800 focus:outline-none"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-800 mb-1">
              E-mail
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-md bg-zinc-300 text-zinc-800 focus:outline-none"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-800 mb-1">
              Senha
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md bg-zinc-300 text-zinc-800 focus:outline-none"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {/* Removendo a exibição do erro aqui, pois será feita via toast */}
          {/* {error && <p className="text-red-500 text-sm text-center">{error}</p>} */}
          <button
            type="submit"
            className="w-full bg-zinc-900 text-white py-3 rounded-md font-semibold hover:bg-zinc-800 transition"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-700">
          Já tem conta?{" "}
          <Link href="/login" className="underline font-semibold">
            Faça o login
          </Link>
        </p>
      </div>
    </div>
  );
}
