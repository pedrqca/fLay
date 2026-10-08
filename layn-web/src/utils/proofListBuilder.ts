import type { BankTransaction } from '../types/bankTransaction'
import type { Workday } from '../types/workday'

import { getDateKey, parseCivilDate } from './date'
import { calculateWorkdayBalance } from './workdayCalculator'

export interface ProofListItem {
    id: string
    date: string
    type:
    | 'WORKDAY'
    | 'COMPENSATION'
    workdayId?: number
    transactionId?: number
    title: string
    description: string
    times?: string[]
    minutes?: number
    transactionType?:
    | 'EXTRA'
    | 'COMPENSATION'
}

export function buildProofList(
    workdays: Workday[],
    transactions: BankTransaction[],
): ProofListItem[] {
    const workdayItems =
        workdays.map(
            (workday) => {
                const date =
                    getDateKey(
                        workday.date,
                    )

                const times =
                    workday.timeEntries.map(
                        (entry) =>
                            entry.time,
                    )

                const balance =
                    calculateWorkdayBalance(
                        date,
                        times,
                    )

                const transaction =
                    transactions.find(
                        (item) =>
                            item.workdayId ===
                            workday.id,
                    )

                return {
                    id: `workday - ${ workday.id } `,
                    date,
                    type: 'WORKDAY' as const,
                    workdayId:
                        workday.id,
                    transactionId:
                        transaction?.id,
                    title:
                        'Jornada registrada',
                    description:
                        transaction?.description ??
                        'Registro de ponto',
                    times,
                    minutes:
                        balance,
                    transactionType:
                        transaction?.type,
                }
            },
        )

    const compensationItems =
        transactions
            .filter(
                (
                    transaction,
                ) =>
                    transaction.workdayId ===
                    null &&
                    transaction.type ===
                    'COMPENSATION',
            )
            .map(
                (
                    transaction,
                ) => ({
                    id: `compensation - ${ transaction.id } `,
                    date: getDateKey(
                        transaction.date,
                    ),
                    type:
                        'COMPENSATION' as const,
                    transactionId:
                        transaction.id,
                    title:
                        'Compensação',
                    description:
                        transaction.description,
                    minutes:
                        transaction.minutes,
                    transactionType:
                        'COMPENSATION' as const,
                }),
            )

    return [
        ...workdayItems,
        ...compensationItems,
    ].sort(
        (a, b) =>
            parseCivilDate(
                b.date,
            ).getTime() -
            parseCivilDate(
                a.date,
            ).getTime(),
    )
}
