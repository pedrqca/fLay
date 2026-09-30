import {
    Check,
    ChevronDown,
    Clock3,
} from 'lucide-react'
import {
    useEffect,
    useRef,
    useState,
} from 'react'

interface TimePickerProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    onEnter?: () => void
}

const hours = Array.from(
    { length: 24 },
    (_, index) =>
        index.toString().padStart(2, '0'),
)

const minutes = Array.from(
    { length: 60 },
    (_, index) =>
        index.toString().padStart(2, '0'),
)

function normalizeTime(
    value: string,
): string | null {
    const trimmedValue =
        value.trim()

    if (!trimmedValue) {
        return null
    }

    // Formato HH:mm
    if (
        trimmedValue.includes(':')
    ) {
        const [
            hourPart,
            minutePart,
        ] = trimmedValue.split(':')

        if (
            !hourPart ||
            !minutePart ||
            !/^\d{1,2}$/.test(
                hourPart,
            ) ||
            !/^\d{1,2}$/.test(
                minutePart,
            )
        ) {
            return null
        }

        const hour = Number(
            hourPart,
        )

        const minute = Number(
            minutePart,
        )

        if (
            hour < 0 ||
            hour > 23 ||
            minute < 0 ||
            minute > 59
        ) {
            return null
        }

        return `${hour
            .toString()
            .padStart(2, '0')}:${minute
                .toString()
                .padStart(2, '0')}`
    }

    const digits =
        trimmedValue.replace(
            /\D/g,
            '',
        )

    // HH → HH:00
    if (digits.length <= 2) {
        const hour = Number(digits)

        if (
            hour < 0 ||
            hour > 23
        ) {
            return null
        }

        return `${hour
            .toString()
            .padStart(2, '0')}:00`
    }

    // HHmm → HH:mm
    if (digits.length === 4) {
        const hour = Number(
            digits.slice(0, 2),
        )

        const minute = Number(
            digits.slice(2, 4),
        )

        if (
            hour < 0 ||
            hour > 23 ||
            minute < 0 ||
            minute > 59
        ) {
            return null
        }

        return `${hour
            .toString()
            .padStart(2, '0')}:${minute
                .toString()
                .padStart(2, '0')}`
    }

    return null
}

export function TimePicker({
    value,
    onChange,
    placeholder = 'Selecionar horário',
    onEnter,
}: TimePickerProps) {
    const [
        isOpen,
        setIsOpen,
    ] = useState(false)

    const [
        openUpwards,
        setOpenUpwards,
    ] = useState(false)

    const [
        inputValue,
        setInputValue,
    ] = useState(value)

    const [
        selectedHour,
        setSelectedHour,
    ] = useState(
        value
            ? value.split(':')[0]
            : '08',
    )

    const [
        selectedMinute,
        setSelectedMinute,
    ] = useState(
        value
            ? value.split(':')[1]
            : '00',
    )

    const containerRef =
        useRef<HTMLDivElement>(null)

    const inputRef =
        useRef<HTMLInputElement>(null)

    useEffect(() => {
        setInputValue(value)

        if (value.includes(':')) {
            const [
                hour,
                minute,
            ] = value.split(':')

            setSelectedHour(hour)
            setSelectedMinute(minute)
        }
    }, [value])

    useEffect(() => {
        function handleClickOutside(
            event: MouseEvent,
        ) {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node,
                )
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener(
            'mousedown',
            handleClickOutside,
        )

        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutside,
            )
        }
    }, [])

    function handleOpen() {
        if (!containerRef.current) {
            setIsOpen(true)
            return
        }

        const rect =
            containerRef.current.getBoundingClientRect()

        const estimatedDropdownHeight = 360

        const spaceBelow =
            window.innerHeight - rect.bottom

        const spaceAbove = rect.top

        setOpenUpwards(
            spaceBelow <
            estimatedDropdownHeight &&
            spaceAbove > spaceBelow,
        )

        setIsOpen((current) => !current)
    }

    function handleInputChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        let value =
            event.target.value

        const digits =
            value.replace(/\D/g, '')

        if (digits.length <= 4) {
            if (digits.length === 4) {
                const normalized =
                    normalizeTime(digits)

                if (normalized) {
                    setInputValue(
                        normalized,
                    )

                    const [
                        hour,
                        minute,
                    ] =
                        normalized.split(':')

                    setSelectedHour(hour)
                    setSelectedMinute(
                        minute,
                    )

                    onChange(normalized)
                } else {
                    setInputValue(
                        digits,
                    )
                }

                return
            }

            setInputValue(value)
        }
    }

    function handleInputKeyDown(
        event: React.KeyboardEvent<HTMLInputElement>,
    ) {
        if (
            event.key !== 'Enter'
        ) {
            return
        }

        event.preventDefault()

        const normalized =
            normalizeTime(inputValue)

        if (!normalized) {
            return
        }

        setInputValue(normalized)
        onChange(normalized)
        setIsOpen(false)

        onEnter?.()
    }

    function handleSelectHour(
        hour: string,
    ) {
        setSelectedHour(hour)

        const newValue = `${hour}:${selectedMinute}`

        setInputValue(newValue)
        onChange(newValue)
    }

    function handleSelectMinute(
        minute: string,
    ) {
        setSelectedMinute(minute)

        const newValue = `${selectedHour}:${minute}`

        setInputValue(newValue)
        onChange(newValue)
    }

    function handleConfirm() {
        const newValue = `${selectedHour}:${selectedMinute}`

        setInputValue(newValue)
        onChange(newValue)
        setIsOpen(false)

        inputRef.current?.focus()
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full"
        >
            <div className="flex w-full items-center rounded-xl border border-[#A3B18A]/40 bg-white transition-colors focus-within:border-[#588157] focus-within:ring-2 focus-within:ring-[#A3B18A]/20">
                <Clock3
                    size={18}
                    className="ml-4 shrink-0 text-[#588157]"
                />

                <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    value={inputValue}
                    onChange={
                        handleInputChange
                    }
                    onKeyDown={
                        handleInputKeyDown
                    }
                    placeholder={
                        placeholder
                    }
                    maxLength={5}
                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-[#2F4A33] outline-none placeholder:text-[#A3B18A]"
                    aria-label={
                        placeholder
                    }
                />

                <button
                    type="button"
                    onClick={handleOpen}
                    className="mr-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#588157] transition-colors hover:bg-[#DAD7CD]"
                    aria-label="Abrir seletor de horário"
                >
                    <ChevronDown
                        size={18}
                        className={
                            isOpen
                                ? 'rotate-180 transition-transform'
                                : 'transition-transform'
                        }
                    />
                </button>
            </div>

            {isOpen && (
                <div
                    className={`absolute left-0 z-[60] w-full min-w-[300px] rounded-2xl border border-[#A3B18A]/30 bg-white p-5 shadow-xl ${openUpwards
                        ? 'bottom-full mb-2'
                        : 'top-full mt-2'
                        }`}
                >
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-[#2F4A33]">
                            Selecionar horário
                        </p>

                        <p className="mt-1 text-xs text-[#588157]">
                            Você também pode digitar, por exemplo, 0802.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#A3B18A]">
                                Hora
                            </p>

                            <div className="max-h-48 overflow-y-auto rounded-xl border border-[#A3B18A]/30">
                                {hours.map(
                                    (hour) => (
                                        <button
                                            key={
                                                hour
                                            }
                                            type="button"
                                            onClick={() =>
                                                handleSelectHour(
                                                    hour,
                                                )
                                            }
                                            className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors ${selectedHour ===
                                                hour
                                                ? 'bg-[#A3B18A]/20 font-semibold text-[#2F4A33]'
                                                : 'text-[#588157] hover:bg-[#DAD7CD]'
                                                }`}
                                        >
                                            <span>
                                                {
                                                    hour
                                                }
                                            </span>

                                            {selectedHour ===
                                                hour && (
                                                    <Check
                                                        size={
                                                            16
                                                        }
                                                    />
                                                )}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[#A3B18A]">
                                Minuto
                            </p>

                            <div className="max-h-48 overflow-y-auto rounded-xl border border-[#A3B18A]/30">
                                {minutes.map(
                                    (
                                        minute,
                                    ) => (
                                        <button
                                            key={
                                                minute
                                            }
                                            type="button"
                                            onClick={() =>
                                                handleSelectMinute(
                                                    minute,
                                                )
                                            }
                                            className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors ${selectedMinute ===
                                                minute
                                                ? 'bg-[#A3B18A]/20 font-semibold text-[#2F4A33]'
                                                : 'text-[#588157] hover:bg-[#DAD7CD]'
                                                }`}
                                        >
                                            <span>
                                                {
                                                    minute
                                                }
                                            </span>

                                            {selectedMinute ===
                                                minute && (
                                                    <Check
                                                        size={
                                                            16
                                                        }
                                                    />
                                                )}
                                        </button>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#A3B18A]/20 pt-4">
                        <p className="text-sm text-[#588157]">
                            Horário:{' '}
                            <span className="font-semibold text-[#2F4A33]">
                                {selectedHour}:
                                {
                                    selectedMinute
                                }
                            </span>
                        </p>

                        <button
                            type="button"
                            onClick={
                                handleConfirm
                            }
                            className="flex items-center gap-2 rounded-xl bg-[#588157] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2F4A33]"
                        >
                            <Check
                                size={16}
                            />
                            Confirmar horário
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}