import type {
    Weekday,
    WorkdayResult,
    WeekResult,
} from '../types/workday'

import {
    getExpectedMinutes,
} from './date'

export function calculateWeek(
    weekdays: Weekday[],
): WeekResult {
    const days =
        weekdays.map(
            (weekday) => {
                const result: WorkdayResult =
                    calculateWorkday(
                        {
                            times:
                                weekday.times,
                            expectedMinutes:
                                weekday.expectedMinutes,
                        },
                    )

                return {
                    date:
                        weekday.date,
                    day:
                        weekday.day,
                    result,
                }
            },
        )

    const totalWorkedMinutes =
        days.reduce(
            (
                total,
                day,
            ) =>
                total +
                day.result
                    .workedMinutes,
            0,
        )

    const totalExpectedMinutes =
        days.reduce(
            (
                total,
                day,
            ) =>
                total +
                day.result
                    .expectedMinutes,
            0,
        )

    const totalBalanceMinutes =
        totalWorkedMinutes -
        totalExpectedMinutes

    return {
        totalWorkedMinutes,
        totalExpectedMinutes,
        totalBalanceMinutes,
        days,
    }
}

export function parseTimeToMinutes(
    time: string,
): number {
    const pattern =
        /^([01]\d|2[0-3]):([0-5]\d)$/

    if (!pattern.test(time)) {
        throw new Error(
            `Horário inválido: "${time}". Use o formato HH:mm.`,
        )
    }

    const [
        hours,
        minutes,
    ] = time
        .split(':')
        .map(Number)

    return (
        hours * 60 +
        minutes
    )
}

export function calculateWorkday({
    times,
    expectedMinutes,
}: {
    times: string[]
    expectedMinutes: number
}): WorkdayResult {
    if (times.length % 2 !== 0) {
        throw new Error(
            'Uma jornada precisa possuir uma quantidade par de horários.',
        )
    }

    const minutes =
        times.map(
            parseTimeToMinutes,
        )

    let workedMinutes = 0

    for (
        let index = 0;
        index < minutes.length;
        index += 2
    ) {
        const entry =
            minutes[index]

        const exit =
            minutes[index + 1]

        if (
            entry === undefined ||
            exit === undefined
        ) {
            throw new Error(
                'A jornada possui registros de horário incompletos.',
            )
        }

        if (exit < entry) {
            throw new Error(
                `O horário de saída(${ times[index + 1]}) não pode ser anterior ao horário de entrada(${ times[index]}).`,
            )
        }

        workedMinutes +=
            exit - entry
    }

    let lunchMinutes = 0

    if (minutes.length >= 4) {
        for (
            let index = 1;
            index < minutes.length - 1;
            index += 2
        ) {
            const exit =
                minutes[index]

            const nextEntry =
                minutes[index + 1]

            if (
                exit === undefined ||
                nextEntry === undefined
            ) {
                throw new Error(
                    'O intervalo da jornada possui registros incompletos.',
                )
            }

            lunchMinutes +=
                nextEntry - exit
        }
    }

    return {
        lunchMinutes,
        workedMinutes,
        expectedMinutes,
        balanceMinutes:
            workedMinutes -
            expectedMinutes,
    }
}

export function calculateWorkdayBalance(
    date: string,
    times: string[],
): number {
    const expectedMinutes =
        getExpectedMinutes(
            date,
        )

    return calculateWorkday({
        times,
        expectedMinutes,
    }).balanceMinutes
}