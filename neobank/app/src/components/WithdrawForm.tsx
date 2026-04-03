"use client";

import { useState } from "react";
import { Loader2, TrendingDown } from "lucide-react";
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

export function WithdrawForm() {
  const { withdraw, isLoading, error, setError } = useNeobankContext();
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return;
    await withdraw(value);
    setAmount("");
  };

  return (
    <Card className="border-rose-500/20 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingDown className="h-4 w-4 text-rose-400" />
          Sacar
        </CardTitle>
        <CardDescription>Retire SOL da sua conta on-chain</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="withdraw-amount">Valor (SOL)</Label>
            <Input
              id="withdraw-amount"
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
          {error && (
            <Badge variant="destructive" className="w-full justify-center py-1.5">
              {error}
            </Badge>
          )}
          <Button
            type="submit"
            variant="outline"
            className="w-full border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400"
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Sacar"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
