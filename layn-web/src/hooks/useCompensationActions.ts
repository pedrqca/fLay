import { useState } from 'react'

import {
    createBankTransaction,
    deleteBankTransaction,
    updateBankTransaction,
} from '../api/bankTransactions'
import type { CompensationData } from '../types/compensation'
import { convertHoursToMinutes } from '../utils/time'
import { useAuth } from './useAuth'

interface EditingCompensation {
    id: number
}

export function useCompensationActions(
    refresh: () => Promise<void>,
) {
    const { userId } = useAuth()
    const [isSaving, setIsSaving] =
        useState(false)
    const [isDeletingCompensation, setIsDeletingCompensation] =
        useState(false)
    const [error, setError] =
        useState('')

    async function handleSubmitCompensation(
        data: CompensationData,
        editingCompensation: EditingCompensation | null,
    ): Promise<boolean> {
        try {
            setIsSaving(true)
            setError('')

            const minutes =
                convertHoursToMinutes(data.hours)

            if (minutes <= 0) {
                setError(
                    'Informe uma quantidade de horas válida para a compensação.',
                )
                return false
            }

            if (!data.date) {
                setError(
                    'Informe a data da compensação.',
                )
                return false
            }

            if (!data.description.trim()) {
                setError(
                    'Informe uma descrição para a compensação.',
                )
                return false
            }

            const payload = {
                date: data.date,
                type: 'COMPENSATION' as const,
                minutes,
                description:
                    data.description.trim(),
            }

            if (editingCompensation) {
                await updateBankTransaction(
                    editingCompensation.id,
                    payload,
                )
            } else {
                await createBankTransaction({
                    userId,
                    ...payload,
                })
            }

            await refresh()
            return true
        } catch (actionError) {
            setError(
                actionError instanceof Error
                    ? actionError.message
                    : editingCompensation
                        ? 'Não foi possível atualizar a compensação.'
                        : 'Não foi possível registrar a compensação.',
            )
            return false
        } finally {
            setIsSaving(false)
        }
    }

    async function handleConfirmDeleteCompensation(
        transactionId: number,
    ): Promise<boolean> {
        try {
            setIsDeletingCompensation(true)
            setError('')

            await deleteBankTransaction(
                transactionId,
            )
            await refresh()
            return true
        } catch (actionError) {
            setError(
                actionError instanceof Error
                    ? actionError.message
                    : 'Não foi possível excluir a compensação.',
            )
            return false
        } finally {
            setIsDeletingCompensation(false)
        }
    }

    return {
        error,
        isSaving,
        isDeletingCompensation,
        handleSubmitCompensation,
        handleConfirmDeleteCompensation,
    }
}
