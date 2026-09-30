export interface ParsedProof {
    date: string
    time: string
}

function isValidDate(
    day: number,
    month: number,
    year: number,
): boolean {
    const date = new Date(
        year,
        month - 1,
        day,
    )

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    )
}

export function parseProof(
    text: string,
): ParsedProof {
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

    const dateParts = date.split('/')
    const timeParts = time.split(':')

    const dayString = dateParts[0]
    const monthString = dateParts[1]
    const yearString = dateParts[2]

    const hoursString = timeParts[0]
    const minutesString = timeParts[1]

    if (
        !dayString ||
        !monthString ||
        !yearString ||
        !hoursString ||
        !minutesString
    ) {
        throw new Error(
            'Data ou horário inválido no comprovante.',
        )
    }

    const day = Number(dayString)
    const month = Number(monthString)
    const year = Number(yearString)

    const hours = Number(hoursString)
    const minutes = Number(minutesString)

    if (
        !Number.isInteger(day) ||
        !Number.isInteger(month) ||
        !Number.isInteger(year) ||
        !isValidDate(day, month, year)
    ) {
        throw new Error(
            `Data inválida no comprovante: "${date}".`,
        )
    }

    if (
        !Number.isInteger(hours) ||
        !Number.isInteger(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
    ) {
        throw new Error(
            `Horário inválido no comprovante: "${time}".`,
        )
    }

    const normalizedDate = [
        year,
        String(month).padStart(2, '0'),
        String(day).padStart(2, '0'),
    ].join('-')

    return {
        date: normalizedDate,
        time,
    }
}

export function parseProofs(
    texts: string[],
): ParsedProof[] {
    return texts.map((text) => parseProof(text))
}