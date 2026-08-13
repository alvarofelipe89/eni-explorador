import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Explorador ENI | Innovación en empresas",
  description:
    "Explorador educativo de la Encuesta Nacional de Innovación en Empresas de Chile.",
  openGraph: {
    title: "Explorador ENI",
    description: "Innovación en empresas · Chile · 2021–2022",
    images: [{ url: "/og.png", width: 1672, height: 941 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explorador ENI",
    description: "Innovación en empresas · Chile · 2021–2022",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
