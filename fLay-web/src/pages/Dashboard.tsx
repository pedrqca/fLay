import {
    CalendarDays,
    Clock3,
    TrendingUp,
} from 'lucide-react'
import { useState } from 'react'

import { StatCard } from '../components/dashboard/StatCard'
import { RecentProofs } from '../components/dashboard/RecentProofs'
import { BankHistory } from '../components/dashboard/BankHistory'

import {
    createCompensationTransaction,
} from '../utils/bankTransactionFactory'

import {
    calculateWeek,
} from '../utils/workdayCalculator'

import {
    calculateBankBalance,
    createBankTransactionsFromWeek,
    type BankTransaction,
} from '../utils/bankCalculator'

import { formatMinutes } from '../utils/timeFormatter'

import {
    currentWeek,
} from '../data/mockData'

import type { CompensationData } from '../components/dashboard/CompensationModal'

export function Dashboard() {
    const [
        compensationTransactions,
        setCompensationTransactions,
    ] = useState<BankTransaction[]>([])

    const weekResult = calculateWeek(
        currentWeek,
    )

    const weeklyTransactions =
        createBankTransactionsFromWeek(
            weekResult,
        )

    const bankTransactions = [
        ...weeklyTransactions,
        ...compensationTransactions,
    ]

    const bankResult = calculateBankBalance(
        bankTransactions,
    )

    const proofs = currentWeek.map((day) => ({
        date: day.date,
        entry: day.entry,
        exit: day.exit,
    }))

    function handleCompensationSubmit(
        data: CompensationData,
    ) {
        const transaction =
            createCompensationTransaction(data)

        setCompensationTransactions(
            (currentTransactions) => [
                ...currentTransactions,
                transaction,
            ],
        )
    }

    return (
        <main className="min-h-screen flex-1 bg-[#FAF9F6] px-5 pb-8 pt-28 sm:px-6 md:px-10 md:py-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-7 md:mb-8">
                    <p className="mb-2 text-sm font-medium text-[#A3B18A] md:text-base">
                        Visão geral
                    </p>

                    <h1 className="text-3xl font-semibold tracking-tight text-[#2F4A33] sm:text-4xl">
                        Olá, Layane 👋
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#588157] md:text-base">
                        Acompanhe suas horas trabalhadas e seu banco de horas.
                    </p>
                </header>

                <section className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
                    <StatCard
                        title="Horas trabalhadas"
                        value={formatMinutes(
                            weekResult.totalWorkedMinutes,
                        )}
                        description="Esta semana"
                        icon={Clock3}
                    />

                    <StatCard
                        title="Banco de horas"
                        value={formatMinutes(
                            bankResult.balanceMinutes,
                        )}
                        description="Saldo atual"
                        icon={TrendingUp}
                    />

                    <StatCard
                        title="Dias trabalhados"
                        value={`${weekResult.days.length} dias`}
                        description="Esta semana"
                        icon={CalendarDays}
                    />
                </section>

                <RecentProofs
                    proofs={proofs}
                    onCompensationSubmit={
                        handleCompensationSubmit
                    }
                />

                <BankHistory
                    transactions={
                        bankTransactions
                    }
                />
            </div>
        </main>
    )
}