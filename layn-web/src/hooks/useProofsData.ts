import {
    useCallback,
    useEffect,
    useState,
} from 'react'

import type { BankTransaction } from '../types/bankTransaction'
import type { Workday } from '../types/workday'

import { getBankTransactions } from '../api/bankTransactions'
import { getWorkdays } from '../api/workdays'
import { useAuth } from './useAuth'

export function useProofsData() {
    const { userId } = useAuth()

    const [workdays, setWorkdays] =
        useState<Workday[]>([])
    const [transactions, setTransactions] =
        useState<BankTransaction[]>([])
    const [isLoading, setIsLoading] =
        useState(true)
    const [error, setError] =
        useState('')

    const refresh = useCallback(
        async () => {
            try {
                setIsLoading(true)
                setError('')

                const [
                    workdaysData,
                    transactionsData,
                ] = await Promise.all([
                    getWorkdays(userId),
                    getBankTransactions(userId),
                ])

                setWorkdays(workdaysData)
                setTransactions(
                    transactionsData,
                )
            } catch (loadError) {
                const message =
                    loadError instanceof Error
                        ? loadError.message
                        : 'Não foi possível carregar os comprovantes.'

                setError(message)
                throw loadError
            } finally {
                setIsLoading(false)
            }
        },
        [userId],
    )

    useEffect(() => {
        refresh().catch(() => {
            // The error is exposed through the hook state.
        })
    }, [refresh])

    return {
        workdays,
        transactions,
        isLoading,
        error,
        refresh,
    }
}
