import { useState } from 'react'

import {
    createWorkday,
    deleteWorkday,
    updateWorkday,
} from '../api/workdays'
import { getExpectedMinutes } from '../utils/date'
import type { ProofData } from '../types/proof'
import { useAuth } from './useAuth'

export function useProofActions(
    refresh: () => Promise<void>,
) {
    const { userId } = useAuth()
    const [isSaving, setIsSaving] =
        useState(false)
    const [isDeletingWorkday, setIsDeletingWorkday] =
        useState(false)
    const [error, setError] =
        useState('')

    async function handleSubmitProof(
        data: ProofData,
        workdayId: number | null,
    ): Promise<boolean> {
        try {
            setIsSaving(true)
            setError('')

            const expectedMinutes =
                getExpectedMinutes(data.date)
            const proofs = data.times.map(
                (time) => ({
                    date: data.date,
                    time,
                }),
            )

            if (workdayId !== null) {
                await updateWorkday(
                    workdayId,
                    {
                        expectedMinutes,
                        proofs,
                    },
                )
            } else {
                await createWorkday({
                    userId,
                    expectedMinutes,
                    proofs,
                })
            }

            await refresh()
            return true
        } catch (actionError) {
            setError(
                actionError instanceof Error
                    ? actionError.message
                    : workdayId !== null
                        ? 'Não foi possível atualizar a jornada.'
                        : 'Não foi possível registrar a jornada.',
            )
            return false
        } finally {
            setIsSaving(false)
        }
    }

    async function handleConfirmDeleteWorkday(
        workdayId: number,
    ): Promise<boolean> {
        try {
            setIsDeletingWorkday(true)
            setError('')

            await deleteWorkday(workdayId)
            await refresh()
            return true
        } catch (actionError) {
            setError(
                actionError instanceof Error
                    ? actionError.message
                    : 'Não foi possível excluir a jornada.',
            )
            return false
        } finally {
            setIsDeletingWorkday(false)
        }
    }

    return {
        error,
        isSaving,
        isDeletingWorkday,
        handleSubmitProof,
        handleConfirmDeleteWorkday,
    }
}
