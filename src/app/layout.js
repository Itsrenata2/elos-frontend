import "./globals.css";
import { Jost } from "next/font/google";

const jost = Jost({ subsets: ["latin"] });

export const metadata = {
  title: "Elos - Sua voz importa.",
  description:
    "Plataforma para denúncias de LGBTQIA+fobia e apoio jurídico/psicológico.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={jost.className}>{children}</body>
    </html>
  );
}
