import type { WeekResult } from './workdayCalculator.js'

export type BankTransactionType =
    | 'EXTRA'
    | 'COMPENSATION'

export interface BankTransaction {
    date: string
    type: BankTransactionType
    minutes: number
    description: string
}

export interface BankBalance {
    totalCredits: number
    totalDebits: number
    balanceMinutes: number
}

export function calculateBankBalance(
    transactions: BankTransaction[],
): BankBalance {
    const totalCredits = transactions
        .filter(
            (transaction) =>
                transaction.type === 'EXTRA',
        )
        .reduce(
            (total, transaction) =>
                total + transaction.minutes,
            0,
        )

    const totalDebits = transactions
        .filter(
            (transaction) =>
                transaction.type === 'COMPENSATION',
        )
        .reduce(
            (total, transaction) =>
                total + transaction.minutes,
            0,
        )

    const balanceMinutes =
        totalCredits - totalDebits

    return {
        totalCredits,
        totalDebits,
        balanceMinutes,
    }
}

export function createBankTransaction(
    date: string,
    balanceMinutes: number,
): BankTransaction | null {
    if (balanceMinutes === 0) {
        return null
    }

    if (balanceMinutes > 0) {
        return {
            date,
            type: 'EXTRA',
            minutes: balanceMinutes,
            description: 'Horas extras',
        }
    }

    return {
        date,
        type: 'COMPENSATION',
        minutes: Math.abs(balanceMinutes),
        description: 'Débito de horas',
    }
}

export function createBankTransactionsFromWeek(
    weekResult: WeekResult,
): BankTransaction[] {
    return weekResult.days
        .map((day) =>
            createBankTransaction(
                day.date,
                day.result.balanceMinutes,
            ),
        )
        .filter(
            (transaction): transaction is BankTransaction =>
                transaction !== null,
        )
}