import { describe, expect, it } from 'vitest'
import { parseProofs } from './proofParser.js'
import { buildWorkday } from './workdayBuilder.js'
import { calculateWorkday } from './workdayCalculator.js'

describe('fluxo completo da jornada', () => {
    it('deve processar os comprovantes e calcular o saldo do dia', () => {
        const proofs = [
            `
                COMPROVANTE DE REGISTRO DE PONTO DO TRABALHADOR
                DATA: 29/09/2026
                HORA: 18:42
            `,
            `
                COMPROVANTE DE REGISTRO DE PONTO DO TRABALHADOR
                DATA: 29/09/2026
                HORA: 08:02
            `,
            `
                COMPROVANTE DE REGISTRO DE PONTO DO TRABALHADOR
                DATA: 29/09/2026
                HORA: 12:53
            `,
            `
                COMPROVANTE DE REGISTRO DE PONTO DO TRABALHADOR
                DATA: 29/09/2026
                HORA: 11:23
            `,
        ]

        const parsedProofs = parseProofs(proofs)

        const workday = buildWorkday(parsedProofs)

        const result = calculateWorkday({
            ...workday,
            expectedMinutes: 8 * 60,
        })

        expect(workday).toEqual({
            date: '2026-09-29',
            entry: '08:02',
            lunchExit: '11:23',
            lunchReturn: '12:53',
            exit: '18:42',
        })

        expect(result).toEqual({
            lunchMinutes: 90,
            workedMinutes: 550,
            expectedMinutes: 480,
            balanceMinutes: 70,
        })
    })
})