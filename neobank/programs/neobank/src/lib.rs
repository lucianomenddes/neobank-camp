use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("AddjtgBuse2fuZ7y4CipwYJQbnub64M3w8MSh12H12m5");

#[program]
pub mod neobank {
    use super::*;

    /// Inicializa uma conta bancária (PDA) para o usuário com saldo zerado.
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let bank = &mut ctx.accounts.bank_account;
        bank.owner = ctx.accounts.user.key();
        bank.balance = 0;
        bank.bump = ctx.bumps.bank_account;
        msg!("Conta bancária inicializada para: {}", bank.owner);
        Ok(())
    }

    /// Deposita SOL da carteira do usuário na conta PDA via CPI.
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        require!(amount > 0, NeobankError::InvalidAmount);

        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.bank_account.to_account_info(),
            },
        );
        system_program::transfer(cpi_ctx, amount)?;

        let bank = &mut ctx.accounts.bank_account;
        bank.balance = bank
            .balance
            .checked_add(amount)
            .ok_or(NeobankError::Overflow)?;

        msg!("Depósito de {} lamports. Novo saldo: {}", amount, bank.balance);
        Ok(())
    }

    /// Saca SOL da conta PDA para a carteira do owner.
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        require!(amount > 0, NeobankError::InvalidAmount);

        let bank = &ctx.accounts.bank_account;
        require!(bank.balance >= amount, NeobankError::InsufficientFunds);

        let new_balance = bank
            .balance
            .checked_sub(amount)
            .ok_or(NeobankError::Overflow)?;

        // Manipulação direta de lamports: a PDA é owned pelo programa,
        // portanto podemos subtrair diretamente sem CPI adicional.
        **ctx
            .accounts
            .bank_account
            .to_account_info()
            .try_borrow_mut_lamports()? -= amount;
        **ctx
            .accounts
            .owner
            .to_account_info()
            .try_borrow_mut_lamports()? += amount;

        ctx.accounts.bank_account.balance = new_balance;

        msg!("Saque de {} lamports. Novo saldo: {}", amount, new_balance);
        Ok(())
    }
}

// ─── Estado ──────────────────────────────────────────────────────────────────

#[account]
pub struct BankState {
    /// Proprietário da conta (Pubkey do usuário).
    pub owner: Pubkey,
    /// Saldo depositado em lamports (não inclui o mínimo de rent).
    pub balance: u64,
    /// Bump canonical da PDA, armazenado para rederivação sem custo extra.
    pub bump: u8,
}

impl BankState {
    /// 8 (discriminador) + 32 (Pubkey) + 8 (u64) + 1 (u8)
    pub const LEN: usize = 8 + 32 + 8 + 1;
}

// ─── Contextos ────────────────────────────────────────────────────────────────

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = user,
        space = BankState::LEN,
        seeds = [b"neobank", user.key().as_ref()],
        bump,
    )]
    pub bank_account: Account<'info, BankState>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(
        mut,
        seeds = [b"neobank", user.key().as_ref()],
        bump = bank_account.bump,
    )]
    pub bank_account: Account<'info, BankState>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(
        mut,
        seeds = [b"neobank", owner.key().as_ref()],
        bump = bank_account.bump,
        has_one = owner @ NeobankError::Unauthorized,
    )]
    pub bank_account: Account<'info, BankState>,

    /// Único signatário autorizado: deve ser o owner registrado na conta.
    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// ─── Erros ────────────────────────────────────────────────────────────────────

#[error_code]
pub enum NeobankError {
    #[msg("Saldo insuficiente para realizar o saque.")]
    InsufficientFunds,

    #[msg("Acesso não autorizado: você não é o dono desta conta.")]
    Unauthorized,

    #[msg("O valor da operação deve ser maior que zero.")]
    InvalidAmount,

    #[msg("Overflow aritmético detectado.")]
    Overflow,
}
