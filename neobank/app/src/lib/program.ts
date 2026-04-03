import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import idl from "@/idl/neobank.json";

export const PROGRAM_ID = new PublicKey(
  "AddjtgBuse2fuZ7y4CipwYJQbnub64M3w8MSh12H12m5"
);

export const DEVNET_RPC = "https://api.devnet.solana.com";

export function getProgram(wallet: AnchorWallet, connection: Connection) {
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
    preflightCommitment: "processed",
    skipPreflight: true,
  });
  return new Program(idl as Idl, provider);
}

export function getBankPda(ownerPublicKey: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("neobank"), ownerPublicKey.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}
