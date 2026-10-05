import { CalendarDays, Clock3, TrendingUp } from 'lucide-react'
import { useState } from 'react'

import { StatCard } from '../components/dashboard/StatCard'
import { RecentProofs } from '../components/dashboard/RecentProofs'
import { BankHistory } from '../components/dashboard/BankHistory'
import { CardWarning } from '../components/ui/CardWarning'

import type { BankTransaction } from '../types/bankTransaction'
import type { CompensationData } from '../components/dashboard/CompensationModal'

import { calculateWeek } from '../utils/workdayCalculator'
import { calculateBankBalance } from '../utils/bankCalculator'
import { formatMinutes } from '../utils/time'

import {
    getCurrentWeekRange,
    getDateKey,
    normalizeDate,
} from '../utils/date'

import {
    mapWorkdaysToWeekdays,
    mapWorkdaysToProofs,
} from '../utils/workdayMapper'

import type { DashboardData } from '../hooks/useDashboard'
import { useCompensation } from '../hooks/useCompensation'
import { useWorkday } from '../hooks/useWorkday'

export function Dashboard({
    workdays,
    bankTransactions: bankTransactionsFromApi,
    error,
    loadDashboardData,
}: DashboardData) {

    const [
        isCompensationModalOpen,
        setIsCompensationModalOpen,
    ] = useState(false)

    const {
        editingCompensation,
        compensationToDelete,
        isDeletingCompensation,

        handleCompensationSubmit,
        handleEditCompensation,
        handleDeleteCompensation,
        handleCloseDeleteCompensation,
        handleConfirmDeleteCompensation,
        clearEditingCompensation,
    } = useCompensation(
        bankTransactionsFromApi,
        loadDashboardData,
    )

    const {
        handleProofSubmit,
        handleDeleteWorkday,
    } = useWorkday(loadDashboardData)

    if (error) {
        return (
            <main className="min-h-screen flex-1 bg-[#F1F5F9] px-5 pb-8 pt-28 sm:px-6 md:px-10 md:py-8">
                <div className="mx-auto max-w-7xl">
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                        <p className="text-sm font-medium">
                            {error}
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    const currentWeek = getCurrentWeekRange()

    const currentWeekWorkdays = workdays.filter((workday) => {
        const workdayDate = getDateKey(workday.date)

        return (
            workdayDate >= currentWeek.start &&
            workdayDate <= currentWeek.end
        )
    })

    const weekdays = mapWorkdaysToWeekdays(
        currentWeekWorkdays,
    )

    const weekResult = calculateWeek(weekdays)

    const bankResult =
        calculateBankBalance(bankTransactionsFromApi)

    const proofs = mapWorkdaysToProofs(workdays)

    async function handleSubmitCompensation(
        data: CompensationData,
    ) {
        try {
            await handleCompensationSubmit(data)

            setIsCompensationModalOpen(false)
        } catch (error) {
            console.error(
                'Erro ao salvar compensação:',
                error,
            )
        }
    }

    function handleOpenNewCompensation() {
        clearEditingCompensation()
        setIsCompensationModalOpen(true)
    }

    function handleCloseCompensation() {
        setIsCompensationModalOpen(false)
        clearEditingCompensation()
    }

    function handleEditCompensationAndOpenModal(
        transaction: BankTransaction,
    ) {
        handleEditCompensation(transaction)
        setIsCompensationModalOpen(true)
    }

    return (
        <main className="min-h-screen flex-1 bg-[#F1F5F9] px-5 pb-8 pt-28 sm:px-6 md:px-10 md:py-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-7 md:mb-8">
                    <p className="mb-2 text-sm font-medium text-[#6366F1] md:text-base">
                        Visão geral
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-[#0F172A] sm:text-4xl">
                        Olá, Layane 👋
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                        Acompanhe suas horas trabalhadas e seu banco de horas.
                    </p>
                </header>

                <section className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
                    <StatCard
                        title="Horas trabalhadas"
                        value={formatMinutes(
                            weekResult.totalWorkedMinutes,
                        )}
                        description="Esta semana"
                        icon={Clock3}
                    />

                    <StatCard
                        title="Banco de horas"
                        value={formatMinutes(
                            bankResult.balanceMinutes,
                        )}
                        description="Saldo atual"
                        icon={TrendingUp}
                    />

                    <StatCard
                        title="Dias trabalhados"
                        value={`${ weekResult.days.length } dias`}
                        description="Esta semana"
                        icon={CalendarDays}
                    />
                </section>

                <RecentProofs
                    proofs={proofs}
                    isCompensationModalOpen={
                        isCompensationModalOpen
                    }
                    onOpenCompensation={
                        handleOpenNewCompensation
                    }
                    onCloseCompensation={
                        handleCloseCompensation
                    }
                    onCompensationSubmit={
                        handleSubmitCompensation
                    }
                    editingCompensation={
                        editingCompensation
                    }
                    onProofSubmit={handleProofSubmit}
                    onDelete={handleDeleteWorkday}
                />

                <BankHistory
                    transactions={bankTransactionsFromApi}
                    onEdit={
                        handleEditCompensationAndOpenModal
                    }
                    onDelete={handleDeleteCompensation}
                />
            </div>

            <CardWarning
                isOpen={
                    compensationToDelete !== null
                }
                title="Excluir compensação?"
                description="Deseja realmente excluir esta compensação?"
                itemTitle={
                    compensationToDelete?.description
                }
                itemDetails={
                    compensationToDelete
                        ? [
                              normalizeDate(
                                  compensationToDelete.date,
                              )
                                  .split('-')
                                  .reverse()
                                  .join('/'),
                              formatMinutes(
                                  compensationToDelete.minutes,
                              ),
                          ]
                        : []
                }
                warning="Essa ação removerá a compensação do banco de horas. Essa operação não pode ser desfeita."
                confirmLabel="Excluir compensação"
                loadingLabel="Excluindo..."
                isLoading={isDeletingCompensation}
                onClose={
                    handleCloseDeleteCompensation
                }
                onConfirm={
                    handleConfirmDeleteCompensation
                }
            />
        </main>
    )
}