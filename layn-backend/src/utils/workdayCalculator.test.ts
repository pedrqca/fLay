import { describe, expect, it } from 'vitest'
import {
    calculateWorkday,
    parseTimeToMinutes,
} from './workdayCalculator.js'

describe('cálculo de jornada', () => {
    it('converte horários válidos para minutos', () => {
        expect(parseTimeToMinutes('08:00')).toBe(480)
        expect(parseTimeToMinutes('12:30')).toBe(750)
        expect(parseTimeToMinutes('18:00')).toBe(1080)
    })

    it.each([
        '25:00',
        '30:00',
        '12:75',
        'abc',
    ])('rejeita o horário inválido %s', (time) => {
        expect(() => parseTimeToMinutes(time)).toThrow(
            'Horário inválido',
        )
    })

    it('retorna zero para uma jornada vazia', () => {
        expect(
            calculateWorkday({
                times: [],
                expectedMinutes: 480,
            }),
        ).toMatchObject({
            workedMinutes: 0,
            balanceMinutes: -480,
        })
    })

    it('rejeita uma jornada incompleta', () => {
        expect(() =>
            calculateWorkday({
                times: [
                    '08:00',
                    '12:00',
                    '13:00',
                ],
                expectedMinutes: 480,
            }),
        ).toThrow(
            'quantidade par de horários',
        )
    })

    it('rejeita saída anterior à entrada', () => {
        expect(() =>
            calculateWorkday({
                times: [
                    '13:00',
                    '12:00',
                ],
                expectedMinutes: 0,
            }),
        ).toThrow(
            'não pode ser anterior',
        )
    })

    it('calcula uma jornada simples', () => {
        expect(
            calculateWorkday({
                times: [
                    '08:00',
                    '18:00',
                ],
                expectedMinutes: 480,
            }),
        ).toMatchObject({
            workedMinutes: 600,
        })
    })

    it('calcula uma jornada normal com almoço', () => {
        expect(
            calculateWorkday({
                times: [
                    '08:00',
                    '12:00',
                    '13:00',
                    '18:00',
                ],
                expectedMinutes: 480,
            }),
        ).toMatchObject({
            lunchMinutes: 60,
            workedMinutes: 540,
        })
    })

    it('calcula múltiplos intervalos', () => {
        expect(
            calculateWorkday({
                times: [
                    '08:00',
                    '10:00',
                    '10:30',
                    '12:00',
                    '13:00',
                    '18:00',
                ],
                expectedMinutes: 480,
            }),
        ).toMatchObject({
            workedMinutes: 510,
        })
    })

    it('calcula uma jornada válida de sábado', () => {
        expect(
            calculateWorkday({
                times: [
                    '08:00',
                    '12:00',
                ],
                expectedMinutes: 240,
            }),
        ).toMatchObject({
            workedMinutes: 240,
            balanceMinutes: 0,
        })
    })
})
