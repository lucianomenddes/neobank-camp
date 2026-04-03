import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SolanaWalletProvider from "@/context/WalletProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana Neobank",
  description: "Conta bancária on-chain — Bootcamp Hackathon 2026",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        <SolanaWalletProvider>
          {children}
          <Toaster />
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
