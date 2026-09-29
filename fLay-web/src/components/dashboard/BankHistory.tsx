import {
    ArrowDownLeft,
    ArrowUpRight,
} from 'lucide-react'

import type { BankTransaction } from '../../utils/bankCalculator'
import { formatMinutes } from '../../utils/timeFormatter'

interface BankHistoryProps {
    transactions: BankTransaction[]
}

function formatDateForDisplay(date: string): string {
    if (date.includes('/')) {
        return date
    }

    const [year, month, day] = date.split('-')

    return `${day}/${month}/${year}`
}

export function BankHistory({
    transactions,
}: BankHistoryProps) {
    return (
        <section className="mt-8">
            <div className="mb-4">
                <h2 className="text-xl font-semibold tracking-tight text-[#2F4A33]">
                    Histórico do banco de horas
                </h2>

                <p className="mt-1 text-sm text-[#588157]">
                    Acompanhe suas horas extras e compensações.
                </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#A3B18A]/30 bg-white">
                {transactions.map((transaction) => {
                    const isExtra =
                        transaction.type === 'EXTRA'

                    return (
                        <article
                            key={`${transaction.date}-${transaction.type}-${transaction.minutes}`}
                            className={`flex items-center justify-between gap-4 border-b px-4 py-4 last:border-b-0 sm:px-6 sm:py-5 ${isExtra
                                    ? 'border-[#A3B18A]/20 bg-white'
                                    : 'border-[#D8CFBF] bg-[#F1EDE4]'
                                }`}
                        >
                            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${isExtra
                                            ? 'bg-[#A3B18A]/20 text-[#588157]'
                                            : 'bg-[#DED5C5] text-[#6B5E4A]'
                                        }`}
                                >
                                    {isExtra ? (
                                        <ArrowUpRight
                                            size={20}
                                        />
                                    ) : (
                                        <ArrowDownLeft
                                            size={20}
                                        />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p
                                        className={`truncate text-sm font-semibold ${isExtra
                                                ? 'text-[#2F4A33]'
                                                : 'text-[#5C5040]'
                                            }`}
                                    >
                                        {
                                            transaction.description
                                        }
                                    </p>

                                    <p
                                        className={`mt-1 text-sm ${isExtra
                                                ? 'text-[#588157]'
                                                : 'text-[#7A6F5D]'
                                            }`}
                                    >
                                        {formatDateForDisplay(
                                            transaction.date,
                                        )}
                                    </p>
                                </div>
                            </div>

                            <p
                                className={`shrink-0 text-sm font-semibold ${isExtra
                                        ? 'text-[#588157]'
                                        : 'text-[#6B5E4A]'
                                    }`}
                            >
                                {isExtra
                                    ? '+'
                                    : '-'}
                                {formatMinutes(
                                    transaction.minutes,
                                ).replace(
                                    '+',
                                    '',
                                )}
                            </p>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}