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
            times: [
                '08:02',
                '11:23',
                '12:53',
                '18:42',
            ],
        })
    })

    it('deve aceitar uma jornada com dois registros', () => {
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

        expect(buildWorkday(proofs)).toEqual({
            date: '2026-09-29',
            times: [
                '08:02',
                '11:23',
            ],
        })
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