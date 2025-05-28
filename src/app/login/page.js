"use client";

import { useRouter, useSearchParams } from "next/navigation"; // Importe useSearchParams
import Link from "next/link";
import { useState, useEffect } from "react"; // Importe useEffect

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Use o hook useSearchParams

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/records"); // Estado para armazenar o destino final

  // Use useEffect para ler o parâmetro 'redirect' da URL uma vez
  useEffect(() => {
    const redirectParam = searchParams.get("redirect");
    if (redirectParam) {
      setRedirectTo(decodeURIComponent(redirectParam)); // Decodifica o URL para o caminho original
    } else {
      setRedirectTo("/records"); // Padrão se não houver parâmetro 'redirect' (ex: veio do link "login" no menu)
    }
  }, [searchParams]); // Dependência em searchParams para re-executar se os parâmetros da URL mudarem

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const backendLoginUrl = process.env.NEXT_PUBLIC_NESTJS_API_URL_LOGIN;

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
      console.log("Tentando login em:", backendLoginUrl);

      const response = await fetch(backendLoginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await response.text();
      console.log("Status da Resposta:", response.status);
      console.log("Corpo da Resposta (texto puro):", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Erro ao fazer JSON.parse da resposta:", parseError);
        setError(
          "Erro inesperado na resposta do servidor. Consulte o console para mais detalhes."
        );
        setIsLoading(false);
        return;
      }

      if (response.ok) {
        if (data && data.token) {
          localStorage.setItem("authToken", data.token);
          // *** AQUI É A MUDANÇA PRINCIPAL ***
          router.push(redirectTo); // Redireciona para o caminho determinado no useEffect
        } else {
          setError(
            "Login bem-sucedido, mas nenhum token de autenticação foi recebido."
          );
        }
      } else {
        const errorMessage = data.message
          ? Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message
          : "Credenciais inválidas. Tente novamente.";
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Erro na requisição de login:", err);
      setError(
        "Não foi possível conectar ao servidor. Verifique sua conexão ou tente mais tarde."
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
          Bem-vindo de volta!
        </h1>
        <form className="space-y-4" onSubmit={handleLogin}>
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
