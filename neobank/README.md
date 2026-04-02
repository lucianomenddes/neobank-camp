# Solana Neobank - Bootcamp Hackathon 2026

Programa on-chain construído com o framework **Anchor** na blockchain **Solana**, desenvolvido para o **Superteam Brazil + NearX- Desafio 1: Construa um escrow ou Neobank com Anchor **.

Demonstra domínio dos pilares fundamentais do desenvolvimento Solana: **PDAs (Program Derived Addresses)**, **CPIs (Cross-Program Invocations)** e **segurança on-chain**.

---

## Como Funciona

Cada usuário possui uma conta bancária própria derivada deterministicamente de sua chave pública (`PDA`). O programa gerencia depósitos e saques de SOL, garantindo que somente o proprietário da conta possa sacar fundos.

```
Carteira do Usuário
       │
       ▼
 ┌─────────────┐   initialize   ┌────────────────────────────────┐
 │    Usuário   │ ─────────────► │  BankState (PDA)               │
 │  (Signer)   │                │  seeds: ["neobank", user.key]  │
 └─────────────┘                │  owner:   Pubkey               │
       │                        │  balance: u64                  │
       │ deposit (CPI)          │  bump:    u8                   │
       └──────────────────────► │                                │
                                └────────────────────────────────┘
                                          │ withdraw
                                          ▼ (manipulação direta de lamports)
                                    Carteira do Owner
```

---

## Instruções do Programa

### `initialize`
Cria a conta `BankState` para o usuário. Deriva a PDA usando `[b"neobank", user.key]`, define o `owner` e inicializa o `balance` como `0`.

| Conta         | Tipo         | Descrição                        |
|---------------|--------------|----------------------------------|
| `bank_account`| PDA (init)   | Conta bancária a ser criada      |
| `user`        | Signer (mut) | Pagador e proprietário da conta  |
| `system_program` | Program   | Programa do sistema Solana       |

---

### `deposit(amount: u64)`
Transfere `amount` lamports da carteira do usuário para a PDA via **CPI** ao `system_program::transfer`. Atualiza `balance` internamente.

| Conta         | Tipo         | Descrição                              |
|---------------|--------------|----------------------------------------|
| `bank_account`| PDA (mut)    | Conta bancária receptora do depósito   |
| `user`        | Signer (mut) | Remetente dos fundos                   |
| `system_program` | Program   | Programa do sistema Solana             |

---

### `withdraw(amount: u64)`
Saca `amount` lamports da PDA para a carteira do owner. Utiliza manipulação direta de lamports (o programa é dono da PDA). Protegida por:
- **`has_one = owner`** — garante que somente o proprietário registrado pode sacar.
- **`InsufficientFunds`** — rejeita saques superiores ao saldo disponível.

| Conta         | Tipo         | Descrição                              |
|---------------|--------------|----------------------------------------|
| `bank_account`| PDA (mut)    | Conta bancária de origem dos fundos    |
| `owner`       | Signer (mut) | Destinatário e único autorizador       |
| `system_program` | Program   | Programa do sistema Solana             |

---

## Erros Customizados

| Código              | Mensagem                                              |
|---------------------|-------------------------------------------------------|
| `InsufficientFunds` | Saldo insuficiente para realizar o saque.             |
| `Unauthorized`      | Acesso não autorizado: você não é o dono desta conta. |
| `InvalidAmount`     | O valor da operação deve ser maior que zero.          |
| `Overflow`          | Overflow aritmético detectado.                        |

---

## Como Rodar os Testes

### Pré-requisitos

- [Rust](https://rustup.rs/) e `solana-cli` instalados
- [Anchor CLI](https://www.anchor-lang.com/docs/installation) instalado
- Node.js >= 18 e npm
- Validator local rodando (gerenciado automaticamente pelo `anchor test`)

### Passo a Passo

```bash
# 1. Acesse o diretório do projeto
cd neobank

# 2. Instale as dependências JavaScript
npm install

# 3. Execute os testes (compila, sobe validator local e roda a suíte)
anchor test
```

A saída esperada é:

```
neobank
  ✓ 1. Inicializa a conta bancária com saldo zerado
  ✓ 2. Deposita 1 SOL e verifica o saldo interno
  ✓ 3. Saca 0.5 SOL e verifica redução do saldo
  ✓ 4. Falha ao tentar sacar mais do que o saldo disponível

4 passing
```

---

## Deploy na Devnet

```bash
# Configure a CLI para Devnet
solana config set --url devnet

# Faça o airdrop de SOL para pagar o deploy
solana airdrop 2

# Faça o build e deploy
anchor build
anchor deploy

# Atualize o Program ID no Anchor.toml e lib.rs após o deploy
```

**Program ID na Devnet:** [`AddjtgBuse2fuZ7y4CipwYJQbnub64M3w8MSh12H12m5`](https://explorer.solana.com/address/AddjtgBuse2fuZ7y4CipwYJQbnub64M3w8MSh12H12m5?cluster=devnet)

---

## Estrutura do Projeto

```
neobank/
├── programs/
│   └── neobank/
│       └── src/
│           └── lib.rs          # Lógica on-chain (BankState, instruções, erros)
├── tests/
│   └── neobank.ts              # Suíte de testes TypeScript
├── Anchor.toml                 # Configuração do Anchor
└── README.md                   # Este arquivo
```

---

## Tecnologias

- **Solana** — blockchain de alta performance
- **Anchor 0.30** — framework para programas Solana
- **TypeScript** + **@coral-xyz/anchor** — cliente de testes
- **Mocha** + **Chai** — runner e assertions de testes
