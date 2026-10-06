import { describe, expect, it } from 'vitest'
import { parseProofs } from '../utils/proofParser.js'
import {
    getExpectedMinutes,
} from '../utils/workdayCalculator.js'
import { processWorkday } from './workdayService.js'

describe('workdayService', () => {
    it('deve calcular a carga esperada por dia da semana em UTC', () => {
        expect(
            getExpectedMinutes('2026-09-29'),
        ).toBe(480)

        expect(
            getExpectedMinutes('2026-10-03'),
        ).toBe(240)

        expect(
            getExpectedMinutes('2026-10-04'),
        ).toBe(0)
    })

    it('deve processar uma jornada completa', () => {
        const proofs = [
            `
                DATA: 29/09/2026
                HORA: 18:42
            `,
            `
                DATA: 29/09/2026
                HORA: 08:02
            `,
            `
                DATA: 29/09/2026
                HORA: 12:53
            `,
            `
                DATA: 29/09/2026
                HORA: 11:23
            `,
        ]

        const parsedProofs =
            parseProofs(proofs)

        const result = processWorkday(
            parsedProofs,
        )

        expect(result.workday).toEqual({
            date: '2026-09-29',
            times: [
                '08:02',
                '11:23',
                '12:53',
                '18:42',
            ],
        })

        expect(result.calculation).toEqual({
            lunchMinutes: 90,
            workedMinutes: 550,
            expectedMinutes: 480,
            balanceMinutes: 70,
        })

        expect(result.bankTransaction).toEqual({
            date: '2026-09-29',
            type: 'EXTRA',
            minutes: 70,
            description: 'Horas extras',
        })
    })
})