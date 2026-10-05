import type {
    BankTransaction,
} from '../types/bankTransaction'

import type {
    Workday,
} from '../types/workday'

import {
    formatDateKey,
    getExpectedMinutes,
    getWeekEnd,
    getWeekStart,
    parseCivilDate,
} from './date'

import {
    calculateWorkdayMinutes,
} from './workdayCalculator'

export interface WeeklySummary {
    weekStart: string
    weekEnd: string
    totalExpectedMinutes: number
    totalWorkedMinutes: number
    balanceMinutes: number
    compensations: BankTransaction[]
}

function getWeekKey(dateString: string): string {
    return formatDateKey(
        getWeekStart(
            parseCivilDate(dateString),
        ),
    )
}

function createSummary(
    dateString: string,
): WeeklySummary {
    const date = parseCivilDate(dateString)
    const weekStart = getWeekStart(date)
    const weekEnd = getWeekEnd(date)
    const cursor = new Date(weekStart)
    let totalExpectedMinutes = 0

    while (
        cursor.getTime() <=
        weekEnd.getTime()
    ) {
        totalExpectedMinutes +=
            getExpectedMinutes(
                formatDateKey(cursor),
            )

        cursor.setUTCDate(
            cursor.getUTCDate() + 1,
        )
    }

    return {
        weekStart: formatDateKey(weekStart),
        weekEnd: formatDateKey(weekEnd),
        totalExpectedMinutes,
        totalWorkedMinutes: 0,
        balanceMinutes: 0,
        compensations: [],
    }
}

export function calculateWeeklyHistory(
    workdays: Workday[],
    transactions: BankTransaction[],
): WeeklySummary[] {
    const summaries = new Map<
        string,
        WeeklySummary
    >()

    for (const workday of workdays) {
        const weekKey = getWeekKey(workday.date)
        const summary =
            summaries.get(weekKey) ??
            createSummary(workday.date)

        summary.totalWorkedMinutes +=
            calculateWorkdayMinutes(
                workday.timeEntries.map(
                    (timeEntry) =>
                        timeEntry.time,
                ),
            )

        summaries.set(weekKey, summary)
    }

    for (const transaction of transactions) {
        const weekKey = getWeekKey(transaction.date)
        const summary =
            summaries.get(weekKey) ??
            createSummary(transaction.date)

        if (
            transaction.type ===
            'COMPENSATION'
        ) {
            summary.compensations.push(
                transaction,
            )
        }

        summaries.set(weekKey, summary)
    }

    return Array.from(
        summaries.values(),
    )
        .map((summary) => ({
            ...summary,
            balanceMinutes:
                summary.totalWorkedMinutes -
                summary.totalExpectedMinutes,
        }))
        .sort(
            (first, second) =>
                parseCivilDate(
                    second.weekStart,
                ).getTime() -
                parseCivilDate(
                    first.weekStart,
                ).getTime(),
        )
}
