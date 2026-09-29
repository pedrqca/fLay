import { X } from 'lucide-react'
import { useState } from 'react'

import { DatePicker } from '../ui/DatePicker'
import { TimePicker } from '../ui/TimePicker'

export interface CompensationData {
    date: string
    hours: string
    description: string
}

interface CompensationModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: CompensationData) => void
}

export function CompensationModal({
    isOpen,
    onClose,
    onSubmit,
}: CompensationModalProps) {
    const [date, setDate] = useState('')
    const [hours, setHours] = useState('')
    const [description, setDescription] =
        useState('')

    if (!isOpen) {
        return null
    }

    function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        onSubmit({
            date,
            hours,
            description,
        })

        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 px-4 py-4 sm:items-center sm:py-6">
            <div className="my-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 className="text-lg font-semibold tracking-tight text-[#2F4A33] sm:text-xl">
                            Registrar compensação
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-[#588157]">
                            Registre horas utilizadas do seu banco.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#588157] transition-colors hover:bg-[#DAD7CD]"
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
                        />
                    </div>

                    <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full rounded-xl border border-[#A3B18A]/50 bg-white px-4 py-2.5 text-sm font-medium text-[#588157] transition-colors hover:bg-[#DAD7CD] sm:w-auto"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="w-full rounded-xl bg-[#588157] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2F4A33] sm:w-auto"
                        >
                            Registrar compensação
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}