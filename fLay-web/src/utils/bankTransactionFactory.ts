import type { BankTransaction } from './bankCalculator'

interface CompensationInput {
    date: string
    hours: string
    description: string
}

export function createCompensationTransaction(
    data: CompensationInput,
): BankTransaction {
    const [hours, minutes] =
        data.hours.split(':').map(Number)

    const totalMinutes =
        hours * 60 + minutes

    return {
        date: data.date,
        type: 'COMPENSATION',
        minutes: totalMinutes,
        description: data.description,
    }
}