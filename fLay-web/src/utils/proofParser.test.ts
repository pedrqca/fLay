import { describe, expect, it } from 'vitest'
import { parseProof } from './proofParser'

describe('parseProof', () => {
    it('deve extrair data e hora de um comprovante', () => {
        const proof = `
            COMPROVANTE DE REGISTRO DE PONTO DO TRABALHADOR
            EMPREGADOR: HOSPITAL
            NOME: Layane
            DATA: 29/09/2026 HORA: 12:53
        `

        const result = parseProof(proof)

        expect(result).toEqual({
            date: '2026-09-29',
            time: '12:53',
        })
    })

    it('deve aceitar DATA e HORA em linhas diferentes', () => {
        const proof = `
            DATA: 29/09/2026
            HORA: 18:42
        `

        const result = parseProof(proof)

        expect(result).toEqual({
            date: '2026-09-29',
            time: '18:42',
        })
    })

    it('deve rejeitar uma data inexistente', () => {
        const proof =
            'DATA: 31/02/2026 HORA: 12:53'

        expect(() => parseProof(proof)).toThrow(
            'Data inválida',
        )
    })

    it('deve rejeitar um horário inválido', () => {
        const proof =
            'DATA: 29/09/2026 HORA: 25:70'

        expect(() => parseProof(proof)).toThrow(
            'Horário inválido',
        )
    })

    it('deve rejeitar comprovante sem DATA ou HORA', () => {
        const proof =
            'COMPROVANTE DE REGISTRO DE PONTO'

        expect(() => parseProof(proof)).toThrow(
            'Não foi possível encontrar DATA e HORA',
        )
    })
    it('deve extrair data e hora do comprovante real', () => {
        const proof = `
        COMPROVANTE DE REGISTRO DE PONTO DO TRABALHADOR
            EMPREGADOR: HOSPITAL
            NOME: Layane
            DATA: 29/09/2026 HORA: 18:42
    `

        const result = parseProof(proof)

        expect(result).toEqual({
            date: '2026-09-29',
            time: '18:42',
        })
    })
})