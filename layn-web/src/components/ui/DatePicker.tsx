import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface DatePickerProps {
    value: string
    onChange: (date: string) => void
    placeholder?: string
}

const weekDays = [
    'D',
    'S',
    'T',
    'Q',
    'Q',
    'S',
    'S',
]

const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
]

function formatDateForDisplay(date: string): string {
    if (!date) {
        return ''
    }

    const [year, month, day] = date.split('-')

    return `${day}/${month}/${year}`
}

function formatDateToInput(date: Date): string {
    const year = date.getFullYear()
    const month = String(
        date.getMonth() + 1,
    ).padStart(2, '0')
    const day = String(
        date.getDate(),
    ).padStart(2, '0')

    return `${year}-${month}-${day}`
}

function isSameDay(
    first: Date,
    second: Date,
): boolean {
    return (
        first.getFullYear() === second.getFullYear() &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate()
    )
}

export function DatePicker({
    value,
    onChange,
    placeholder = 'Selecione uma data',
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false)

    const [currentMonth, setCurrentMonth] =
        useState(() => {
            if (value) {
                const [year, month] =
                    value.split('-').map(Number)

                return new Date(
                    year,
                    month - 1,
                    1,
                )
            }

            const today = new Date()

            return new Date(
                today.getFullYear(),
                today.getMonth(),
                1,
            )
        })

    const containerRef =
        useRef<HTMLDivElement>(null)

    const selectedDate = value
        ? new Date(`${value}T00:00:00`)
        : null

    const today = new Date()

    const firstDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1,
    )

    const lastDayOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0,
    )

    const daysInMonth =
        lastDayOfMonth.getDate()

    const firstWeekday =
        firstDayOfMonth.getDay()

    const calendarDays: Array<
        Date | null
    > = []

    for (
        let index = 0;
        index < firstWeekday;
        index += 1
    ) {
        calendarDays.push(null)
    }

    for (
        let day = 1;
        day <= daysInMonth;
        day += 1
    ) {
        calendarDays.push(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                day,
            ),
        )
    }

    function goToPreviousMonth() {
        setCurrentMonth(
            (month) =>
                new Date(
                    month.getFullYear(),
                    month.getMonth() - 1,
                    1,
                ),
        )
    }

    function goToNextMonth() {
        setCurrentMonth(
            (month) =>
                new Date(
                    month.getFullYear(),
                    month.getMonth() + 1,
                    1,
                ),
        )
    }

    function handleDateSelect(
        date: Date,
    ) {
        onChange(
            formatDateToInput(date),
        )

        setIsOpen(false)
    }

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
                className={`flex w-full items-center justify-between rounded-xl border bg-[#F8FAFC] px-4 py-3 text-sm outline-none transition-colors focus:ring-4 focus:ring-indigo-500/10 ${isOpen
                        ? 'border-[#6366F1]'
                        : 'border-[#CBD5E1]'
                    }`}
            >
                <span
                    className={
                        value
                            ? 'text-[#0F172A]'
                            : 'text-slate-500'
                    }
                >
                    {value
                        ? formatDateForDisplay(
                            value,
                        )
                        : placeholder}
                </span>

                <CalendarDays
                    size={18}
                    className="text-[#0F172A]"
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[300px] rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={
                                goToPreviousMonth
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#0F172A] transition-colors hover:bg-[#EEF2FF]"
                            aria-label="Mês anterior"
                        >
                            <ChevronLeft
                                size={18}
                            />
                        </button>

                        <div className="text-center">
                            <p className="text-sm font-semibold text-[#0F172A]">
                                {
                                    monthNames[
                                    currentMonth.getMonth()
                                    ]
                                }
                            </p>

                            <p className="text-xs text-slate-500">
                                {currentMonth.getFullYear()}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={
                                goToNextMonth
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#0F172A] transition-colors hover:bg-[#EEF2FF]"
                            aria-label="Próximo mês"
                        >
                            <ChevronRight
                                size={18}
                            />
                        </button>
                    </div>

                    <div className="mb-2 grid grid-cols-7">
                        {weekDays.map(
                            (day, index) => (
                                <div
                                    key={`${day}-${index}`}
                                    className="flex h-9 items-center justify-center text-xs font-semibold text-slate-500"
                                >
                                    {day}
                                </div>
                            ),
                        )}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map(
                            (date, index) => {
                                if (!date) {
                                    return (
                                        <div
                                            key={`empty-${index}`}
                                            className="h-9"
                                        />
                                    )
                                }

                                const isSelected =
                                    selectedDate
                                        ? isSameDay(
                                            date,
                                            selectedDate,
                                        )
                                        : false

                                const isToday =
                                    isSameDay(
                                        date,
                                        today,
                                    )

                                return (
                                    <button
                                        key={date.toISOString()}
                                        type="button"
                                        onClick={() =>
                                            handleDateSelect(
                                                date,
                                            )
                                        }
                                        className={`flex h-9 items-center justify-center rounded-lg text-sm transition-colors ${isSelected
                                                ? 'bg-[#6366F1] font-semibold text-white'
                                                : isToday
                                                    ? 'bg-[#EEF2FF] font-semibold text-[#4F46E5]'
                                                    : 'text-[#0F172A] hover:bg-[#EEF2FF]'
                                            }`}
                                    >
                                        {date.getDate()}
                                    </button>
                                )
                            },
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            const todayDate =
                                new Date()

                            setCurrentMonth(
                                new Date(
                                    todayDate.getFullYear(),
                                    todayDate.getMonth(),
                                    1,
                                ),
                            )

                            handleDateSelect(
                                todayDate,
                            )
                        }}
                        className="mt-4 w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 text-sm font-medium text-[#475569] transition-colors hover:bg-[#EEF2FF] hover:text-[#4F46E5]"
                    >
                        Hoje
                    </button>
                </div>
            )}
        </div>
    )
}