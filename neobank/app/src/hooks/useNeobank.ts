"use client";

import { useState, useCallback } from "react";
import { useConnection, useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, SystemProgram } from "@solana/web3.js";
import BN from "bn.js";
import { getProgram, getBankPda } from "@/lib/program";

export interface BankState {
  owner: string;
  balance: number; // in lamports
  bump: number;
}

export function useNeobank() {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet();
  const { publicKey } = useWallet();

  const [bankState, setBankState] = useState<BankState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const bankPda = publicKey ? getBankPda(publicKey) : null;

  const fetchBankState = useCallback(async () => {
    if (!anchorWallet || !publicKey) return null;
    try {
      const program = getProgram(anchorWallet, connection);
      const pda = getBankPda(publicKey);
      const account = await (program.account as any).bankState.fetch(pda);
      const state: BankState = {
        owner: account.owner.toBase58(),
        balance: account.balance.toNumber(),
        bump: account.bump,
      };
      setBankState(state);
      return state;
    } catch {
      setBankState(null);
      return null;
    }
  }, [anchorWallet, connection, publicKey]);

  const initialize = useCallback(async () => {
    if (!anchorWallet || !publicKey || !bankPda) return;
    setIsLoading(true);
    setError(null);
    setTxSignature(null);
    try {
      const program = getProgram(anchorWallet, connection);
      const tx = await (program.methods as any)
        .initialize()
        .accounts({
          bankAccount: bankPda,
          user: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc({ skipPreflight: true, commitment: "confirmed" });
      setTxSignature(tx);
      await fetchBankState();
    } catch (err: any) {
      setError(err?.message ?? "Erro ao inicializar a conta.");
    } finally {
      setIsLoading(false);
    }
  }, [anchorWallet, connection, publicKey, bankPda, fetchBankState]);

  const deposit = useCallback(
    async (amountSol: number) => {
      if (!anchorWallet || !publicKey || !bankPda) return;
      setIsLoading(true);
      setError(null);
      setTxSignature(null);
      try {
        const program = getProgram(anchorWallet, connection);
        const amount = new BN(Math.floor(amountSol * LAMPORTS_PER_SOL));
        const tx = await (program.methods as any)
          .deposit(amount)
          .accounts({
            bankAccount: bankPda,
            user: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc({ skipPreflight: true, commitment: "confirmed" });
        setTxSignature(tx);
        await fetchBankState();
      } catch (err: any) {
        setError(err?.message ?? "Erro ao depositar.");
      } finally {
        setIsLoading(false);
      }
    },
    [anchorWallet, connection, publicKey, bankPda, fetchBankState]
  );

  const withdraw = useCallback(
    async (amountSol: number) => {
      if (!anchorWallet || !publicKey || !bankPda) return;
      setIsLoading(true);
      setError(null);
      setTxSignature(null);
      try {
        const program = getProgram(anchorWallet, connection);
        const amount = new BN(Math.floor(amountSol * LAMPORTS_PER_SOL));
        const tx = await (program.methods as any)
          .withdraw(amount)
          .accounts({
            bankAccount: bankPda,
            owner: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc({ skipPreflight: true, commitment: "confirmed" });
        setTxSignature(tx);
        await fetchBankState();
      } catch (err: any) {
        const msg: string = err?.message ?? "";
        if (msg.includes("InsufficientFunds") || msg.includes("6000")) {
          setError("Saldo insuficiente para realizar o saque.");
        } else {
          setError(msg || "Erro ao sacar.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [anchorWallet, connection, publicKey, bankPda, fetchBankState]
  );

  return {
    bankPda,
    bankState,
    isLoading,
    error,
    txSignature,
    fetchBankState,
    initialize,
    deposit,
    withdraw,
    setError,
  };
}
