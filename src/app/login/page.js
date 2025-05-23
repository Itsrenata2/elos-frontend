"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Aqui você pode validar o login futuramente
    router.push("/records");
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
              Login
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md bg-zinc-300 text-zinc-800 focus:outline-none"
              placeholder="Digite seu login"
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
            />
          </div>
          <button
            type="submit"
            className="w-full bg-zinc-900 text-white py-3 rounded-md font-semibold hover:bg-zinc-800 transition"
          >
            Acessar conta
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
