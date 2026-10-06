import type { BankTransaction } from './bankCalculator.js'

interface CompensationInput {
    date: string
    hours: string
    description: string
}

export function createCompensationTransaction(
    data: CompensationInput,
): BankTransaction {
    const timeParts = data.hours.split(':')

    const hoursString = timeParts[0]
    const minutesString = timeParts[1]

    if (!hoursString || !minutesString) {
        throw new Error(
            `Horário inválido: "${data.hours}". Use o formato HH:mm.`,
        )
    }

    const hours = Number(hoursString)
    const minutes = Number(minutesString)

    if (
        !Number.isInteger(hours) ||
        !Number.isInteger(minutes) ||
        hours < 0 ||
        minutes < 0 ||
        minutes > 59
    ) {
        throw new Error(
            `Horário inválido: "${data.hours}". Use o formato HH:mm.`,
        )
    }

    const totalMinutes =
        hours * 60 + minutes

    return {
        date: data.date,
        type: 'COMPENSATION',
        minutes: totalMinutes,
        description: data.description,
    }
}