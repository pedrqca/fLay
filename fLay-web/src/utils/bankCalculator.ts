import type { BankTransaction } from '../types/bankTransaction'

export interface BankBalance {
    totalCredits: number
    totalDebits: number
    balanceMinutes: number
}

export function calculateBankBalance(
    transactions: BankTransaction[],
): BankBalance {
    const totalCredits =
        transactions
            .filter(
                (transaction) =>
                    transaction.type ===
                    'EXTRA',
            )
            .reduce(
                (total, transaction) =>
                    total +
                    transaction.minutes,
                0,
            )

    const totalDebits =
        transactions
            .filter(
                (transaction) =>
                    transaction.type ===
                    'COMPENSATION',
            )
            .reduce(
                (total, transaction) =>
                    total +
                    transaction.minutes,
                0,
            )

    const balanceMinutes =
        totalCredits -
        totalDebits

    return {
        totalCredits,
        totalDebits,
        balanceMinutes,
    }
}