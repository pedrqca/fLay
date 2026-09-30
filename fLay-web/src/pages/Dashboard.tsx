import {
    CalendarDays,
    Clock3,
    TrendingUp,
} from 'lucide-react'

import {
    useEffect,
    useState,
} from 'react'

import { StatCard } from '../components/dashboard/StatCard'
import { RecentProofs } from '../components/dashboard/RecentProofs'
import { BankHistory } from '../components/dashboard/BankHistory'
import { CardWarning } from '../components/ui/CardWarning'

import {
    calculateWeek,
} from '../../../fLay-backend/src/utils/workdayCalculator'

import {
    calculateBankBalance,
} from '../../../fLay-backend/src/utils/bankCalculator'

import type {
    BankTransaction as CalculatedBankTransaction,
} from '../../../fLay-backend/src/utils/bankCalculator'

import {
    formatMinutes,
} from '../../../fLay-backend/src/utils/timeFormatter'

import {
    createWorkday,
    getWorkdays,
    updateWorkday,
    type Workday,
} from '../api/workdays'

import {
    createBankTransaction,
    deleteBankTransaction,
    getBankTransactions,
    updateBankTransaction,
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

function formatDateKey(
    date: Date,
): string {
    const year =
        date.getFullYear()

    const month = String(
        date.getMonth() + 1,
    ).padStart(2, '0')

    const day = String(
        date.getDate(),
    ).padStart(2, '0')

    return `${year}-${month}-${day}`
}

function getCurrentWeekRange() {
    const today = new Date()

    const currentDay =
        today.getDay()

    const daysFromMonday =
        currentDay === 0
            ? -6
            : 1 - currentDay

    const startOfWeek =
        new Date(today)

    startOfWeek.setHours(
        0,
        0,
        0,
        0,
    )

    startOfWeek.setDate(
        today.getDate() +
        daysFromMonday,
    )

    const endOfWeek =
        new Date(startOfWeek)

    endOfWeek.setDate(
        startOfWeek.getDate() + 6,
    )

    return {
        start: formatDateKey(
            startOfWeek,
        ),
        end: formatDateKey(
            endOfWeek,
        ),
    }
}

function getWorkdayDateKey(
    date: string,
): string {
    return date.split('T')[0]
}

export function Dashboard() {
    const [
        bankTransactionsFromApi,
        setBankTransactionsFromApi,
    ] = useState<
        ApiBankTransaction[]
    >([])

    const [
        workdays,
        setWorkdays,
    ] = useState<Workday[]>([])

    const [
        editingCompensation,
        setEditingCompensation,
    ] = useState<
        CompensationToEdit | null
    >(null)

    const [
        isCompensationModalOpen,
        setIsCompensationModalOpen,
    ] = useState(false)

    const [
        compensationToDelete,
        setCompensationToDelete,
    ] = useState<
        ApiBankTransaction | null
    >(null)

    const [
        isDeletingCompensation,
        setIsDeletingCompensation,
    ] = useState(false)

    async function loadDashboardData() {
        const [
            updatedWorkdays,
            updatedTransactions,
        ] = await Promise.all([
            getWorkdays(1),
            getBankTransactions(1),
        ])

        setWorkdays(
            updatedWorkdays,
        )

        setBankTransactionsFromApi(
            updatedTransactions,
        )
    }

    useEffect(() => {
        loadDashboardData().catch(
            (error) => {
                console.error(
                    'Erro ao carregar dados:',
                    error,
                )
            },
        )
    }, [])

    const compensationTransactions =
        bankTransactionsFromApi.filter(
            (
                transaction,
            ) =>
                transaction.type ===
                'COMPENSATION',
        )

    const currentWeek =
        getCurrentWeekRange()

    const currentWeekWorkdays =
        workdays.filter(
            (workday) => {
                const workdayDate =
                    getWorkdayDateKey(
                        workday.date,
                    )

                return (
                    workdayDate >=
                    currentWeek.start &&
                    workdayDate <=
                    currentWeek.end
                )
            },
        )

    const weekdays =
        mapWorkdaysToWeekdays(
            currentWeekWorkdays,
        )

    const weekResult =
        calculateWeek(
            weekdays,
        )

    const bankTransactions: CalculatedBankTransaction[] =
        bankTransactionsFromApi.map(
            (
                transaction,
            ) => ({
                date:
                    transaction.date,

                type:
                    transaction.type,

                minutes:
                    transaction.minutes,

                description:
                    transaction.description,
            }),
        )

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
                    timeZone: 'UTC',
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

            if (
                editingCompensation
            ) {
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
            } else {
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
            }

            await loadDashboardData()

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
        if (
            isDeletingCompensation
        ) {
            return
        }

        setCompensationToDelete(
            null,
        )
    }

    async function handleConfirmDeleteCompensation() {
        if (
            !compensationToDelete
        ) {
            return
        }

        try {
            setIsDeletingCompensation(
                true,
            )

            await deleteBankTransaction(
                compensationToDelete.id,
            )

            await loadDashboardData()

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

            await loadDashboardData()
        } catch (error) {
            console.error(
                workdayId
                    ? 'Erro ao atualizar jornada:'
                    : 'Erro ao registrar jornada:',
                error,
            )
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

            <CardWarning
                isOpen={
                    compensationToDelete !==
                    null
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
                isLoading={
                    isDeletingCompensation
                }
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