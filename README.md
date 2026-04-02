# Superteam Brasil x NearX 

Submissão para o **Desafio 1 — Escrow + Neobank em Anchor** do Bootcamp Hackathon Global 2026, organizado pelo **Superteam Brazil** em parceria com a **NearX**.

**Opção escolhida: Opção B — Neobank**

---

## Sobre o Projeto

Programa on-chain construído com o framework **Anchor** na blockchain **Solana** que funciona como uma conta bancária descentralizada. Cada usuário possui uma conta própria derivada deterministicamente via PDA, podendo depositar e sacar SOL com controle de acesso garantido on-chain.

Demonstra domínio de **PDAs**, **CPIs** e **segurança on-chain**.

**Program ID na Devnet:** [`AddjtgBuse2fuZ7y4CipwYJQbnub64M3w8MSh12H12m5`](https://explorer.solana.com/address/AddjtgBuse2fuZ7y4CipwYJQbnub64M3w8MSh12H12m5?cluster=devnet)

---

## Instruções do Programa

| Instrução | Descrição |
|-----------|-----------|
| `initialize` | Cria a conta bancária (PDA) com saldo zerado |
| `deposit(amount)` | Deposita SOL via CPI ao system_program |
| `withdraw(amount)` | Saca SOL da PDA para o owner (requer autorização) |

---

## Como Rodar os Testes

```bash
cd neobank
npm install
anchor test
```

Saída esperada:
```
neobank
  ✔ 1. Inicializa a conta bancária com saldo zerado
  ✔ 2. Deposita 1 SOL e verifica o saldo interno
  ✔ 3. Saca 0.5 SOL e verifica redução do saldo
  ✔ 4. Falha ao tentar sacar mais do que o saldo disponível
4 passing
```

---

## Estrutura do Repositório

```
neobank-camp/
└── neobank/
    ├── programs/
    │   └── neobank/
    │       └── src/
    │           └── lib.rs       # Lógica on-chain
    ├── tests/
    │   └── neobank.ts           # Suíte de testes
    ├── Anchor.toml
    └── README.md                # Documentação detalhada do projeto
```

> Documentação completa em [`neobank/README.md`](neobank/README.md)
