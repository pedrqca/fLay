import { describe, expect, it } from 'vitest'
import { parseProofs } from './proofParser.js'
import { buildWorkday } from './workdayBuilder.js'
import {
    calculateWorkday,
    getExpectedMinutes,
} from './workdayCalculator.js'
import {
    createBankTransaction,
    calculateBankBalance,
} from './bankCalculator.js'

describe('fluxo completo do banco de horas', () => {
    it('deve registrar horas extras no banco', () => {
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

        const parsedProofs = parseProofs(proofs)

        const workday = buildWorkday(parsedProofs)

        const workdayResult = calculateWorkday({
            ...workday,
            expectedMinutes: getExpectedMinutes(
                workday.date,
            ),
        })

        const transaction = createBankTransaction(
            workday.date,
            workdayResult.balanceMinutes,
        )

        expect(transaction).toEqual({
            date: '2026-09-29',
            type: 'EXTRA',
            minutes: 70,
            description: 'Horas extras',
        })

        const balance = calculateBankBalance(
            transaction ? [transaction] : [],
        )

        expect(balance).toEqual({
            totalCredits: 70,
            totalDebits: 0,
            balanceMinutes: 70,
        })
    })

    it('deve registrar débito quando o dia tiver saldo negativo', () => {
        const proofs = [
            `
                DATA: 29/09/2026
                HORA: 08:00
            `,
            `
                DATA: 29/09/2026
                HORA: 12:00
            `,
            `
                DATA: 29/09/2026
                HORA: 13:30
            `,
            `
                DATA: 29/09/2026
                HORA: 17:00
            `,
        ]

        const parsedProofs = parseProofs(proofs)

        const workday = buildWorkday(parsedProofs)

        const workdayResult = calculateWorkday({
            ...workday,
            expectedMinutes: getExpectedMinutes(
                workday.date,
            ),
        })

        const transaction = createBankTransaction(
            workday.date,
            workdayResult.balanceMinutes,
        )

        expect(transaction).toEqual({
            date: '2026-09-29',
            type: 'COMPENSATION',
            minutes: 30,
            description: 'Débito de horas',
        })

        const balance = calculateBankBalance(
            transaction ? [transaction] : [],
        )

        expect(balance).toEqual({
            totalCredits: 0,
            totalDebits: 30,
            balanceMinutes: -30,
        })
    })

    it('deve calcular créditos e débitos acumulados', () => {
        const transactions = [
            {
                date: '2026-09-29',
                type: 'EXTRA' as const,
                minutes: 330,
                description: 'Horas extras',
            },
            {
                date: '2026-10-03',
                type: 'COMPENSATION' as const,
                minutes: 240,
                description: 'Sábado compensado',
            },
        ]

        const balance = calculateBankBalance(
            transactions,
        )

        expect(balance).toEqual({
            totalCredits: 330,
            totalDebits: 240,
            balanceMinutes: 90,
        })
    })
})