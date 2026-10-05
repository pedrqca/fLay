import {
    ArrowUpRight,
    FileImage,
    Plus,
    Trash2,
    Upload,
} from 'lucide-react'

import {
    useState,
} from 'react'

import {
    CompensationModal,
    type CompensationData,
    type CompensationToEdit,
} from './CompensationModal'

import { CardWarning } from '../ui/CardWarning'

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

    onOpenCompensation: () => void | Promise<void>

    onCloseCompensation: () => void

    onCompensationSubmit: (
        data: CompensationData,
    ) => Promise<void>

    editingCompensation?: CompensationToEdit | null

    onProofSubmit?: (
        data: ProofData,
        workdayId?: number,
    ) => void | Promise<void>

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

    const [
        isOpeningCompensation,
        setIsOpeningCompensation,
    ] = useState(false)

    async function handleOpenCompensationClick() {
        setIsOpeningCompensation(true)

        try {
            await onOpenCompensation()
        } catch (error) {
            console.error('Erro ao abrir compensação:', error)
        } finally {
            setIsOpeningCompensation(false)
        }
    }

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

    async function handleProofSubmit(
        data: ProofData,
    ) {
        console.log(
            proofToEdit
                ? 'Jornada editada:'
                : 'Comprovante preenchido:',
            data,
        )

        try {
            await onProofSubmit?.(
                data,
                proofToEdit?.id,
            )
            handleCloseProofModal()
        } catch (error) {
            console.error('Erro ao salvar:', error)
            throw error
        }
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
                            onClick={handleOpenCompensationClick}
                            disabled={isOpeningCompensation}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#A3B18A]/50 bg-white px-4 py-2.5 text-sm font-medium text-[#588157] transition-colors hover:bg-[#DAD7CD] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                            <Plus size={17} />

                            {isOpeningCompensation ? 'Processando...' : 'Registrar compensação'}
                        </button>

                        <button
                            type="button"
                            onClick={handleOpenCreateModal}
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
                                className={`flex flex-col px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between ${index !== proofs.length - 1
                                    ? 'border-b border-[#A3B18A]/20'
                                    : ''
                                    }`}
                            >
                                {/* INFORMAÇÕES DO COMPROVANTE */}
                                <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#A3B18A]/20 text-[#588157] sm:h-11 sm:w-11">
                                        <FileImage size={20} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-[#2F4A33]">
                                            {proof.date}
                                        </p>

                                        {/* AQUI: Removido truncate no mobile, adicionado md:truncate e wrap no texto */}
                                        <p className="mt-1 text-sm leading-relaxed text-[#588157] md:truncate">
                                            {formatTimes(proof.times)}
                                        </p>
                                    </div>
                                </div>

                                {/* AÇÕES */}
                                {/* AQUI: Adicionado separação e espaçamento no celular */}
                                <div className="mt-3 flex shrink-0 items-center justify-end gap-5 border-t border-[#A3B18A]/10 pt-3 md:mt-0 md:w-auto md:gap-4 md:border-0 md:pt-0">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleEditClick(proof)
                                        }
                                        className="flex items-center gap-1.5 text-sm font-medium text-[#588157] transition-colors hover:text-[#2F4A33]"
                                    >
                                        <span>Editar</span>
                                        <ArrowUpRight size={16} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteClick(proof)
                                        }
                                        disabled={deletingId !== null}
                                        className="flex items-center gap-1.5 text-sm font-medium text-red-500 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Trash2 size={16} />
                                        <span>Excluir</span>
                                    </button>
                                </div>
                            </article>
                        ),
                    )}
                </div>
            </section>

            {/* MODAL DE COMPENSAÇÃO */}
            <CompensationModal
                isOpen={isCompensationModalOpen}
                onClose={onCloseCompensation}
                onSubmit={onCompensationSubmit}
                editingTransaction={editingCompensation}
            />

            {/* MODAL DE COMPROVANTE */}
            <ProofModal
                isOpen={isProofModalOpen}
                onClose={handleCloseProofModal}
                onSubmit={handleProofSubmit}
                initialData={
                    proofToEdit
                        ? {
                            date: normalizeDate(proofToEdit.date),
                            times: [...proofToEdit.times],
                        }
                        : undefined
                }
            />

            {/* MODAL DE EXCLUSÃO REFATORADO */}
            <CardWarning
                isOpen={workdayToDelete !== null}
                title="Excluir jornada?"
                description="Você está prestes a excluir esta jornada."
                itemTitle={workdayToDelete ? `Jornada de: ${workdayToDelete.date}` : undefined}
                warning="Essa ação removerá os registros de horário e o lançamento correspondente no banco de horas. Essa operação não pode ser desfeita."
                confirmLabel="Excluir jornada"
                cancelLabel="Cancelar"
                isLoading={deletingId !== null}
                loadingLabel="Excluindo..."
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
            />
        </>
    )
}