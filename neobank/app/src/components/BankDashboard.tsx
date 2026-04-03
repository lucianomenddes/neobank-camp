"use client";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Loader2, RefreshCw, ExternalLink, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DepositForm } from "@/components/DepositForm";
import { WithdrawForm } from "@/components/WithdrawForm";
import { useNeobankContext } from "@/context/NeobankProvider";

export function BankDashboard() {
  const { bankState, bankPda, txSignature, fetchBankState, isLoading } =
    useNeobankContext();

  const balanceSol = bankState
    ? (bankState.balance / LAMPORTS_PER_SOL).toFixed(4)
    : "0.0000";

  return (
    <div className="w-full max-w-lg space-y-4">
      {/* Saldo */}
      <Card className="border-violet-500/20 bg-gradient-to-br from-card to-violet-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-violet-400" />
              <CardTitle>Minha Conta</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">Devnet</Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={fetchBankState}
                disabled={isLoading}
                className="h-8 w-8"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
          <CardDescription className="truncate font-mono text-xs">
            {bankPda?.toBase58()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-1">Saldo disponível</p>
            <p className="text-5xl font-bold tracking-tight">
              {balanceSol}
              <span className="text-2xl text-muted-foreground ml-2">SOL</span>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              ≈ {bankState?.balance.toLocaleString() ?? 0} lamports
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Formulários */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DepositForm />
        <WithdrawForm />
      </div>

      {/* Link transação */}
      {txSignature && (
        <Card className="border-violet-500/20">
          <CardContent className="pt-4 pb-4">
            <a
              href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              <span className="truncate font-mono text-xs">{txSignature}</span>
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
