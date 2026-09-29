import {
    Check,
    ChevronDown,
    ChevronUp,
    Clock3,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface TimePickerProps {
    value: string
    onChange: (time: string) => void
    placeholder?: string
}

function parseTime(time: string) {
    if (!time) {
        return {
            hours: 0,
            minutes: 0,
        }
    }

    const [hours, minutes] = time
        .split(':')
        .map(Number)

    return {
        hours: Number.isNaN(hours)
            ? 0
            : hours,
        minutes: Number.isNaN(minutes)
            ? 0
            : minutes,
    }
}

function formatTime(
    hours: number,
    minutes: number,
): string {
    return `${String(hours).padStart(2, '0')}:${String(
        minutes,
    ).padStart(2, '0')}`
}

export function TimePicker({
    value,
    onChange,
    placeholder = 'Selecione uma duração',
}: TimePickerProps) {
    const [isOpen, setIsOpen] = useState(false)

    const initialTime = parseTime(value)

    const [hours, setHours] = useState(
        initialTime.hours,
    )

    const [minutes, setMinutes] = useState(
        initialTime.minutes,
    )

    const containerRef =
        useRef<HTMLDivElement>(null)

    useEffect(() => {
        const parsedTime = parseTime(value)

        setHours(parsedTime.hours)
        setMinutes(parsedTime.minutes)
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

    function updateHours(
        newValue: string,
    ) {
        const numericValue =
            newValue.replace(/\D/g, '')

        if (numericValue === '') {
            setHours(0)
            return
        }

        const parsedValue =
            Number(numericValue)

        if (parsedValue > 23) {
            setHours(23)
            return
        }

        setHours(parsedValue)
    }

    function updateMinutes(
        newValue: string,
    ) {
        const numericValue =
            newValue.replace(/\D/g, '')

        if (numericValue === '') {
            setMinutes(0)
            return
        }

        const parsedValue =
            Number(numericValue)

        if (parsedValue > 59) {
            setMinutes(59)
            return
        }

        setMinutes(parsedValue)
    }

    function changeHours(
        direction: 'up' | 'down',
    ) {
        setHours((currentHours) => {
            if (direction === 'up') {
                return currentHours >= 23
                    ? 0
                    : currentHours + 1
            }

            return currentHours <= 0
                ? 23
                : currentHours - 1
        })
    }

    function changeMinutes(
        direction: 'up' | 'down',
    ) {
        setMinutes((currentMinutes) => {
            if (direction === 'up') {
                return currentMinutes >= 59
                    ? 0
                    : currentMinutes + 1
            }

            return currentMinutes <= 0
                ? 59
                : currentMinutes - 1
        })
    }

    function handleConfirm() {
        const formattedTime = formatTime(
            hours,
            minutes,
        )

        onChange(formattedTime)
        setIsOpen(false)
    }

    function handleHoursBlur() {
        if (hours < 0) {
            setHours(0)
            return
        }

        if (hours > 23) {
            setHours(23)
        }
    }

    function handleMinutesBlur() {
        if (minutes < 0) {
            setMinutes(0)
            return
        }

        if (minutes > 59) {
            setMinutes(59)
        }
    }

    return (
        <div
            ref={containerRef}
            className="relative"
        >
            <button
                type="button"
                onClick={() =>
                    setIsOpen((open) => !open)
                }
                className={`flex w-full items-center justify-between rounded-xl border bg-[#FAF9F6] px-4 py-3 text-sm outline-none transition-colors ${isOpen
                        ? 'border-[#588157]'
                        : 'border-[#A3B18A]/40'
                    }`}
            >
                <span
                    className={
                        value
                            ? 'text-[#2F4A33]'
                            : 'text-[#A3B18A]'
                    }
                >
                    {value
                        ? value
                        : placeholder}
                </span>

                <Clock3
                    size={18}
                    className="text-[#588157]"
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[300px] rounded-2xl border border-[#A3B18A]/30 bg-white p-5 shadow-xl">
                    <div className="mb-5 text-center">
                        <p className="text-sm font-semibold text-[#2F4A33]">
                            Horas compensadas
                        </p>

                        <p className="mt-1 text-xs text-[#A3B18A]">
                            Digite ou ajuste a duração
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                        {/* HORAS */}
                        <div className="flex flex-col items-center">
                            <button
                                type="button"
                                onClick={() =>
                                    changeHours(
                                        'up',
                                    )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#588157] transition-colors hover:bg-[#DAD7CD]"
                                aria-label="Aumentar horas"
                            >
                                <ChevronUp
                                    size={18}
                                />
                            </button>

                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={String(
                                    hours,
                                ).padStart(
                                    2,
                                    '0',
                                )}
                                onChange={(event) =>
                                    updateHours(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                onBlur={
                                    handleHoursBlur
                                }
                                onFocus={(event) =>
                                    event.currentTarget.select()
                                }
                                className="h-16 w-20 rounded-xl bg-[#A3B18A]/15 text-center text-3xl font-semibold tracking-tight text-[#2F4A33] outline-none transition-colors focus:bg-[#A3B18A]/25 focus:ring-2 focus:ring-[#588157]/20"
                                aria-label="Horas"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    changeHours(
                                        'down',
                                    )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#588157] transition-colors hover:bg-[#DAD7CD]"
                                aria-label="Diminuir horas"
                            >
                                <ChevronDown
                                    size={18}
                                />
                            </button>

                            <span className="mt-1 text-xs text-[#A3B18A]">
                                horas
                            </span>
                        </div>

                        <span className="mb-5 text-2xl font-semibold text-[#A3B18A]">
                            :
                        </span>

                        {/* MINUTOS */}
                        <div className="flex flex-col items-center">
                            <button
                                type="button"
                                onClick={() =>
                                    changeMinutes(
                                        'up',
                                    )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#588157] transition-colors hover:bg-[#DAD7CD]"
                                aria-label="Aumentar minutos"
                            >
                                <ChevronUp
                                    size={18}
                                />
                            </button>

                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={String(
                                    minutes,
                                ).padStart(
                                    2,
                                    '0',
                                )}
                                onChange={(event) =>
                                    updateMinutes(
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                onBlur={
                                    handleMinutesBlur
                                }
                                onFocus={(event) =>
                                    event.currentTarget.select()
                                }
                                className="h-16 w-20 rounded-xl bg-[#A3B18A]/15 text-center text-3xl font-semibold tracking-tight text-[#2F4A33] outline-none transition-colors focus:bg-[#A3B18A]/25 focus:ring-2 focus:ring-[#588157]/20"
                                aria-label="Minutos"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    changeMinutes(
                                        'down',
                                    )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#588157] transition-colors hover:bg-[#DAD7CD]"
                                aria-label="Diminuir minutos"
                            >
                                <ChevronDown
                                    size={18}
                                />
                            </button>

                            <span className="mt-1 text-xs text-[#A3B18A]">
                                minutos
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between rounded-xl bg-[#FAF9F6] px-4 py-3">
                        <span className="text-sm text-[#588157]">
                            Total
                        </span>

                        <span className="text-base font-semibold text-[#2F4A33]">
                            {formatTime(
                                hours,
                                minutes,
                            )}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#588157] py-3 text-sm font-medium text-white transition-colors hover:bg-[#2F4A33]"
                    >
                        <Check size={17} />
                        Confirmar horário
                    </button>
                </div>
            )}
        </div>
    )
}