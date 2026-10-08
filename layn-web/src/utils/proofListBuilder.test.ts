import { describe, expect, it } from 'vitest'
import type { BankTransaction } from '../types/bankTransaction'
import type { Workday } from '../types/workday'
import { buildProofList } from './proofListBuilder'

const workday = (
    id: number,
    date: string,
    times: string[],
): Workday => ({
    id,
    userId: 1,
    date,
    createdAt: date,
    timeEntries: times.map(
        (time, index) => ({
            id: index + 1,
            workdayId: id,
            time,
            createdAt: date,
        }),
    ),
})

const transaction = (
    id: number,
    date: string,
    minutes: number,
    workdayId: number | null = null,
): BankTransaction => ({
    id,
    userId: 1,
    workdayId,
    date,
    type: 'COMPENSATION',
    minutes,
    description: 'Compensação',
    createdAt: date,
})

describe('buildProofList', () => {
    it('retorna uma lista vazia sem dados', () => {
        expect(buildProofList([], [])).toEqual([])
    })

    it('transforma um workday sem transação', () => {
        const [item] = buildProofList(
            [
                workday(
                    1,
                    '2026-10-05',
                    ['08:00', '17:00'],
                ),
            ],
            [],
        )

        expect(item).toMatchObject({
            type: 'WORKDAY',
            workdayId: 1,
            transactionId: undefined,
            minutes: 60,
        })
    })

    it('associa uma transação ao workday', () => {
        const [item] = buildProofList(
            [
                workday(
                    1,
                    '2026-10-05',
                    ['08:00', '17:00'],
                ),
            ],
            [
                transaction(
                    2,
                    '2026-10-05',
                    60,
                    1,
                ),
            ],
        )

        expect(item).toMatchObject({
            workdayId: 1,
            transactionId: 2,
            description: 'Compensação',
        })
    })

    it('adiciona uma compensação independente', () => {
        const [item] = buildProofList(
            [],
            [
                transaction(
                    2,
                    '2026-10-05',
                    120,
                ),
            ],
        )

        expect(item).toMatchObject({
            type: 'COMPENSATION',
            transactionId: 2,
            minutes: 120,
        })
    })

    it('combina workdays e compensações', () => {
        expect(
            buildProofList(
                [
                    workday(
                        1,
                        '2026-10-05',
                        ['08:00', '17:00'],
                    ),
                ],
                [
                    transaction(
                        2,
                        '2026-10-06',
                        60,
                    ),
                ],
            ),
        ).toHaveLength(2)
    })

    it('ordena por data decrescente', () => {
        const items = buildProofList(
            [
                workday(
                    1,
                    '2026-10-05',
                    ['08:00', '17:00'],
                ),
            ],
            [
                transaction(
                    2,
                    '2026-10-07',
                    60,
                ),
            ],
        )

        expect(items.map((item) => item.date)).toEqual([
            '2026-10-07',
            '2026-10-05',
        ])
    })

    it('calcula saldo positivo, negativo e zero', () => {
        const items = buildProofList(
            [
                workday(
                    1,
                    '2026-10-05',
                    ['08:00', '17:00'],
                ),
                workday(
                    2,
                    '2026-10-06',
                    ['08:00', '15:00'],
                ),
                workday(
                    3,
                    '2026-10-07',
                    ['08:00', '16:00'],
                ),
            ],
            [],
        )

        expect(items.map((item) => item.minutes)).toEqual([
            0,
            -60,
            60,
        ])
    })
})
