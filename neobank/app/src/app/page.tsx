"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Landmark, Github } from "lucide-react";
import { BankDashboard } from "@/components/BankDashboard";
import { InitializeAccount } from "@/components/InitializeAccount";
import { NeobankProvider, useNeobankContext } from "@/context/NeobankProvider";

function AppContent() {
  const { connected } = useWallet();
  const { bankState, fetchBankState, isLoading } = useNeobankContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (connected) {
      fetchBankState();
    }
  }, [connected, fetchBankState]);

  if (!mounted) return null;

  if (!connected) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="rounded-full bg-violet-500/10 p-6 border border-violet-500/20">
          <Landmark className="h-12 w-12 text-violet-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Solana Neobank</h1>
          <p className="text-muted-foreground max-w-sm">
            Conta bancária on-chain na Devnet. Conecte sua carteira Phantom para
            começar.
          </p>
        </div>
        <WalletMultiButton />
        <p className="text-xs text-muted-foreground">
          Superteam Brazil × NearX
        </p>
      </div>
    );
  }

  if (isLoading && bankState === null) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-muted-foreground text-sm">Carregando conta...</p>
      </div>
    );
  }

  if (bankState === null) {
    return <InitializeAccount />;
  }

  return <BankDashboard />;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <NeobankProvider>
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Landmark className="h-5 w-5 text-violet-400" />
          <span className="font-semibold text-sm">Solana Neobank</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            · Devnet
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://explorer.solana.com/address/AddjtgBuse2fuZ7y4CipwYJQbnub64M3w8MSh12H12m5?cluster=devnet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Explorer
          </a>
          <a
            href="https://github.com/lucianomendes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
          </a>
          {mounted && <WalletMultiButton />}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <AppContent />
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        Program ID:{" "}
        <span className="font-mono">
          AddjtgBuse2fuZ7y4CipwYJQbnub64M3w8MSh12H12m5
        </span>
      </footer>
    </main>
    </NeobankProvider>
  );
}
