export type BankTransactionType =
    | 'EXTRA'
    | 'COMPENSATION'

export interface BankTransaction {
    id: number
    userId: number
    workdayId: number | null
    date: string
    type: BankTransactionType
    minutes: number
    description: string
    createdAt: string
}

export interface CalculatedBankTransaction {
    date: string
    type: BankTransactionType
    minutes: number
    description: string
}

export interface CreateBankTransactionData {
    userId: number
    date: string
    type: BankTransactionType
    minutes: number
    description: string
}

export interface UpdateBankTransactionData {
    date: string
    type: BankTransactionType
    minutes: number
    description: string
}