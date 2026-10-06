import {
    ArrowDownLeft,
    ArrowUpRight,
    Pencil,
    Trash2,
} from 'lucide-react'

import type {
    BankTransaction,
} from '../../types/bankTransaction'

import {
    formatMinutes,
} from '../../utils/time'

interface BankHistoryProps {
    transactions: BankTransaction[]
    onEdit: (
        transaction: BankTransaction,
    ) => void
    onDelete: (
        transaction: BankTransaction,
    ) => void
}

function formatDateForDisplay(
    date: string,
): string {
    if (date.includes('/')) {
        return date
    }

    const datePart = date.split('T')[0]

    const [year, month, day] =
        datePart.split('-')

    return `${day}/${month}/${year}`
}

export function BankHistory({
    transactions,
    onEdit,
    onDelete,
}: BankHistoryProps) {
    return (
        <section className="mt-8">
            <div className="mb-4">
                <h2 className="text-xl font-semibold tracking-tight text-[#0F172A]">
                    Histórico do banco de horas
                </h2>

                <p className="mt-1 text-sm text-[#0F172A]">
                    Acompanhe suas horas extras e compensações.
                </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
                {transactions.map(
                    (
                        transaction,
                        index,
                    ) => {
                        const isExtra =
                            transaction.type ===
                            'EXTRA'

                        return (
                            <article
                                key={`${transaction.date}-${transaction.type}-${transaction.minutes}-${index}`}
                                className={`flex items-center justify-between gap-3 border-b px-4 py-4 last:border-b-0 sm:gap-4 sm:px-6 sm:py-5 ${isExtra
                                    ? 'border-[#E2E8F0] bg-white'
                                    : 'border-[#E2E8F0] bg-[#F8FAFC]'
                                    }`}
                            >
                                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${isExtra
                                            ? 'bg-green-50 text-[#22C55E]'
                                            : 'bg-[#E2E8F0] text-[#475569]'
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
                                                ? 'text-[#0F172A]'
                                                : 'text-[#0F172A]'
                                                }`}
                                        >
                                            {
                                                transaction.description
                                            }
                                        </p>

                                        <p
                                            className={`mt-1 text-sm ${isExtra
                                                ? 'text-[#64748B]'
                                                : 'text-[#64748B]'
                                                }`}
                                        >
                                            {formatDateForDisplay(
                                                transaction.date,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                                    <p
                                        className={`text-sm font-semibold ${isExtra
                                            ? 'text-[#22C55E]'
                                            : 'text-[#475569]'
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

                                    {!isExtra && (
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit(
                                                        transaction,
                                                    )
                                                }
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#0F172A] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A] sm:h-10 sm:w-10"
                                                aria-label="Editar compensação"
                                                title="Editar compensação"
                                            >
                                                <Pencil
                                                    size={17}
                                                />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(
                                                        transaction,
                                                    )
                                                }
                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#E2E8F0] hover:text-[#0F172A] sm:h-10 sm:w-10"
                                                aria-label="Excluir compensação"
                                                title="Excluir compensação"
                                            >
                                                <Trash2
                                                    size={17}
                                                />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </article>
                        )
                    },
                )}

                {transactions.length ===
                    0 && (
                        <div className="px-6 py-10 text-center">
                            <p className="text-sm text-[#64748B]">
                                Nenhuma movimentação registrada.
                            </p>
                        </div>
                    )}
            </div>
        </section>
    )
}