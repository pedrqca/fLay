import {
    CalendarDays,
    Clock3,
    Trash2,
    TrendingUp,
    X,
} from 'lucide-react'

import {
    useEffect,
    useState,
} from 'react'

import { StatCard } from '../components/dashboard/StatCard'

import { RecentProofs } from '../components/dashboard/RecentProofs'

import { BankHistory } from '../components/dashboard/BankHistory'

import {
    calculateWeek,
} from '../../../fLay-backend/src/utils/workdayCalculator'

import {
    calculateBankBalance,
    createBankTransactionsFromWeek,
} from '../../../fLay-backend/src/utils/bankCalculator'

import type {
    BankTransaction as CalculatedBankTransaction,
} from '../../../fLay-backend/src/utils/bankCalculator'

import {
    formatMinutes,
} from '../../../fLay-backend/src/utils/timeFormatter'

import {
    createWorkday,
    deleteWorkday,
    getWorkdays,
    updateWorkday,
    type Workday,
} from '../api/workdays'

import {
    createBankTransaction,
    deleteBankTransaction,
    updateBankTransaction,
    getBankTransactions,
} from '../api/bankTransactions'

import type {
    BankTransaction as ApiBankTransaction,
} from '../api/bankTransactions'

import {
    mapWorkdaysToWeekdays,
} from '../utils/workdayMapper'

import type {
    CompensationData,
    CompensationToEdit,
} from '../components/dashboard/CompensationModal'

import type {
    ProofData,
} from '../components/dashboard/ProofModal'

export function Dashboard() {
    const [
        compensationTransactions,
        setCompensationTransactions,
    ] = useState<ApiBankTransaction[]>([])

    const [
        workdays,
        setWorkdays,
    ] = useState<Workday[]>([])

    const [
        editingCompensation,
        setEditingCompensation,
    ] = useState<CompensationToEdit | null>(
        null,
    )

    const [
        isCompensationModalOpen,
        setIsCompensationModalOpen,
    ] = useState(false)

    const [
        compensationToDelete,
        setCompensationToDelete,
    ] = useState<ApiBankTransaction | null>(
        null,
    )

    const [
        isDeletingCompensation,
        setIsDeletingCompensation,
    ] = useState(false)

    useEffect(() => {
        Promise.all([
            getWorkdays(1),
            getBankTransactions(1),
        ])
            .then(
                ([
                    workdays,
                    transactions,
                ]) => {
                    setWorkdays(workdays)

                    setCompensationTransactions(
                        transactions.filter(
                            (
                                transaction,
                            ) =>
                                transaction.type ===
                                'COMPENSATION',
                        ),
                    )
                },
            )
            .catch((error) => {
                console.error(
                    'Erro ao carregar dados:',
                    error,
                )
            })
    }, [])

    const weekdays =
        mapWorkdaysToWeekdays(workdays)

    const weekResult = calculateWeek(
        weekdays,
    )

    const weeklyTransactions =
        createBankTransactionsFromWeek(
            weekResult,
        )

    const compensationTransactionsForHistory: CalculatedBankTransaction[] =
        compensationTransactions.map(
            (
                transaction,
            ) => ({
                date: transaction.date,
                type: transaction.type,
                minutes:
                    transaction.minutes,
                description:
                    transaction.description,
            }),
        )

    const bankTransactions: CalculatedBankTransaction[] = [
        ...weeklyTransactions,
        ...compensationTransactionsForHistory,
    ]

    const bankResult =
        calculateBankBalance(
            bankTransactions,
        )

    const proofs = workdays.map(
        (workday) => ({
            id: workday.id,

            date: new Date(
                workday.date,
            ).toLocaleDateString(
                'pt-BR',
                {
                    timeZone:
                        'UTC',
                },
            ),

            times:
                workday.timeEntries.map(
                    (
                        timeEntry,
                    ) =>
                        timeEntry.time,
                ),
        }),
    )

    function normalizeDate(
        date: string,
    ): string {
        return date.split('T')[0]
    }

    async function handleCompensationSubmit(
        data: CompensationData,
    ) {
        try {
            const [
                hours,
                minutes,
            ] = data.hours
                .split(':')
                .map(Number)

            const totalMinutes =
                hours * 60 + minutes

            if (editingCompensation) {
                const updatedTransaction =
                    await updateBankTransaction(
                        editingCompensation.id,
                        {
                            date: data.date,
                            type: 'COMPENSATION',
                            minutes:
                                totalMinutes,
                            description:
                                data.description,
                        },
                    )

                setCompensationTransactions(
                    (
                        currentTransactions,
                    ) =>
                        currentTransactions.map(
                            (
                                transaction,
                            ) =>
                                transaction.id ===
                                    updatedTransaction.id
                                    ? updatedTransaction
                                    : transaction,
                        ),
                )

                setEditingCompensation(
                    null,
                )

                setIsCompensationModalOpen(
                    false,
                )

                return
            }

            const transaction =
                await createBankTransaction(
                    {
                        userId: 1,
                        date: data.date,
                        type: 'COMPENSATION',
                        minutes:
                            totalMinutes,
                        description:
                            data.description,
                    },
                )

            setCompensationTransactions(
                (
                    currentTransactions,
                ) => [
                        ...currentTransactions,
                        transaction,
                    ],
            )

            setEditingCompensation(
                null,
            )

            setIsCompensationModalOpen(
                false,
            )
        } catch (error) {
            console.error(
                'Erro ao salvar compensação:',
                error,
            )
        }
    }

    function handleEditCompensation(
        transaction: CalculatedBankTransaction,
    ) {
        const apiTransaction =
            compensationTransactions.find(
                (
                    currentTransaction,
                ) =>
                    normalizeDate(
                        currentTransaction.date,
                    ) ===
                    normalizeDate(
                        transaction.date,
                    ) &&
                    currentTransaction.type ===
                    transaction.type &&
                    currentTransaction.minutes ===
                    transaction.minutes &&
                    currentTransaction.description ===
                    transaction.description,
            )

        if (!apiTransaction) {
            console.error(
                'Não foi possível localizar a compensação.',
            )

            return
        }

        setEditingCompensation({
            id: apiTransaction.id,

            date:
                apiTransaction.date,

            minutes:
                apiTransaction.minutes,

            description:
                apiTransaction.description,
        })

        setIsCompensationModalOpen(
            true,
        )
    }

    function handleDeleteCompensation(
        transaction: CalculatedBankTransaction,
    ) {
        const apiTransaction =
            compensationTransactions.find(
                (
                    currentTransaction,
                ) =>
                    normalizeDate(
                        currentTransaction.date,
                    ) ===
                    normalizeDate(
                        transaction.date,
                    ) &&
                    currentTransaction.type ===
                    transaction.type &&
                    currentTransaction.minutes ===
                    transaction.minutes &&
                    currentTransaction.description ===
                    transaction.description,
            )

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
            setIsDeletingCompensation(
                true,
            )

            await deleteBankTransaction(
                compensationToDelete.id,
            )

            setCompensationTransactions(
                (
                    currentTransactions,
                ) =>
                    currentTransactions.filter(
                        (
                            currentTransaction,
                        ) =>
                            currentTransaction.id !==
                            compensationToDelete.id,
                    ),
            )

            setCompensationToDelete(
                null,
            )
        } catch (error) {
            console.error(
                'Erro ao excluir compensação:',
                error,
            )
        } finally {
            setIsDeletingCompensation(
                false,
            )
        }
    }

    async function handleProofSubmit(
        data: ProofData,
        workdayId?: number,
    ) {
        try {
            const date = new Date(
                `${data.date}T00:00:00`,
            )

            const day =
                date.getDay()

            const expectedMinutes =
                day === 6
                    ? 240
                    : day === 0
                        ? 0
                        : 480

            const proofs =
                data.times.map(
                    (
                        time,
                    ) => ({
                        date:
                            data.date,
                        time,
                    }),
                )

            if (workdayId) {
                await updateWorkday(
                    workdayId,
                    {
                        expectedMinutes,
                        proofs,
                    },
                )
            } else {
                await createWorkday({
                    userId: 1,
                    expectedMinutes,
                    proofs,
                })
            }

            const updatedWorkdays =
                await getWorkdays(1)

            setWorkdays(
                updatedWorkdays,
            )
        } catch (error) {
            console.error(
                workdayId
                    ? 'Erro ao atualizar jornada:'
                    : 'Erro ao registrar jornada:',
                error,
            )
        }
    }

    async function handleDeleteWorkday(
        workdayId: number,
    ) {
        try {
            await deleteWorkday(
                workdayId,
            )

            const updatedWorkdays =
                await getWorkdays(1)

            setWorkdays(
                updatedWorkdays,
            )
        } catch (error) {
            console.error(
                'Erro ao excluir jornada:',
                error,
            )

            throw error
        }
    }

    function handleOpenNewCompensation() {
        setEditingCompensation(
            null,
        )

        setIsCompensationModalOpen(
            true,
        )
    }

    function handleCloseCompensation() {
        setIsCompensationModalOpen(
            false,
        )

        setEditingCompensation(
            null,
        )
    }

    return (
        <main className="min-h-screen flex-1 bg-[#FAF9F6] px-5 pb-8 pt-28 sm:px-6 md:px-10 md:py-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-7 md:mb-8">
                    <p className="mb-2 text-sm font-medium text-[#A3B18A] md:text-base">
                        Visão geral
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-[#2F4A33] sm:text-4xl">
                        Olá, Layane 👋
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#588157]">
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
                        value={`${weekResult.days.length} dias`}
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
                        handleCompensationSubmit
                    }
                    editingCompensation={
                        editingCompensation
                    }
                    onProofSubmit={
                        handleProofSubmit
                    }
                    onDelete={
                        handleDeleteWorkday
                    }
                />

                <BankHistory
                    transactions={
                        bankTransactions
                    }
                    onEdit={
                        handleEditCompensation
                    }
                    onDelete={
                        handleDeleteCompensation
                    }
                />
            </div>

            {compensationToDelete && (
                <div
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-[#2F4A33]/30 px-4 py-6 backdrop-blur-sm"
                    onMouseDown={(
                        event,
                    ) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseDeleteCompensation()
                        }
                    }}
                >
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-[#FAF9F6] shadow-2xl">
                        <div className="px-5 pb-5 pt-6 sm:px-6 sm:pt-7">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                    <Trash2
                                        size={21}
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg font-semibold text-[#2F4A33]">
                                        Excluir compensação?
                                    </h3>

                                    <p className="mt-1.5 text-sm leading-5 text-[#588157]">
                                        Deseja realmente excluir esta compensação?
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleCloseDeleteCompensation
                                    }
                                    disabled={
                                        isDeletingCompensation
                                    }
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#588157] transition-colors hover:bg-[#DAD7CD] disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Fechar"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="mt-5 rounded-xl border border-[#D8CFBF] bg-[#F1EDE4] px-4 py-3.5">
                                <p className="truncate text-sm font-semibold text-[#5C5040]">
                                    {
                                        compensationToDelete.description
                                    }
                                </p>

                                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[#7A6F5D]">
                                    <span>
                                        {normalizeDate(
                                            compensationToDelete.date,
                                        )
                                            .split('-')
                                            .reverse()
                                            .join('/')}
                                    </span>

                                    <span>
                                        {formatMinutes(
                                            compensationToDelete.minutes,
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 rounded-xl border border-red-100 bg-red-50/70 px-4 py-3.5">
                                <p className="text-sm leading-5 text-red-700">
                                    Essa ação removerá a compensação do banco de horas. Essa operação não pode ser desfeita.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-2 border-t border-[#A3B18A]/20 bg-white/60 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                            <button
                                type="button"
                                onClick={
                                    handleCloseDeleteCompensation
                                }
                                disabled={
                                    isDeletingCompensation
                                }
                                className="w-full rounded-xl border border-[#A3B18A]/50 bg-white px-5 py-2.5 text-sm font-medium text-[#588157] transition-colors hover:bg-[#DAD7CD] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleConfirmDeleteCompensation
                                }
                                disabled={
                                    isDeletingCompensation
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                <Trash2
                                    size={16}
                                />

                                {isDeletingCompensation
                                    ? 'Excluindo...'
                                    : 'Excluir compensação'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}