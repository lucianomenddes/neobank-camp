import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Neobank } from "../target/types/neobank";
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { assert } from "chai";

describe("neobank", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Neobank as Program<Neobank>;
  const user = provider.wallet as anchor.Wallet;

  let bankPda: PublicKey;

  before(async () => {
    [bankPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("neobank"), user.publicKey.toBuffer()],
      program.programId
    );
    console.log("PDA da conta bancária:", bankPda.toBase58());
  });

  it("1. Inicializa a conta bancária com saldo zerado", async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        bankAccount: bankPda,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const bankState = await program.account.bankState.fetch(bankPda);

    assert.ok(
      bankState.owner.equals(user.publicKey),
      "Owner deve ser o usuário"
    );
    assert.equal(bankState.balance.toNumber(), 0, "Saldo inicial deve ser 0");

    console.log("✓ Conta inicializada. Tx:", tx);
  });

  it("2. Deposita 1 SOL e verifica o saldo interno", async () => {
    const depositAmount = new BN(1 * LAMPORTS_PER_SOL);

    const tx = await program.methods
      .deposit(depositAmount)
      .accounts({
        bankAccount: bankPda,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const bankState = await program.account.bankState.fetch(bankPda);

    assert.equal(
      bankState.balance.toNumber(),
      1 * LAMPORTS_PER_SOL,
      "Saldo deve refletir 1 SOL depositado"
    );

    console.log("✓ Depósito de 1 SOL realizado. Tx:", tx);
  });

  it("3. Saca 0.5 SOL e verifica redução do saldo", async () => {
    const withdrawAmount = new BN(0.5 * LAMPORTS_PER_SOL);
    const userBalanceBefore = await provider.connection.getBalance(
      user.publicKey
    );

    const tx = await program.methods
      .withdraw(withdrawAmount)
      .accounts({
        bankAccount: bankPda,
        owner: user.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const bankState = await program.account.bankState.fetch(bankPda);
    const userBalanceAfter = await provider.connection.getBalance(
      user.publicKey
    );

    assert.equal(
      bankState.balance.toNumber(),
      0.5 * LAMPORTS_PER_SOL,
      "Saldo deve ser 0.5 SOL após o saque"
    );
    assert.isAbove(
      userBalanceAfter,
      userBalanceBefore,
      "Saldo do usuário deve ter aumentado após o saque"
    );

    console.log("✓ Saque de 0.5 SOL realizado. Tx:", tx);
  });

  it("4. Falha ao tentar sacar mais do que o saldo disponível", async () => {
    const excessAmount = new BN(2 * LAMPORTS_PER_SOL);

    try {
      await program.methods
        .withdraw(excessAmount)
        .accounts({
          bankAccount: bankPda,
          owner: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      assert.fail("A transação deveria ter falhado com saldo insuficiente");
    } catch (err: any) {
      // Anchor encapsula o código de erro customizado em AnchorError
      const anchorErr = err as anchor.AnchorError;
      assert.equal(
        anchorErr.error?.errorCode?.code,
        "InsufficientFunds",
        "Código de erro deve ser InsufficientFunds"
      );
      console.log(
        "✓ Erro esperado capturado:",
        anchorErr.error?.errorCode?.code
      );
    }
  });
});
