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

const API_URL =
    import.meta.env.VITE_API_URL ??
    'http://localhost:3333'

export async function getBankTransactions(
    userId: number,
): Promise<BankTransaction[]> {
    const response = await fetch(
        `${API_URL}/users/${userId}/bank-transactions`,
    )

    if (!response.ok) {
        throw new Error(
            'Não foi possível carregar as transações do banco de horas.',
        )
    }

    return response.json()
}

export async function createBankTransaction(
    data: CreateBankTransactionData,
): Promise<BankTransaction> {
    const response = await fetch(
        `${API_URL}/bank-transactions`,
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json',
            },
            body: JSON.stringify(data),
        },
    )

    if (!response.ok) {
        const error =
            await response.json()

        throw new Error(
            error.message ??
            'Não foi possível registrar a transação.',
        )
    }

    return response.json()
}

export async function updateBankTransaction(
    id: number,
    data: UpdateBankTransactionData,
): Promise<BankTransaction> {
    const response = await fetch(
        `${API_URL}/bank-transactions/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type':
                    'application/json',
            },
            body: JSON.stringify(data),
        },
    )

    if (!response.ok) {
        const error =
            await response.json()

        throw new Error(
            error.message ??
            'Não foi possível atualizar a transação.',
        )
    }

    return response.json()
}

export async function deleteBankTransaction(
    id: number,
): Promise<void> {
    const response = await fetch(
        `${API_URL}/bank-transactions/${id}`,
        {
            method: 'DELETE',
        },
    )

    if (!response.ok) {
        const error =
            await response.text()

        throw new Error(
            error ||
            'Não foi possível excluir a transação.',
        )
    }
}