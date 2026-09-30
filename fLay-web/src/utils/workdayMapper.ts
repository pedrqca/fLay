import type { Workday } from '../api/workdays'

import type {
    Weekday,
} from '../../../fLay-backend/src/utils/workdayCalculator'

function formatDate(
    dateString: string,
): string {
    const date = new Date(dateString)

    return date.toLocaleDateString('pt-BR', {
        timeZone: 'UTC',
    })
}

function getDayName(
    dateString: string,
): string {
    const date = new Date(dateString)

    return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        timeZone: 'UTC',
    })
}

function getExpectedMinutes(
    dateString: string,
): number {
    const date = new Date(dateString)
    const day = date.getUTCDay()

    if (day === 6) {
        return 240
    }

    if (day === 0) {
        return 0
    }

    return 480
}

export function mapWorkdaysToWeekdays(
    workdays: Workday[],
): Weekday[] {
    return workdays.map((workday) => {
        const times =
            workday.timeEntries.map(
                (timeEntry) =>
                    timeEntry.time,
            )

        if (
            times.length === 0 ||
            times.length % 2 !== 0
        ) {
            throw new Error(
                `A jornada de ${formatDate(workday.date)} possui uma quantidade inválida de registros de horário.`,
            )
        }

        return {
            date: formatDate(workday.date),
            day: getDayName(workday.date),
            times,
            expectedMinutes:
                getExpectedMinutes(
                    workday.date,
                ),
        }
    })
}