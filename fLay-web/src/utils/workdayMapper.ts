import type {
    Workday,
    Weekday,
} from '../types/workday'

import type { Proof } from '../types/proof'

import {
    formatDate,
    getExpectedMinutes,
    parseCivilDate,
} from './date'

function getDayName(
    dateString: string,
): string {
    return parseCivilDate(dateString).toLocaleDateString('pt-BR', {
        weekday: 'long',
        timeZone: 'UTC',
    })
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
            console.warn(
                `A jornada de ${formatDate(workday.date)} possui uma quantidade inválida de registros de horário.`,
            )

            return {
                date: formatDate(workday.date),
                day: getDayName(workday.date),
                times: [
                    '00:00',
                    '00:00',
                ],
                expectedMinutes:
                    getExpectedMinutes(
                        workday.date,
                    ),
            }
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

export function mapWorkdaysToProofs(
    workdays: Workday[],
): Proof[] {
    return workdays.map((workday) => ({
        id: workday.id,
        date: formatDate(workday.date),
        times: workday.timeEntries.map(
            (timeEntry) => timeEntry.time,
        ),
    }))
}