"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar lógica de criação de conta
    router.push("/records");
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
            Criar conta
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
