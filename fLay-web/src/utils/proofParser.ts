export interface ParsedProof {
    date: string
    time: string
}

function isValidDate(
    day: number,
    month: number,
    year: number,
): boolean {
    const date = new Date(year, month - 1, day)

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    )
}

export function parseProof(text: string): ParsedProof {
    const dateMatch = text.match(
        /DATA:\s*(\d{2}\/\d{2}\/\d{4})/,
    )

    const timeMatch = text.match(
        /HORA:\s*(\d{2}:\d{2})/,
    )

    if (!dateMatch || !timeMatch) {
        throw new Error(
            'Não foi possível encontrar DATA e HORA no comprovante.',
        )
    }

    const [, date] = dateMatch
    const [, time] = timeMatch

    if (!date || !time) {
        throw new Error(
            'Data ou horário inválido no comprovante.',
        )
    }

    const [day, month, year] =
        date.split('/').map(Number)

    const [hours, minutes] =
        time.split(':').map(Number)

    if (
        !day ||
        !month ||
        !year ||
        !isValidDate(day, month, year)
    ) {
        throw new Error(
            `Data inválida no comprovante: "${date}".`,
        )
    }

    if (
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
    ) {
        throw new Error(
            `Horário inválido no comprovante: "${time}".`,
        )
    }

    return {
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        time,
    }
}