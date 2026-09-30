import { describe, expect, it } from 'vitest'
import {
    buildWorkday,
} from './workdayBuilder.js'

describe('buildWorkday', () => {
    it('deve organizar os registros do dia em ordem', () => {
        const proofs = [
            {
                date: '2026-09-29',
                time: '18:42',
            },
            {
                date: '2026-09-29',
                time: '08:02',
            },
            {
                date: '2026-09-29',
                time: '12:53',
            },
            {
                date: '2026-09-29',
                time: '11:23',
            },
        ]

        const result = buildWorkday(proofs)

        expect(result).toEqual({
            date: '2026-09-29',
            entry: '08:02',
            lunchExit: '11:23',
            lunchReturn: '12:53',
            exit: '18:42',
        })
    })

    it('deve rejeitar uma jornada com menos de 4 registros', () => {
        const proofs = [
            {
                date: '2026-09-29',
                time: '08:02',
            },
            {
                date: '2026-09-29',
                time: '11:23',
            },
        ]

        expect(() => buildWorkday(proofs)).toThrow(
            'A jornada deve possuir exatamente 4 registros de ponto.',
        )
    })

    it('deve rejeitar registros de datas diferentes', () => {
        const proofs = [
            {
                date: '2026-09-29',
                time: '08:02',
            },
            {
                date: '2026-09-29',
                time: '11:23',
            },
            {
                date: '2026-09-29',
                time: '12:53',
            },
            {
                date: '2026-09-30',
                time: '18:42',
            },
        ]

        expect(() => buildWorkday(proofs)).toThrow(
            'Os registros devem pertencer à mesma data.',
        )
    })
})