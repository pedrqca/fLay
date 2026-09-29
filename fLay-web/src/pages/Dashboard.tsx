import {
    CalendarDays,
    Clock3,
    TrendingUp,
} from 'lucide-react'

import { StatCard } from '../components/dashboard/StatCard'
import { RecentProofs } from '../components/dashboard/RecentProofs'

import {
    calculateWeek,
} from '../utils/workdayCalculator'

import {
    calculateBankBalance,
    createBankTransactionsFromWeek,
} from '../utils/bankCalculator'

import { formatMinutes } from '../utils/timeFormatter'

import {
    currentWeek,
    compensationTransaction,
} from '../data/mockData'

export function Dashboard() {

    const weekResult = calculateWeek(
        currentWeek,
    )

    console.log(
        'Resultado da semana:',
        weekResult,
    )

    const weeklyTransactions =
        createBankTransactionsFromWeek(
            weekResult,
        )

    console.log(
        'Transações geradas por dia:',
        weeklyTransactions,
    )

    const bankTransactions = [
        ...weeklyTransactions,
        compensationTransaction,
    ]

    console.log(
        'Transações do banco:',
        bankTransactions,
    )

    const bankResult = calculateBankBalance(
        bankTransactions,
    )

    console.log(
        'Resultado do banco:',
        bankResult,
    )

    console.log(
        'Saldo formatado:',
        formatMinutes(
            bankResult.balanceMinutes,
        ),
    )

    return (
        <main className="min-h-screen flex-1 bg-[#FAF9F6] px-10 py-8">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <p className="mb-2 text-base font-medium text-[#A3B18A]">
                        Visão geral
                    </p>

                    <h1 className="text-4xl font-semibold tracking-tight text-[#2F4A33]">
                        Olá, Layane 👋
                    </h1>

                    <p className="mt-3 text-base text-[#588157]">
                        Acompanhe suas horas trabalhadas e seu banco de horas.
                    </p>
                </header>

                <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        title="Horas trabalhadas"
                        value="36h 42min"
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
                        value="18 dias"
                        description="Este mês"
                        icon={CalendarDays}
                    />
                </section>

                <RecentProofs />
            </div>
        </main>
    )
}