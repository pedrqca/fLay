import {
    CalendarDays,
    Clock3,
    Gift,
    History,
} from 'lucide-react'
import {
    useMemo,
} from 'react'

import type { DashboardData } from '../hooks/useDashboard'
import {
    formatDate,
} from '../utils/date'
import {
    calculateWeeklyHistory,
} from '../utils/weeklyHistory'
import {
    formatMinutes,
    formatMinutesLong,
} from '../utils/time'

export function WeeklyHistory({
    workdays,
    bankTransactions,
    error,
    isLoading,
}: DashboardData) {

    const weeklyHistory = useMemo(
        () =>
            calculateWeeklyHistory(
                workdays,
                bankTransactions,
            ),
            [
                workdays,
                bankTransactions,
            ],
    )

    return (
        <main className="min-h-screen flex-1 bg-[#FAF9F6] px-5 pb-8 pt-28 sm:px-6 md:px-10 md:py-8">
            <div className="mx-auto max-w-5xl">
                <header className="mb-7 md:mb-8">
                    <p className="mb-2 text-sm font-medium text-[#A3B18A] md:text-base">
                        Histórico
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-[#2F4A33] sm:text-4xl">
                        Histórico Semanal
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#588157]">
                        Consulte suas horas trabalhadas, esperadas e compensações por semana.
                    </p>
                </header>

                {error && (
                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                        {error}
                    </div>
                )}

                {isLoading && (
                    <div className="rounded-2xl border border-[#A3B18A]/30 bg-white p-8 text-center text-[#588157]">
                        Carregando histórico semanal...
                    </div>
                )}

                {!isLoading &&
                    !error &&
                    weeklyHistory.length === 0 && (
                        <div className="rounded-2xl border border-[#A3B18A]/30 bg-white p-8 text-center">
                            <History
                                className="mx-auto mb-3 text-[#A3B18A]"
                                size={32}
                            />

                            <p className="font-medium text-[#2F4A33]">
                                Nenhuma semana registrada
                            </p>

                            <p className="mt-1 text-sm text-[#588157]">
                                Suas jornadas aparecerão aqui quando forem registradas.
                            </p>
                        </div>
                    )}

                {!isLoading &&
                    !error &&
                    weeklyHistory.length > 0 && (
                        <section className="grid gap-4 md:grid-cols-2">
                            {weeklyHistory.map(
                                (week) => {
                                    const hasCompensations =
                                        week.compensations.length > 0
                                    const isPositive =
                                        week.balanceMinutes >= 0

                                    return (
                                        <article
                                            key={week.weekStart}
                                            className="rounded-2xl border border-[#A3B18A]/30 bg-white p-5 sm:p-6"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 text-[#2F4A33]">
                                                        <CalendarDays
                                                            size={19}
                                                            className="text-[#588157]"
                                                        />

                                                        <h2 className="font-semibold">
                                                            {formatDate(week.weekStart)}
                                                            {' - '}
                                                            {formatDate(week.weekEnd)}
                                                        </h2>
                                                    </div>

                                                    <p className="mt-1 text-sm text-[#A3B18A]">
                                                        Segunda a domingo
                                                    </p>
                                                </div>

                                                {hasCompensations && (
                                                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#A3B18A]/20 px-2.5 py-1 text-xs font-medium text-[#588157]">
                                                        <Gift size={14} />
                                                        Compensação
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                                <div className="rounded-xl bg-[#FAF9F6] p-4">
                                                    <div className="flex items-center gap-2 text-sm text-[#588157]">
                                                        <Clock3 size={16} />
                                                        Esperadas
                                                    </div>

                                                    <p className="mt-2 text-xl font-semibold text-[#2F4A33]">
                                                        {formatMinutesLong(
                                                            week.totalExpectedMinutes,
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl bg-[#FAF9F6] p-4">
                                                    <div className="flex items-center gap-2 text-sm text-[#588157]">
                                                        <Clock3 size={16} />
                                                        Realizadas
                                                    </div>

                                                    <p className="mt-2 text-xl font-semibold text-[#2F4A33]">
                                                        {formatMinutesLong(
                                                            week.totalWorkedMinutes,
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between border-t border-[#A3B18A]/20 pt-4">
                                                <span className="text-sm font-medium text-[#588157]">
                                                    Saldo
                                                </span>

                                                <span
                                                    className={`font-semibold ${isPositive
                                                        ? 'text-[#588157]'
                                                        : 'text-red-600'
                                                        }`}
                                                >
                                                    {formatMinutes(
                                                        week.balanceMinutes,
                                                    )}
                                                </span>
                                            </div>
                                        </article>
                                    )
                                },
                            )}
                        </section>
                    )}
            </div>
        </main>
    )
}
