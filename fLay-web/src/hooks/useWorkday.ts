import {
    createWorkday,
    updateWorkday,
    deleteWorkday,
} from '../api/workdays'

import { getExpectedMinutes } from '../utils/date'

import type { ProofData } from '../types/proof'

import { useAuth } from './useAuth'

export function useWorkday(
    loadDashboardData: () => Promise<void>,
) {
    const {
        userId,
    } = useAuth()

    async function handleProofSubmit(
        data: ProofData,
        workdayId?: number,
    ) {
        const expectedMinutes =
            getExpectedMinutes(data.date)

        const proofs = data.times.map((time) => ({
            date: data.date,
            time,
        }))

        if (workdayId !== undefined) {
            await updateWorkday(workdayId, {
                expectedMinutes,
                proofs,
            })
        } else {
            await createWorkday({
                userId,
                expectedMinutes,
                proofs,
            })
        }

        await loadDashboardData()
    }

    async function handleDeleteWorkday(
        workdayId: number,
    ) {
        await deleteWorkday(workdayId)
        await loadDashboardData()
    }

    return {
        handleProofSubmit,
        handleDeleteWorkday,
    }
}