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

            return
        }

        setDate('')
        setHours('')
        setDescription('')
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
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 px-4 py-4 sm:items-center sm:py-6">
            <div className="my-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="text-lg font-semibold tracking-tight text-[#2F4A33] sm:text-xl">
                            {isEditing
                                ? 'Editar compensação'
                                : 'Registrar compensação'}
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-[#588157]">
                            {isEditing
                                ? 'Atualize os dados da compensação.'
                                : 'Registre horas utilizadas do seu banco.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#588157] transition-colors hover:bg-[#DAD7CD] disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Fechar"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4A33]">
                            Data
                        </label>

                        <DatePicker
                            value={date}
                            onChange={setDate}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-[#2F4A33]">
                            Horas compensadas
                        </label>

                        <TimePicker
                            value={hours}
                            onChange={setHours}
                        />

                        <p className="mt-2 text-xs leading-5 text-[#A3B18A]">
                            Informe a quantidade de horas utilizadas.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="compensation-description"
                            className="mb-2 block text-sm font-medium text-[#2F4A33]"
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
                            className="w-full rounded-xl border border-[#A3B18A]/40 bg-[#FAF9F6] px-4 py-3 text-sm text-[#2F4A33] outline-none placeholder:text-[#A3B18A] transition-colors focus:border-[#588157]"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="w-full rounded-xl border border-[#A3B18A]/50 bg-white px-4 py-2.5 text-sm font-medium text-[#588157] transition-colors hover:bg-[#DAD7CD] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-xl bg-[#588157] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2F4A33] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
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
    )
}