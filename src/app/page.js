/* eslint-disable @next/next/no-img-element */
"use client"; // Add this line if it's not already there

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Home() {
  const router = useRouter(); // Initialize useRouter

  const accordions = [
    {
      title: "Cartilhas para download",
      description: [
        `<a href="https://www.anamatra.org.br/images/LGBTQIA/CARTILHAS/Cartilha_Comiss%C3%A3o_LGBTQIAPN.pdf" target="_blank" rel="noopener noreferrer" class="text-zinc-600 underline">
      Cartilha de Direitos da Comunidade LGBTQIAPN+
    </a>`,
      ],
    },
    {
      title: "Direitos garantidos por lei",
      description: [
        "Direito ao nome social e identidade de gênero",
        "Criminalização da LGBTQIA+fobia (STF, 2019)",
        "Direito ao uso do banheiro de acordo com a identidade de gênero",
        "Acesso à saúde e educação sem discriminação",
      ],
    },
    {
      title: "Canais oficiais de denúncia",
      description: [
        "Disque 100 (Direitos Humanos)",
        "Ouvidorias de Direitos Humanos estaduais",
        "Delegacia Online",
        "Aplicativo Direitos Humanos Brasil",
      ],
    },
    {
      title: "Contatos úteis (Defensoria, ONGs, etc.)",
      description: [
        "Defensoria Pública do Estado: (xx) xxxx-xxxx",
        "ONGs de apoio: Grupo Dignidade, ABGLT, Transgrupo Marcela Prado",
        "Centros de referência em direitos humanos",
        "Atendimento psicológico gratuito: verifique unidades do SUS",
      ],
    },
  ];

  // Function to handle redirection with query parameter
  const handleAuthRedirect = (destinationPath) => {
    router.push(`/login?redirect=${encodeURIComponent(destinationPath)}`);
  };

  return (
    <div className="min-h-screen bg-zinc-200 flex flex-col items-center justify-center py-8 font-jost">
      <div className="absolute top-4 w-full px-8 flex items-center justify-between text-zinc-800">
        <div>
          <img src="/logo-elos.svg" alt="Elos Logo" className="w-24 h-auto" />
        </div>
        <div className="font-bold flex gap-6 items-center">
          {/* These links already go to login/register, no change needed for them */}
          <Link href="/login" className="hover:underline">
            login
          </Link>
          <Link href="/register" className="hover:underline">
            cadastro
          </Link>
        </div>
      </div>
      <div className="pt-20">
        <h1 className="text-4xl font-black mb-4 text-center text-zinc-900 uppercase mx-auto max-w-2xl">
          Sua voz importa. Sua <br /> segurança é prioridade.
        </h1>
        <p className="text-lg font-semibold text-center max-w-2xl mb-8 px-4 mx-auto text-zinc-900">
          Nossa plataforma existe para acolher, registrar e acompanhar denúncias
          de LGBTQIA+fobia, oferecendo também apoio jurídico e psicológico
          gratuito.
        </p>
      </div>
      <hr className="border-zinc-800 w-2/4 mb-8" />
      <h2 className="text-2xl mb-6 text-zinc-900 uppercase font-black">
        Conheça seus direitos
      </h2>
      <div className="w-full max-w-md px-4">
        <Accordion type="single" collapsible>
          {accordions.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-zinc-200 bg-zinc-800 p-4 rounded-md mb-2 hover:bg-zinc-700 font-semibold [&>svg]:text-zinc-200">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="text-zinc-900 bg-white p-4 rounded-md mb-4">
                {Array.isArray(item.description) ? (
                  <ul className="list-disc list-inside space-y-1">
                    {item.description.map((desc, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: desc }} />
                    ))}
                  </ul>
                ) : (
                  <p>{item.description}</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="flex flex-wrap justify-center space-x-4 mt-8 px-4">
        {/* CORRECTED: "Fazer denúncia" now redirects to /complaints */}
        <button
          onClick={() => handleAuthRedirect("/complaints")} // Intended destination is /complaints
          className="text-zinc-900 border-zinc-900 border-2 hover:bg-zinc-900 hover:text-white font-bold py-3 px-6 rounded-full w-full sm:w-auto mb-4"
        >
          Fazer denúncia
        </button>

        {/* This remains for "Acompanhar denúncias" */}
        <button
          onClick={() => handleAuthRedirect("/records")} // Intended destination is /records
          className="hover:border-zinc-900 border-2 bg-zinc-900 text-white font-bold py-3 px-6 rounded-full w-full sm:w-auto mb-4"
        >
          Acompanhar denúncias
        </button>

        {/* This remains for "Solicitar apoio" */}
        <button
          onClick={() => handleAuthRedirect("/requests")} // Intended destination is /requests
          className="text-zinc-900 border-zinc-900 border-2 hover:bg-zinc-900 hover:text-white font-bold py-3 px-6 rounded-full w-full sm:w-auto mb-4"
        >
          Solicitar apoio
        </button>
      </div>
      <div className="mt-12 text-sm text-gray-500 text-center px-4">
        <p>© 2025 Elos. Todos os direitos reservados.</p>
        <p>Desenvolvido com apoio do Núcleo Amado.</p>
      </div>
    </div>
  );
}
