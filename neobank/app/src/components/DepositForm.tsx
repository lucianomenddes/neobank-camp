"use client";

import { useState } from "react";
import { Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNeobankContext } from "@/context/NeobankProvider";

export function DepositForm() {
  const { deposit, isLoading, error, setError } = useNeobankContext();
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      return;
    }
    await deposit(value);
    setAmount("");
  };

  return (
    <Card className="border-emerald-500/20 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          Depositar
        </CardTitle>
        <CardDescription>Envie SOL para sua conta on-chain</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="deposit-amount">Valor (SOL)</Label>
            <Input
              id="deposit-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setError(null);
              }}
              disabled={isLoading}
            />
          </div>
          {error && error.includes("deposit") && (
            <Badge variant="destructive" className="w-full justify-center">
              {error}
            </Badge>
          )}
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Depositar"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
