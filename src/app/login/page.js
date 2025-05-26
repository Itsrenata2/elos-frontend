"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react"; // Importe useState para gerenciar o estado dos inputs e mensagens de erro

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(""); // Alterado para 'email' para corresponder ao DTO de login
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Estado para indicar carregamento

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Limpa qualquer erro anterior
    setIsLoading(true); // Ativa o estado de carregamento

    try {
      // **URL do endpoint de login do seu NestJS**
      // Use a variável de ambiente definida em .env.local
      // Ex: NEXT_PUBLIC_NESTJS_API_URL_LOGIN=http://localhost:3001/auth/login
      const backendLoginUrl = process.env.NEXT_PUBLIC_NESTJS_API_URL_LOGIN;

      // Verificação para depuração (opcional, pode remover depois)
      if (!backendLoginUrl) {
        console.error(
          "Variável de ambiente NEXT_PUBLIC_NESTJS_API_URL_LOGIN não definida."
        );
        setError(
          "Erro de configuração: URL do backend de login não encontrada."
        );
        setIsLoading(false);
        return;
      }
      console.log("Tentando login em:", backendLoginUrl); // Para depuração

      const response = await fetch(backendLoginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Envia os dados como JSON.
        // As chaves 'email' e 'password' DEVEM CORRESPONDER EXATAMENTE
        // ao que seu LoginAuthDto (no NestJS) espera.
        body: JSON.stringify({ email, password }),
      });

      // **DEBUG: log da resposta bruta antes de tentar JSON.parse**
      const responseText = await response.text();
      console.log("Status da Resposta:", response.status);
      console.log("Corpo da Resposta (texto puro):", responseText);

      let data;
      try {
        data = JSON.parse(responseText); // Tenta parsear a resposta como JSON
      } catch (parseError) {
        console.error("Erro ao fazer JSON.parse da resposta:", parseError);
        setError(
          "Erro inesperado na resposta do servidor. Consulte o console para mais detalhes."
        );
        setIsLoading(false);
        return; // Interrompe a execução
      }

      if (response.ok) {
        // Assumindo que o NestJS retorna um token JWT na propriedade 'token' (NÃO 'access_token')
        if (data && data.token) {
          // <-- MUDAR AQUI: de data.access_token para data.token
          localStorage.setItem("authToken", data.token); // <-- E AQUI: de data.access_token para data.token
          router.push("/records"); // Redireciona para a página de records
        } else {
          setError(
            "Login bem-sucedido, mas nenhum token de autenticação foi recebido."
          );
        }
      } else {
        // Lida com erros do backend (ex: 401 Unauthorized, 400 Bad Request)
        // NestJS geralmente retorna erros de validação como um array de strings em 'message'
        const errorMessage = data.message
          ? Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message
          : "Credenciais inválidas. Tente novamente.";
        setError(errorMessage);
      }
    } catch (err) {
      // Lida com erros de rede ou outros problemas na requisição (servidor offline, CORS)
      console.error("Erro na requisição de login:", err);
      setError(
        "Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde."
      );
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento, independentemente do sucesso ou falha
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="bg-zinc-100 p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/logo-elos.svg" alt="Elos Logo" className="h-10" />
        </div>
        <h1 className="text-center text-lg font-bold mb-6 uppercase text-zinc-800">
          Bem-vindo de volta!
        </h1>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-semibold text-zinc-800 mb-1">
              E-mail
            </label>
            <input
              type="email" // Alterado para type="email" para melhor validação do navegador
              className="w-full px-4 py-2 rounded-md bg-zinc-300 text-zinc-800 focus:outline-none"
              placeholder="Digite seu e-mail"
              value={email} // Conecta ao estado 'email'
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
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-zinc-900 text-white py-3 rounded-md font-semibold hover:bg-zinc-800 transition"
            disabled={isLoading}
          >
            {isLoading ? "Acessando..." : "Acessar conta"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-zinc-700">
          Não tem conta?{" "}
          <Link href="/register" className="underline font-semibold">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
