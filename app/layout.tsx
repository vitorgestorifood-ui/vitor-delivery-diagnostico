import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Diagnóstico do seu delivery | Vitor do Delivery", description: "Descubra em poucos minutos os principais gargalos do seu delivery e receba uma consultoria gratuita de 30 minutos.", icons: { icon: "/favicon.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
