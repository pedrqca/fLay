import {
    Clock3,
    Plus,
    Trash2,
    X,
} from 'lucide-react'

import {
    useEffect,
    useState,
} from 'react'

import { DatePicker } from '../ui/DatePicker'
import { TimePicker } from '../ui/TimePicker'

export interface ProofData {
    date: string
    times: string[]
}

interface ProofModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (
        data: ProofData,
    ) => void | Promise<void>
    initialData?: ProofData
}

const initialForm: ProofData = {
    date: '',
    times: ['', ''],
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

    if (
        /^\d{4}\/\d{2}\/\d{2}$/.test(
            cleanedDate,
        )
    ) {
        return cleanedDate.replaceAll(
            '/',
            '-',
        )
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

    if (
        /^\d{2}-\d{2}-\d{4}$/.test(
            cleanedDate,
        )
    ) {
        const [
            day,
            month,
            year,
        ] = cleanedDate.split('-')

        return `${year}-${month}-${day}`
    }

    return cleanedDate
}

export function ProofModal({
    isOpen,
    onClose,
    onSubmit,
    initialData,
}: ProofModalProps) {
    const [
        form,
        setForm,
    ] = useState<ProofData>(
        initialForm,
    )

    const [
        error,
        setError,
    ] = useState('')

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false)

    useEffect(() => {
        if (!isOpen) {
            return
        }

        if (initialData) {
            setForm({
                date: normalizeDate(
                    initialData.date,
                ),
                times: [
                    ...initialData.times,
                ],
            })
        } else {
            setForm({
                date: '',
                times: ['', ''],
            })
        }

        setError('')
        setIsSubmitting(false)
    }, [
        isOpen,
        initialData,
    ])

    if (!isOpen) {
        return null
    }

    function handleDateChange(
        value: string,
    ) {
        setForm((currentForm) => ({
            ...currentForm,
            date: normalizeDate(value),
        }))

        setError('')
    }

    function handleTimeChange(
        index: number,
        value: string,
    ) {
        setForm((currentForm) => ({
            ...currentForm,
            times: currentForm.times.map(
                (
                    time,
                    currentIndex,
                ) =>
                    currentIndex === index
                        ? value
                        : time,
            ),
        }))

        setError('')
    }

    function handleAddTime() {
        setForm((currentForm) => ({
            ...currentForm,
            times: [
                ...currentForm.times,
                '',
            ],
        }))

        setError('')
    }

    function handleRemoveTime(
        index: number,
    ) {
        if (form.times.length <= 2) {
            return
        }

        setForm((currentForm) => ({
            ...currentForm,
            times: currentForm.times.filter(
                (
                    _,
                    currentIndex,
                ) =>
                    currentIndex !== index,
            ),
        }))

        setError('')
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault()

        const normalizedDate =
            normalizeDate(form.date)

        if (!normalizedDate) {
            setError(
                'Selecione a data da jornada.',
            )

            return
        }

        const hasEmptyTime =
            form.times.some(
                (time) => !time,
            )

        if (hasEmptyTime) {
            setError(
                'Preencha todos os horários antes de confirmar.',
            )

            return
        }

        if (
            form.times.length % 2 !==
            0
        ) {
            setError(
                'A jornada precisa ter um número par de horários.',
            )

            return
        }

        const data: ProofData = {
            date: normalizedDate,
            times: [...form.times],
        }

        setError('')
        setIsSubmitting(true)

        try {
            await onSubmit(data)
        } catch (err) {
            console.error('Erro ao salvar jornada:', err)
            setError('Ocorreu um erro ao salvar. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    function getTimeLabel(
        index: number,
    ) {
        const period =
            Math.floor(index / 2) + 1

        const isEntry =
            index % 2 === 0

        if (isEntry) {
            return `Entrada ${period}`
        }

        return `Saída ${period}`
    }

    const isEditing =
        Boolean(initialData)

    return (
        <>
            {/* BACKDROP: Fundo desfocado fixo */}
            <div className="fixed inset-0 z-50 bg-[#2F4A33]/30 backdrop-blur-sm transition-opacity" />

            {/* CONTAINER SCROLL: Permite rolagem se o modal ficar muito alto */}
            <div
                className="fixed inset-0 z-50 overflow-y-auto"
                onMouseDown={(event) => {
                    if (isSubmitting) return
                    if (event.target === event.currentTarget) onClose()
                }}
            >
                {/* ALINHAMENTO RESPONSIVO: items-end no mobile (fica na base), items-center no PC */}
                <div
                    className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0"
                    onMouseDown={(event) => {
                        if (isSubmitting) return
                        if (event.target === event.currentTarget) onClose()
                    }}
                >
                    <div className="relative w-full max-w-lg transform overflow-visible rounded-2xl bg-[#FAF9F6] text-left shadow-xl transition-all sm:my-8">

                        {/* HEADER */}
                        <div className="flex items-start justify-between gap-4 border-b border-[#A3B18A]/30 px-4 py-4 sm:px-6 sm:py-5">
                            <div className="min-w-0">
                                <h2 className="text-lg font-semibold text-[#2F4A33] sm:text-xl">
                                    {isEditing
                                        ? 'Editar jornada'
                                        : 'Registrar jornada'}
                                </h2>

                                <p className="mt-1 text-xs leading-relaxed text-[#588157] sm:text-sm">
                                    {isEditing
                                        ? 'Atualize os registros do seu dia.'
                                        : 'Informe os registros do seu dia.'}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#588157] transition-colors hover:bg-[#DAD7CD] disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Fechar"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 px-4 py-5 sm:px-6 sm:py-6"
                        >
                            {/* DATA */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[#2F4A33]">
                                    Data
                                </label>

                                <DatePicker
                                    value={form.date}
                                    onChange={handleDateChange}
                                />
                            </div>

                            {/* HORÁRIOS */}
                            <div>
                                <div className="mb-3 flex items-end justify-between gap-2">
                                    <div className="min-w-0">
                                        <label className="block text-sm font-medium text-[#2F4A33]">
                                            Horários
                                        </label>

                                        <p className="mt-0.5 text-xs leading-relaxed text-[#588157]">
                                            Adicione os registros de entrada e saída.
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-full bg-[#A3B18A]/15 px-2.5 py-1 text-xs font-medium text-[#588157]">
                                        {form.times.length} horários
                                    </span>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    {form.times.map(
                                        (time, index) => (
                                            <div
                                                key={index}
                                                className="flex items-end gap-2 sm:gap-3"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#2F4A33]">
                                                        <Clock3 size={16} />
                                                        {getTimeLabel(index)}
                                                    </label>

                                                    <TimePicker
                                                        value={time}
                                                        onChange={(value) =>
                                                            handleTimeChange(index, value)
                                                        }
                                                        placeholder="Selecione o horário"
                                                    />
                                                </div>

                                                {form.times.length > 2 && (
                                                    <button
                                                        type="button"
                                                        disabled={isSubmitting}
                                                        onClick={() => handleRemoveTime(index)}
                                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#A3B18A]/40 text-[#A3B18A] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#A3B18A]/40 disabled:hover:bg-transparent disabled:hover:text-[#A3B18A] sm:h-12 sm:w-12"
                                                        aria-label={`Remover ${getTimeLabel(index).toLowerCase()}`}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        ),
                                    )}
                                </div>

                                {/* ADICIONAR HORÁRIO */}
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={handleAddTime}
                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#A3B18A]/50 bg-white px-4 py-2.5 text-sm font-medium text-[#588157] transition-colors hover:border-[#588157] hover:bg-[#DAD7CD] disabled:cursor-not-allowed disabled:opacity-50 sm:py-3"
                                >
                                    <Plus size={18} />
                                    Adicionar horário
                                </button>

                                {/* EXPLICAÇÃO */}
                                <div className="mt-4 rounded-xl bg-[#A3B18A]/10 px-3 py-3 sm:px-4">
                                    <p className="text-xs leading-relaxed text-[#588157]">
                                        Os horários são considerados em pares: <strong>entrada → saída</strong>.
                                    </p>

                                    <p className="mt-1 text-xs leading-relaxed text-[#A3B18A]">
                                        Exemplo: 08:00 → 12:00 → 13:30 → 18:00.
                                    </p>
                                </div>
                            </div>

                            {/* ERRO */}
                            {error && (
                                <div
                                    className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 sm:px-4 sm:py-3"
                                    role="alert"
                                >
                                    <p className="text-sm leading-relaxed text-red-600">
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* ACTIONS */}
                            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="w-full rounded-xl border border-[#A3B18A]/50 bg-white px-5 py-2.5 text-sm font-medium text-[#588157] transition-colors hover:bg-[#DAD7CD] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        isSubmitting ||
                                        !form.date ||
                                        form.times.some((time) => !time) ||
                                        form.times.length % 2 !== 0
                                    }
                                    className="w-full rounded-xl bg-[#588157] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2F4A33] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                >
                                    {isSubmitting
                                        ? isEditing
                                            ? 'Salvando...'
                                            : 'Registrando...'
                                        : isEditing
                                            ? 'Salvar alterações'
                                            : 'Registrar jornada'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}