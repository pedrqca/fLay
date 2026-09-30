import {
    ArrowDownToLine,
    Clock3,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react'

import {
    useEffect,
    useState,
} from 'react'

import {
    ProofModal,
    type ProofData,
} from '../components/dashboard/ProofModal'

import {
    CompensationModal,
    type CompensationData,
    type CompensationToEdit,
} from '../components/dashboard/CompensationModal'

import { CardWarning } from '../components/ui/CardWarning'

import {
    getWorkdays,
    createWorkday,
    updateWorkday,
    deleteWorkday,
    type Workday,
} from '../api/workdays'

import {
    getBankTransactions,
    createBankTransaction,
    updateBankTransaction,
    deleteBankTransaction,
    type BankTransaction,
} from '../api/bankTransactions'

const USER_ID = 1

interface ProofListItem {
    id: string
    date: string

    type:
    | 'WORKDAY'
    | 'COMPENSATION'

    workdayId?: number
    transactionId?: number

    title: string
    description: string
    times?: string[]
    minutes?: number

    transactionType?:
    | 'EXTRA'
    | 'COMPENSATION'
}

function getExpectedMinutes(
    date: string,
): number {
    const [
        year,
        month,
        day,
    ] = date
        .split('-')
        .map(Number)

    const dateObject =
        new Date(
            year,
            month - 1,
            day,
        )

    const dayOfWeek =
        dateObject.getDay()

    if (dayOfWeek === 0) {
        return 0
    }

    if (dayOfWeek === 6) {
        return 240
    }

    return 480
}

function convertHoursToMinutes(
    hours: string,
): number {
    if (!hours) {
        return 0
    }

    const [
        hoursPart,
        minutesPart,
    ] = hours
        .split(':')
        .map(Number)

    if (
        !Number.isFinite(
            hoursPart,
        ) ||
        !Number.isFinite(
            minutesPart,
        )
    ) {
        return 0
    }

    return (
        hoursPart * 60 +
        minutesPart
    )
}

function formatDate(
    date: string,
): string {
    const dateOnly =
        date.split('T')[0]

    const [
        year,
        month,
        day,
    ] = dateOnly.split('-')

    return `${day}/${month}/${year}`
}

function getDateOnly(
    date: string,
): string {
    return date.split('T')[0]
}

function formatMinutes(
    minutes: number,
): string {
    const absoluteMinutes =
        Math.abs(minutes)

    const hours =
        Math.floor(
            absoluteMinutes / 60,
        )

    const remainingMinutes =
        absoluteMinutes % 60

    return `${hours
        .toString()
        .padStart(
            2,
            '0',
        )}h ${remainingMinutes
            .toString()
            .padStart(
                2,
                '0',
            )}min`
}

function calculateWorkdayMinutes(
    times: string[],
): number {
    let totalMinutes = 0

    for (
        let index = 0;
        index < times.length;
        index += 2
    ) {
        const [
            startHour,
            startMinute,
        ] = times[index]
            .split(':')
            .map(Number)

        const [
            endHour,
            endMinute,
        ] = times[
            index + 1
        ]
            .split(':')
            .map(Number)

        const start =
            startHour * 60 +
            startMinute

        const end =
            endHour * 60 +
            endMinute

        totalMinutes +=
            end - start
    }

    return totalMinutes
}

function calculateWorkdayBalance(
    date: string,
    times: string[],
): number {
    const workedMinutes =
        calculateWorkdayMinutes(
            times,
        )

    const expectedMinutes =
        getExpectedMinutes(
            date,
        )

    return (
        workedMinutes -
        expectedMinutes
    )
}

function buildProofList(
    workdays: Workday[],
    transactions: BankTransaction[],
): ProofListItem[] {
    const workdayItems =
        workdays.map(
            (workday) => {
                const date =
                    getDateOnly(
                        workday.date,
                    )

                const times =
                    workday.timeEntries.map(
                        (entry) =>
                            entry.time,
                    )

                const balance =
                    calculateWorkdayBalance(
                        date,
                        times,
                    )

                const transaction =
                    transactions.find(
                        (item) =>
                            item.workdayId ===
                            workday.id,
                    )

                return {
                    id: `workday-${workday.id}`,
                    date,
                    type: 'WORKDAY' as const,

                    workdayId:
                        workday.id,

                    transactionId:
                        transaction?.id,

                    title:
                        'Jornada registrada',

                    description:
                        transaction?.description ??
                        'Registro de ponto',

                    times,

                    minutes:
                        balance,

                    transactionType:
                        transaction?.type,
                }
            },
        )

    const compensationItems =
        transactions
            .filter(
                (
                    transaction,
                ) =>
                    transaction.workdayId ===
                    null &&
                    transaction.type ===
                    'COMPENSATION',
            )
            .map(
                (
                    transaction,
                ) => ({
                    id: `compensation-${transaction.id}`,

                    date: getDateOnly(
                        transaction.date,
                    ),

                    type:
                        'COMPENSATION' as const,

                    transactionId:
                        transaction.id,

                    title:
                        'Compensação',

                    description:
                        transaction.description,

                    minutes:
                        transaction.minutes,

                    transactionType:
                        'COMPENSATION' as const,
                }),
            )

    return [
        ...workdayItems,
        ...compensationItems,
    ].sort(
        (a, b) =>
            new Date(
                b.date,
            ).getTime() -
            new Date(
                a.date,
            ).getTime(),
    )
}

export function Proofs() {
    const [
        workdays,
        setWorkdays,
    ] = useState<Workday[]>(
        [],
    )

    const [
        transactions,
        setTransactions,
    ] = useState<
        BankTransaction[]
    >([])

    const [
        isLoading,
        setIsLoading,
    ] = useState(true)

    const [
        isSaving,
        setIsSaving,
    ] = useState(false)

    const [
        isProofModalOpen,
        setIsProofModalOpen,
    ] = useState(false)

    const [
        isCompensationModalOpen,
        setIsCompensationModalOpen,
    ] = useState(false)

    const [
        editingProof,
        setEditingProof,
    ] = useState<
        ProofData | undefined
    >(undefined)

    const [
        editingWorkdayId,
        setEditingWorkdayId,
    ] = useState<
        number | null
    >(null)

    const [
        editingCompensation,
        setEditingCompensation,
    ] = useState<
        CompensationToEdit | null
    >(null)

    const [
        workdayToDelete,
        setWorkdayToDelete,
    ] = useState<
        Workday | null
    >(null)

    const [
        isDeletingWorkday,
        setIsDeletingWorkday,
    ] = useState(false)

    const [
        compensationToDelete,
        setCompensationToDelete,
    ] = useState<
        BankTransaction | null
    >(null)

    const [
        isDeletingCompensation,
        setIsDeletingCompensation,
    ] = useState(false)

    const [
        errorMessage,
        setErrorMessage,
    ] = useState('')

    async function loadData() {
        try {
            setIsLoading(true)
            setErrorMessage('')

            const [
                workdaysData,
                transactionsData,
            ] = await Promise.all([
                getWorkdays(USER_ID),
                getBankTransactions(
                    USER_ID,
                ),
            ])

            setWorkdays(
                workdaysData,
            )

            setTransactions(
                transactionsData,
            )
        } catch (error) {
            if (
                error instanceof Error
            ) {
                setErrorMessage(
                    error.message,
                )
            } else {
                setErrorMessage(
                    'Não foi possível carregar os comprovantes.',
                )
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    // ==========================================
    // JORNADA
    // ==========================================

    function openCreateProofModal() {
        setEditingProof(
            undefined,
        )

        setEditingWorkdayId(null)

        setIsProofModalOpen(true)
    }

    function openEditProofModal(
        workdayId: number,
    ) {
        const workday =
            workdays.find(
                (item) =>
                    item.id ===
                    workdayId,
            )

        if (!workday) {
            return
        }

        setEditingProof({
            date: getDateOnly(
                workday.date,
            ),

            times:
                workday.timeEntries.map(
                    (entry) =>
                        entry.time,
                ),
        })

        setEditingWorkdayId(
            workday.id,
        )

        setIsProofModalOpen(true)
    }

    function closeProofModal() {
        if (isSaving) {
            return
        }

        setIsProofModalOpen(false)

        setEditingProof(
            undefined,
        )

        setEditingWorkdayId(null)
    }

    async function handleSubmitProof(
        data: ProofData,
    ) {
        try {
            setIsSaving(true)
            setErrorMessage('')

            const expectedMinutes =
                getExpectedMinutes(
                    data.date,
                )

            const proofs =
                data.times.map(
                    (time) => ({
                        date: data.date,
                        time,
                    }),
                )

            if (
                editingWorkdayId !==
                null
            ) {
                await updateWorkday(
                    editingWorkdayId,
                    {
                        expectedMinutes,
                        proofs,
                    },
                )
            } else {
                await createWorkday({
                    userId: USER_ID,
                    expectedMinutes,
                    proofs,
                })
            }

            setIsProofModalOpen(
                false,
            )

            setEditingProof(
                undefined,
            )

            setEditingWorkdayId(null)

            await loadData()
        } catch (error) {
            if (
                error instanceof Error
            ) {
                setErrorMessage(
                    error.message,
                )
            } else {
                setErrorMessage(
                    editingWorkdayId !==
                        null
                        ? 'Não foi possível atualizar a jornada.'
                        : 'Não foi possível registrar a jornada.',
                )
            }
        } finally {
            setIsSaving(false)
        }
    }

    function handleDeleteProof(
        workdayId: number,
    ) {
        const workday =
            workdays.find(
                (item) =>
                    item.id ===
                    workdayId,
            )

        if (!workday) {
            return
        }

        setWorkdayToDelete(
            workday,
        )
    }

    function handleCloseDeleteWorkday() {
        if (isDeletingWorkday) {
            return
        }

        setWorkdayToDelete(null)
    }

    async function handleConfirmDeleteWorkday() {
        if (!workdayToDelete) {
            return
        }

        try {
            setIsDeletingWorkday(
                true,
            )

            setErrorMessage('')

            await deleteWorkday(
                workdayToDelete.id,
            )

            await loadData()

            setWorkdayToDelete(null)
        } catch (error) {
            if (
                error instanceof Error
            ) {
                setErrorMessage(
                    error.message,
                )
            } else {
                setErrorMessage(
                    'Não foi possível excluir a jornada.',
                )
            }
        } finally {
            setIsDeletingWorkday(
                false,
            )
        }
    }

    // ==========================================
    // COMPENSAÇÃO
    // ==========================================

    function openCreateCompensationModal() {
        setEditingCompensation(
            null,
        )

        setIsCompensationModalOpen(
            true,
        )
    }

    function openEditCompensationModal(
        transactionId: number,
    ) {
        const transaction =
            transactions.find(
                (item) =>
                    item.id ===
                    transactionId,
            )

        if (!transaction) {
            return
        }

        setEditingCompensation({
            id: transaction.id,

            date: getDateOnly(
                transaction.date,
            ),

            minutes:
                transaction.minutes,

            description:
                transaction.description,
        })

        setIsCompensationModalOpen(
            true,
        )
    }

    function closeCompensationModal() {
        if (isSaving) {
            return
        }

        setIsCompensationModalOpen(
            false,
        )

        setEditingCompensation(
            null,
        )
    }

    async function handleSubmitCompensation(
        data: CompensationData,
    ) {
        try {
            setIsSaving(true)
            setErrorMessage('')

            const minutes =
                convertHoursToMinutes(
                    data.hours,
                )

            if (minutes <= 0) {
                setErrorMessage(
                    'Informe uma quantidade de horas válida para a compensação.',
                )

                return
            }

            if (!data.date) {
                setErrorMessage(
                    'Informe a data da compensação.',
                )

                return
            }

            if (
                !data.description.trim()
            ) {
                setErrorMessage(
                    'Informe uma descrição para a compensação.',
                )

                return
            }

            if (
                editingCompensation
            ) {
                await updateBankTransaction(
                    editingCompensation.id,
                    {
                        date: data.date,
                        type: 'COMPENSATION',
                        minutes,
                        description:
                            data.description.trim(),
                    },
                )
            } else {
                await createBankTransaction(
                    {
                        userId: USER_ID,
                        date: data.date,
                        type: 'COMPENSATION',
                        minutes,
                        description:
                            data.description.trim(),
                    },
                )
            }

            setIsCompensationModalOpen(
                false,
            )

            setEditingCompensation(
                null,
            )

            await loadData()
        } catch (error) {
            if (
                error instanceof Error
            ) {
                setErrorMessage(
                    error.message,
                )
            } else {
                setErrorMessage(
                    editingCompensation
                        ? 'Não foi possível atualizar a compensação.'
                        : 'Não foi possível registrar a compensação.',
                )
            }
        } finally {
            setIsSaving(false)
        }
    }

    function handleDeleteCompensation(
        transactionId: number,
    ) {
        const transaction =
            transactions.find(
                (item) =>
                    item.id ===
                    transactionId,
            )

        if (!transaction) {
            return
        }

        setCompensationToDelete(
            transaction,
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

            setErrorMessage('')

            await deleteBankTransaction(
                compensationToDelete.id,
            )

            await loadData()

            setCompensationToDelete(
                null,
            )
        } catch (error) {
            if (
                error instanceof Error
            ) {
                setErrorMessage(
                    error.message,
                )
            } else {
                setErrorMessage(
                    'Não foi possível excluir a compensação.',
                )
            }
        } finally {
            setIsDeletingCompensation(
                false,
            )
        }
    }

    const proofItems =
        buildProofList(
            workdays,
            transactions,
        )

    return (
        <>
            <main className="min-h-screen flex-1 bg-[#FAF9F6] px-5 pb-8 pt-28 sm:px-6 md:px-10 md:py-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="mb-2 text-sm font-medium text-[#A3B18A]">
                                Jornada
                            </p>

                            <h1 className="text-3xl font-semibold tracking-tight text-[#2F4A33] sm:text-4xl">
                                Comprovantes
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#588157]">
                                Consulte e gerencie seus registros de ponto e compensações.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                                type="button"
                                disabled={
                                    isSaving ||
                                    isDeletingWorkday ||
                                    isDeletingCompensation
                                }
                                onClick={
                                    openCreateCompensationModal
                                }
                                className="flex items-center justify-center gap-2 rounded-xl border border-[#A3B18A]/50 bg-white px-5 py-3 text-sm font-medium text-[#588157] transition-colors hover:bg-[#DAD7CD] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Plus
                                    size={18}
                                />

                                Nova compensação
                            </button>

                            <button
                                type="button"
                                disabled={
                                    isSaving ||
                                    isDeletingWorkday ||
                                    isDeletingCompensation
                                }
                                onClick={
                                    openCreateProofModal
                                }
                                className="flex items-center justify-center gap-2 rounded-xl bg-[#588157] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2F4A33] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Plus
                                    size={18}
                                />

                                Nova jornada
                            </button>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}

                    <div className="mt-8">
                        {isLoading ? (
                            <div className="rounded-2xl border border-[#A3B18A]/30 bg-white p-10 text-center">
                                <p className="text-sm text-[#588157]">
                                    Carregando comprovantes...
                                </p>
                            </div>
                        ) : proofItems.length ===
                            0 ? (
                            <div className="rounded-2xl border border-[#A3B18A]/30 bg-white p-10 text-center">
                                <p className="text-sm font-medium text-[#2F4A33]">
                                    Nenhum comprovante registrado
                                </p>

                                <p className="mt-1 text-sm text-[#A3B18A]">
                                    Suas jornadas e compensações aparecerão aqui.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {proofItems.map(
                                    (item) => {
                                        const isCompensation =
                                            item.type ===
                                            'COMPENSATION'

                                        const isPositive =
                                            !isCompensation &&
                                            (item.minutes ??
                                                0) > 0

                                        return (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="rounded-2xl border border-[#A3B18A]/30 bg-white p-5"
                                            >
                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                                    <div className="flex min-w-0 items-start gap-4">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DAD7CD] text-[#588157]">
                                                            {isCompensation ? (
                                                                <ArrowDownToLine
                                                                    size={
                                                                        19
                                                                    }
                                                                />
                                                            ) : (
                                                                <Clock3
                                                                    size={
                                                                        19
                                                                    }
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h2 className="text-sm font-semibold text-[#2F4A33]">
                                                                    {
                                                                        item.title
                                                                    }
                                                                </h2>

                                                                <span className="rounded-full bg-[#F0F1EA] px-2.5 py-1 text-xs font-medium text-[#588157]">
                                                                    {formatDate(
                                                                        item.date,
                                                                    )}
                                                                </span>
                                                            </div>

                                                            {isCompensation ? (
                                                                <p className="mt-2 text-sm text-[#588157]">
                                                                    {
                                                                        item.description
                                                                    }
                                                                </p>
                                                            ) : (
                                                                <>
                                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                                        {item.times?.map(
                                                                            (
                                                                                time,
                                                                                index,
                                                                            ) => (
                                                                                <span
                                                                                    key={`${item.id}-${time}-${index}`}
                                                                                    className="rounded-lg bg-[#FAF9F6] px-2.5 py-1.5 text-xs font-medium text-[#2F4A33]"
                                                                                >
                                                                                    {
                                                                                        time
                                                                                    }
                                                                                </span>
                                                                            ),
                                                                        )}
                                                                    </div>

                                                                    <p className="mt-2 text-sm text-[#588157]">
                                                                        {
                                                                            item.description
                                                                        }
                                                                    </p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                                        <div className="shrink-0 sm:text-right">
                                                            {isCompensation ? (
                                                                <>
                                                                    <p className="text-sm font-semibold text-[#B45353]">
                                                                        -
                                                                        {formatMinutes(
                                                                            item.minutes ??
                                                                            0,
                                                                        )}
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-[#A3B18A]">
                                                                        Horas compensadas
                                                                    </p>
                                                                </>
                                                            ) : item.minutes ===
                                                                0 ? (
                                                                <>
                                                                    <p className="text-sm font-semibold text-[#588157]">
                                                                        00h
                                                                        00min
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-[#A3B18A]">
                                                                        Jornada completa
                                                                    </p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <p
                                                                        className={`text-sm font-semibold ${isPositive
                                                                            ? 'text-[#588157]'
                                                                            : 'text-[#B45353]'
                                                                            }`}
                                                                    >
                                                                        {isPositive
                                                                            ? '+'
                                                                            : '-'}
                                                                        {formatMinutes(
                                                                            item.minutes ??
                                                                            0,
                                                                        )}
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-[#A3B18A]">
                                                                        {isPositive
                                                                            ? 'Horas extras'
                                                                            : 'Débito de horas'}
                                                                    </p>
                                                                </>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    isSaving ||
                                                                    isDeletingWorkday ||
                                                                    isDeletingCompensation
                                                                }
                                                                onClick={() => {
                                                                    if (
                                                                        isCompensation &&
                                                                        item.transactionId !==
                                                                        undefined
                                                                    ) {
                                                                        openEditCompensationModal(
                                                                            item.transactionId,
                                                                        )

                                                                        return
                                                                    }

                                                                    if (
                                                                        item.workdayId !==
                                                                        undefined
                                                                    ) {
                                                                        openEditProofModal(
                                                                            item.workdayId,
                                                                        )
                                                                    }
                                                                }}
                                                                className="flex items-center gap-2 rounded-lg border border-[#A3B18A]/40 px-3 py-2 text-xs font-medium text-[#588157] transition-colors hover:bg-[#FAF9F6] disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <Pencil
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                Editar
                                                            </button>

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    isSaving ||
                                                                    isDeletingWorkday ||
                                                                    isDeletingCompensation
                                                                }
                                                                onClick={() => {
                                                                    if (
                                                                        isCompensation &&
                                                                        item.transactionId !==
                                                                        undefined
                                                                    ) {
                                                                        handleDeleteCompensation(
                                                                            item.transactionId,
                                                                        )

                                                                        return
                                                                    }

                                                                    if (
                                                                        item.workdayId !==
                                                                        undefined
                                                                    ) {
                                                                        handleDeleteProof(
                                                                            item.workdayId,
                                                                        )
                                                                    }
                                                                }}
                                                                className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <Trash2
                                                                    size={
                                                                        15
                                                                    }
                                                                />

                                                                Excluir
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    },
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <ProofModal
                isOpen={
                    isProofModalOpen
                }
                onClose={
                    closeProofModal
                }
                onSubmit={
                    handleSubmitProof
                }
                initialData={
                    editingProof
                }
            />

            <CompensationModal
                isOpen={
                    isCompensationModalOpen
                }
                onClose={
                    closeCompensationModal
                }
                onSubmit={
                    handleSubmitCompensation
                }
                editingTransaction={
                    editingCompensation
                }
            />

            <CardWarning
                isOpen={
                    workdayToDelete !==
                    null
                }
                title="Excluir jornada?"
                description="Deseja realmente excluir esta jornada?"
                itemTitle={
                    workdayToDelete
                        ? formatDate(
                            workdayToDelete.date,
                        )
                        : undefined
                }
                itemDetails={
                    workdayToDelete
                        ? workdayToDelete.timeEntries.map(
                            (
                                entry,
                            ) =>
                                entry.time,
                        )
                        : []
                }
                warning="Essa ação removerá a jornada e o lançamento de banco de horas relacionado. Essa operação não pode ser desfeita."
                confirmLabel="Excluir jornada"
                loadingLabel="Excluindo..."
                isLoading={
                    isDeletingWorkday
                }
                onClose={
                    handleCloseDeleteWorkday
                }
                onConfirm={
                    handleConfirmDeleteWorkday
                }
            />

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
                            formatDate(
                                compensationToDelete.date,
                            ),
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
        </>
    )
}