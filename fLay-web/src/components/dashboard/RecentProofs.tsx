import {
    ArrowUpRight,
    FileImage,
    Plus,
    Trash2,
    Upload,
    X,
} from 'lucide-react'

import {
    useState,
} from 'react'

import {
    CompensationModal,
    type CompensationData,
    type CompensationToEdit,
} from './CompensationModal'

import {
    ProofModal,
    type ProofData,
} from './ProofModal'

interface Proof {
    id: number
    date: string
    times: string[]
}

interface RecentProofsProps {
    proofs: Proof[]

    isCompensationModalOpen: boolean

    onOpenCompensation: () => void

    onCloseCompensation: () => void

    onCompensationSubmit: (
        data: CompensationData,
    ) => void

    editingCompensation?: CompensationToEdit | null

    onProofSubmit?: (
        data: ProofData,
        workdayId?: number,
    ) => void

    onDelete?: (
        workdayId: number,
    ) => Promise<void>
}

export function RecentProofs({
    proofs,
    isCompensationModalOpen,
    onOpenCompensation,
    onCloseCompensation,
    onCompensationSubmit,
    editingCompensation,
    onProofSubmit,
    onDelete,
}: RecentProofsProps) {
    const [
        isProofModalOpen,
        setIsProofModalOpen,
    ] = useState(false)

    const [
        proofToEdit,
        setProofToEdit,
    ] = useState<Proof | null>(null)

    const [
        deletingId,
        setDeletingId,
    ] = useState<number | null>(null)

    const [
        workdayToDelete,
        setWorkdayToDelete,
    ] = useState<Proof | null>(null)

    function handleOpenCreateModal() {
        setProofToEdit(null)
        setIsProofModalOpen(true)
    }

    function handleEditClick(
        proof: Proof,
    ) {
        setProofToEdit(proof)
        setIsProofModalOpen(true)
    }

    function handleCloseProofModal() {
        setIsProofModalOpen(false)
        setProofToEdit(null)
    }

    function handleProofSubmit(
        data: ProofData,
    ) {
        console.log(
            proofToEdit
                ? 'Jornada editada:'
                : 'Comprovante preenchido:',
            data,
        )

        onProofSubmit?.(
            data,
            proofToEdit?.id,
        )

        handleCloseProofModal()
    }

    function handleDeleteClick(
        proof: Proof,
    ) {
        setWorkdayToDelete(proof)
    }

    function handleCloseDeleteModal() {
        if (deletingId !== null) {
            return
        }

        setWorkdayToDelete(null)
    }

    async function handleConfirmDelete() {
        if (!workdayToDelete) {
            return
        }

        try {
            setDeletingId(
                workdayToDelete.id,
            )

            await onDelete?.(
                workdayToDelete.id,
            )

            setWorkdayToDelete(null)
        } catch (error) {
            console.error(
                'Erro ao excluir jornada:',
                error,
            )
        } finally {
            setDeletingId(null)
        }
    }

    function formatTimes(
        times: string[],
    ) {
        if (times.length === 0) {
            return 'Nenhum horário registrado'
        }

        return times
            .map(
                (
                    time,
                    index,
                ) => {
                    const isEntry =
                        index % 2 === 0

                    return `${isEntry ? 'Entrada' : 'Saída'} ${time}`
                },
            )
            .join(' · ')
    }

    function normalizeDate(
        date: string,
    ): string {
        if (!date) {
            return ''
        }

        const cleanedDate =
            date.trim().replace(/\s+/g, '')

        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                cleanedDate,
            )
        ) {
            return cleanedDate
        }

        if (cleanedDate.includes('T')) {
            return cleanedDate.split('T')[0]
        }

        if (
            /^\d{2}\/\d{2}\/\d{4}$/.test(
                cleanedDate,
            )
        ) {
            const [
                day,
                month,
                year,
            ] = cleanedDate.split('/')

            return `${year}-${month}-${day}`
        }

        return cleanedDate
    }

    return (
        <>
            <section className="mt-8">
                <div className="mb-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-[#2F4A33]">
                            Comprovantes recentes
                        </h2>

                        <p className="mt-1 text-sm text-[#588157]">
                            Seus últimos comprovantes de ponto.
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:items-center">
                        <button
                            type="button"
                            onClick={
                                onOpenCompensation
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#A3B18A]/50 bg-white px-4 py-2.5 text-sm font-medium text-[#588157] transition-colors hover:bg-[#DAD7CD] sm:w-auto"
                        >
                            <Plus size={17} />

                            Registrar compensação
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleOpenCreateModal
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#588157] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2F4A33] sm:w-auto"
                        >
                            <Upload size={17} />

                            Enviar comprovante
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#A3B18A]/30 bg-white">
                    {proofs.map(
                        (
                            proof,
                            index,
                        ) => (
                            <article
                                key={proof.id}
                                className={`flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between ${index !==
                                    proofs.length - 1
                                    ? 'border-b border-[#A3B18A]/20'
                                    : ''
                                    }`}
                            >
                                {/* INFORMAÇÕES DO COMPROVANTE */}
                                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A3B18A]/20 text-[#588157] sm:h-11 sm:w-11">
                                        <FileImage
                                            size={20}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[#2F4A33]">
                                            {
                                                proof.date
                                            }
                                        </p>

                                        <p className="mt-1 truncate text-sm text-[#588157]">
                                            {formatTimes(
                                                proof.times,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* AÇÕES */}
                                <div className="flex shrink-0 items-center justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEditClick(
                                                proof,
                                            )
                                        }
                                        className="flex items-center gap-1.5 text-sm font-medium text-[#588157] transition-colors hover:text-[#2F4A33]"
                                    >
                                        <span>
                                            Editar
                                        </span>

                                        <ArrowUpRight
                                            size={16}
                                        />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteClick(
                                                proof,
                                            )
                                        }
                                        disabled={
                                            deletingId !==
                                            null
                                        }
                                        className="flex items-center gap-1.5 text-sm font-medium text-red-500 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Trash2
                                            size={16}
                                        />

                                        <span>
                                            Excluir
                                        </span>
                                    </button>
                                </div>
                            </article>
                        ),
                    )}
                </div>
            </section>

            {/* MODAL DE COMPENSAÇÃO */}
            <CompensationModal
                isOpen={
                    isCompensationModalOpen
                }
                onClose={
                    onCloseCompensation
                }
                onSubmit={
                    onCompensationSubmit
                }
                editingTransaction={
                    editingCompensation
                }
            />

            {/* MODAL DE COMPROVANTE */}
            <ProofModal
                isOpen={
                    isProofModalOpen
                }
                onClose={
                    handleCloseProofModal
                }
                onSubmit={
                    handleProofSubmit
                }
                initialData={
                    proofToEdit
                        ? {
                            date: normalizeDate(
                                proofToEdit.date,
                            ),
                            times: [
                                ...proofToEdit.times,
                            ],
                        }
                        : undefined
                }
            />

            {/* MODAL DE EXCLUSÃO */}
            {workdayToDelete && (
                <div
                    className="fixed inset-0 z-[70] flex items-center justify-center bg-[#2F4A33]/30 px-4 py-6 backdrop-blur-sm"
                    onMouseDown={(
                        event,
                    ) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseDeleteModal()
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

                                <div className="min-w-0">
                                    <h3 className="text-lg font-semibold text-[#2F4A33]">
                                        Excluir jornada?
                                    </h3>

                                    <p className="mt-1.5 text-sm leading-5 text-[#588157]">
                                        Você está prestes a excluir a jornada de{' '}
                                        <span className="font-semibold text-[#2F4A33]">
                                            {
                                                workdayToDelete.date
                                            }
                                        </span>
                                        .
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        handleCloseDeleteModal
                                    }
                                    disabled={
                                        deletingId !==
                                        null
                                    }
                                    className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#588157] transition-colors hover:bg-[#DAD7CD] disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Fechar"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="mt-5 rounded-xl border border-red-100 bg-red-50/70 px-4 py-3.5">
                                <p className="text-sm leading-5 text-red-700">
                                    Essa ação removerá os registros de horário e o lançamento correspondente no banco de horas. Essa operação não pode ser desfeita.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-2 border-t border-[#A3B18A]/20 bg-white/60 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                            <button
                                type="button"
                                onClick={
                                    handleCloseDeleteModal
                                }
                                disabled={
                                    deletingId !==
                                    null
                                }
                                className="w-full rounded-xl border border-[#A3B18A]/50 bg-white px-5 py-2.5 text-sm font-medium text-[#588157] transition-colors hover:bg-[#DAD7CD] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleConfirmDelete
                                }
                                disabled={
                                    deletingId !==
                                    null
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                            >
                                <Trash2
                                    size={16}
                                />

                                {deletingId !==
                                    null
                                    ? 'Excluindo...'
                                    : 'Excluir jornada'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}