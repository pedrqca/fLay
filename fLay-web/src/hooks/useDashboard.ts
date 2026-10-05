import {
    useCallback,
    useEffect,
    useState,
} from 'react'

import type {
    BankTransaction,
} from '../types/bankTransaction'

import type {
    Workday,
} from '../types/workday'

import {
    getWorkdays,
} from '../api/workdays'

import {
    getBankTransactions,
} from '../api/bankTransactions'

import { useAuth } from './useAuth'

export function useDashboard() {
    const {
        userId,
    } = useAuth()

    const [
        workdays,
        setWorkdays,
    ] = useState<Workday[]>([])

    const [
        bankTransactions,
        setBankTransactions,
    ] = useState<
        BankTransaction[]
    >([])

    const [
        error,
        setError,
    ] = useState<string | null>(null)

    const [
        isLoading,
        setIsLoading,
    ] = useState(true)

    const loadDashboardData =
        useCallback(
            async () => {
                try {
                    setIsLoading(true)
                    setError(null)

                    const [
                        updatedWorkdays,
                        updatedTransactions,
                    ] = await Promise.all([
                        getWorkdays(userId),
                        getBankTransactions(userId),
                    ])

                    setWorkdays(
                        updatedWorkdays,
                    )

                    setBankTransactions(
                        updatedTransactions,
                    )
                } catch (loadError) {
                    setError(
                        'Não foi possível carregar os dados. Tente novamente mais tarde.',
                    )

                    throw loadError
                } finally {
                    setIsLoading(false)
                }
            },
            [userId],
        )

    useEffect(() => {
        loadDashboardData().catch(
            (error) => {
                console.error(
                    'Erro ao carregar dados:',
                    error,
                )
            },
        )
    }, [
        loadDashboardData,
    ])

    return {
        workdays,
        bankTransactions,
        error,
        isLoading,
        loadDashboardData,
    }
}