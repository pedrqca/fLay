import { useState } from 'react'

import type { BankTransaction } from '../types/bankTransaction'

import type {
    CompensationData,
    CompensationToEdit,
} from '../components/dashboard/CompensationModal'

import {
    createBankTransaction,
    deleteBankTransaction,
    updateBankTransaction,
} from '../api/bankTransactions'

import {
    convertHoursToMinutes,
} from '../utils/time'

import { useAuth } from './useAuth'

export function useCompensation(
    transactions: BankTransaction[],
    loadDashboardData: () => Promise<void>,
) {
    const {
        userId,
    } = useAuth()

    const [
        editingCompensation,
        setEditingCompensation,
    ] = useState<CompensationToEdit | null>(null)

    const [
        compensationToDelete,
        setCompensationToDelete,
    ] = useState<BankTransaction | null>(null)

    const [
        isDeletingCompensation,
        setIsDeletingCompensation,
    ] = useState(false)

    const compensationTransactions =
        transactions.filter(
            (transaction) =>
                transaction.type === 'COMPENSATION',
        )

    function findCompensation(
        transactionId: number,
    ) {
        return compensationTransactions.find(
            (transaction) =>
                transaction.id === transactionId,
        )
    }

    async function handleCompensationSubmit(
        data: CompensationData,
    ) {
        const totalMinutes =
            convertHoursToMinutes(data.hours)

        if (editingCompensation) {
            await updateBankTransaction(
                editingCompensation.id,
                {
                    date: data.date,
                    type: 'COMPENSATION',
                    minutes: totalMinutes,
                    description: data.description,
                },
            )
        } else {
            await createBankTransaction({
                userId,
                date: data.date,
                type: 'COMPENSATION',
                minutes: totalMinutes,
                description: data.description,
            })
        }

        await loadDashboardData()
        setEditingCompensation(null)
    }

    function handleEditCompensation(
        transaction: BankTransaction,
    ) {
        const apiTransaction =
            findCompensation(transaction.id)

        if (!apiTransaction) {
            console.error(
                'Não foi possível localizar a compensação.',
            )
            return
        }

        setEditingCompensation({
            id: apiTransaction.id,
            date: apiTransaction.date,
            minutes: apiTransaction.minutes,
            description: apiTransaction.description,
        })
    }

    function handleDeleteCompensation(
        transaction: BankTransaction,
    ) {
        const apiTransaction =
            findCompensation(transaction.id)

        if (!apiTransaction) {
            console.error(
                'Não foi possível localizar a compensação.',
            )
            return
        }

        setCompensationToDelete(
            apiTransaction,
        )
    }

    function handleCloseDeleteCompensation() {
        if (isDeletingCompensation) {
            return
        }

        setCompensationToDelete(null)
    }

    async function handleConfirmDeleteCompensation() {
        if (!compensationToDelete) {
            return
        }

        try {
            setIsDeletingCompensation(true)

            await deleteBankTransaction(
                compensationToDelete.id,
            )

            await loadDashboardData()

            setCompensationToDelete(null)
        } catch (error) {
            console.error(
                'Erro ao excluir compensação:',
                error,
            )
        } finally {
            setIsDeletingCompensation(false)
        }
    }

    function clearEditingCompensation() {
        setEditingCompensation(null)
    }

    return {
        editingCompensation,
        compensationToDelete,
        isDeletingCompensation,

        handleCompensationSubmit,
        handleEditCompensation,
        handleDeleteCompensation,
        handleCloseDeleteCompensation,
        handleConfirmDeleteCompensation,
        clearEditingCompensation,
    }
}