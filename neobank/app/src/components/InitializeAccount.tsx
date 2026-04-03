"use client";

import { Loader2, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNeobankContext } from "@/context/NeobankProvider";

export function InitializeAccount() {
  const { initialize, isLoading, error } = useNeobankContext();

  return (
    <Card className="w-full max-w-sm border-violet-500/20 bg-gradient-to-br from-card to-violet-950/20">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="rounded-full bg-violet-500/10 p-4 border border-violet-500/20">
            <Landmark className="h-8 w-8 text-violet-400" />
          </div>
        </div>
        <CardTitle>Bem-vindo ao Neobank</CardTitle>
        <CardDescription>
          Você ainda não possui uma conta on-chain. Crie agora para começar a
          depositar e sacar SOL.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
        <Button
          className="w-full bg-violet-600 hover:bg-violet-700"
          onClick={initialize}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            "Abrir Conta"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
