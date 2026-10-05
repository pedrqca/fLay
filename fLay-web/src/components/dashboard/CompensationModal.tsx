import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { DatePicker } from '../ui/DatePicker'
import { TimePicker } from '../ui/TimePicker'

export interface CompensationData {
    date: string
    hours: string
    description: string
}

export interface CompensationToEdit {
    id: number
    date: string
    minutes: number
    description: string
}

interface CompensationModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (
        data: CompensationData,
    ) => Promise<void>
    editingTransaction?: CompensationToEdit | null
}

function formatDateForInput(
    date: string,
): string {
    const datePart = date.split('T')[0]

    return datePart
}

function formatMinutesToHours(
    minutes: number,
): string {
    const hours = Math.floor(
        minutes / 60,
    )

    const remainingMinutes =
        minutes % 60

    return `${hours
        .toString()
        .padStart(2, '0')
        }:${remainingMinutes
            .toString()
            .padStart(2, '0')
        } `
}

export function CompensationModal({
    isOpen,
    onClose,
    onSubmit,
    editingTransaction = null,
}: CompensationModalProps) {
    const [
        date,
        setDate,
    ] = useState('')

    const [
        hours,
        setHours,
    ] = useState('')

    const [
        description,
        setDescription,
    ] = useState('')

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false)

    const isEditing =
        editingTransaction !== null

    useEffect(() => {
        if (!isOpen) {
            return
        }

        if (editingTransaction) {
            setDate(
                formatDateForInput(
                    editingTransaction.date,
                ),
            )

            setHours(
                formatMinutesToHours(
                    editingTransaction.minutes,
                ),
            )

            setDescription(
                editingTransaction.description,
            )

            setIsSubmitting(false)
            return
        }

        setDate('')
        setHours('')
        setDescription('')
        setIsSubmitting(false)
    }, [
        isOpen,
        editingTransaction,
    ])

    if (!isOpen) {
        return null
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        if (isSubmitting) {
            return
        }

        try {
            setIsSubmitting(true)

            await onSubmit({
                date,
                hours,
                description,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleClose() {
        if (isSubmitting) {
            return
        }

        onClose()
    }

    return (
        <>
            {/* BACKDROP: Fundo desfocado fixo */}
            <div className="fixed inset-0 z-50 bg-[#0F172A]/30 backdrop-blur-sm transition-opacity" />

            {/* CONTAINER SCROLL: Permite rolagem se o modal for longo */}
            <div
                className="fixed inset-0 z-50 overflow-y-auto"
                onMouseDown={(event) => {
                    if (isSubmitting) return
                    if (event.target === event.currentTarget) handleClose()
                }}
            >
                {/* ALINHAMENTO RESPONSIVO: base no mobile, centro no PC */}
                <div
                    className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0"
                    onMouseDown={(event) => {
                        if (isSubmitting) return
                        if (event.target === event.currentTarget) handleClose()
                    }}
                >
                    <div className="relative w-full max-w-md transform overflow-visible rounded-2xl border border-[#E2E8F0] bg-white p-5 text-left shadow-[0_8px_24px_rgba(15,23,42,0.10)] transition-all sm:my-8 sm:p-6">

                        {/* HEADER */}
                        <div className="mb-6 flex items-start justify-between gap-4 border-b border-[#E2E8F0] pb-5">
                            <div className="min-w-0">
                                <h2 className="text-lg font-semibold tracking-tight text-[#0F172A] sm:text-xl">
                                    {isEditing
                                        ? 'Editar compensação'
                                        : 'Registrar compensação'}
                                </h2>

                                <p className="mt-1 text-xs leading-relaxed text-[#475569] sm:text-sm">
                                    {isEditing
                                        ? 'Atualize os dados da compensação.'
                                        : 'Registre horas utilizadas do seu banco.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#0F172A] transition-colors hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Fechar"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 sm:space-y-5"
                        >
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#0F172A]">
                                    Data
                                </label>

                                <DatePicker
                                    value={date}
                                    onChange={setDate}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#0F172A]">
                                    Horas compensadas
                                </label>

                                <TimePicker
                                    value={hours}
                                    onChange={setHours}
                                />

                                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                                    Informe a quantidade de horas utilizadas.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="compensation-description"
                                    className="mb-2 block text-sm font-medium text-[#0F172A]"
                                >
                                    Descrição
                                </label>

                                <input
                                    id="compensation-description"
                                    type="text"
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Ex.: Folga de sábado"
                                    className="w-full rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-slate-500 focus:border-[#6366F1] focus:ring-4 focus:ring-indigo-500/10"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            {/* ACTIONS */}
                            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-medium text-[#475569] transition-colors hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-xl bg-[#6366F1] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                >
                                    {isSubmitting
                                        ? 'Salvando...'
                                        : isEditing
                                            ? 'Salvar alterações'
                                            : 'Registrar compensação'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}