interface WorkdayInput {
    times: string[]
    expectedMinutes: number
}

export interface WorkdayResult {
    lunchMinutes: number
    workedMinutes: number
    expectedMinutes: number
    balanceMinutes: number
}

export interface Weekday {
    date: string
    day: string
    times: string[]
    expectedMinutes: number
}

export interface WeekResult {
    totalWorkedMinutes: number
    totalExpectedMinutes: number
    totalBalanceMinutes: number
    days: Array<{
        date: string
        day: string
        result: WorkdayResult
    }>
}

export function getExpectedMinutes(
    date: string | Date,
): number {
    let dateValue: Date

    if (
        typeof date === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
        const parts =
            date.split('-')

        const year =
            Number(parts[0])

        const month =
            Number(parts[1])

        const day =
            Number(parts[2])

        dateValue = new Date(
            Date.UTC(
                year,
                month - 1,
                day,
            ),
        )
    } else {
        dateValue =
            typeof date === 'string'
                ? new Date(date)
                : date
    }

    if (Number.isNaN(dateValue.getTime())) {
        throw new Error(
            `Data inválida: "${String(date)}".`,
        )
    }

    const dayOfWeek =
        dateValue.getUTCDay()

    if (dayOfWeek === 0) {
        return 0
    }

    if (dayOfWeek === 6) {
        return 240
    }

    return 480
}

export function parseTimeToMinutes(
    time: string,
): number {
    const timePattern =
        /^([01]\d|2[0-3]):([0-5]\d)$/

    if (!timePattern.test(time)) {
        throw new Error(
            `Horário inválido: "${time}". Use o formato HH:mm.`,
        )
    }

    const parts =
        time.split(':')

    const hours =
        Number(parts[0])

    const minutes =
        Number(parts[1])

    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes)
    ) {
        throw new Error(
            `Horário inválido: "${time}".`,
        )
    }

    return hours * 60 + minutes
}

export function calculateWorkday({
    times,
    expectedMinutes,
}: WorkdayInput): WorkdayResult {
    if (times.length % 2 !== 0) {
        throw new Error(
            'Uma jornada precisa possuir uma quantidade par de horários.',
        )
    }

    const minutes =
        times.map(parseTimeToMinutes)

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

        if (
            exit < entry
        ) {
            throw new Error(
                `O horário de saída (${times[index + 1]}) não pode ser anterior ao horário de entrada (${times[index]}).`,
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

    const balanceMinutes =
        workedMinutes -
        expectedMinutes

    return {
        lunchMinutes,
        workedMinutes,
        expectedMinutes,
        balanceMinutes,
    }
}

export function calculateWeek(
    weekdays: Weekday[],
): WeekResult {
    const days = weekdays.map(
        (weekday) => {
            const result =
                calculateWorkday({
                    times: weekday.times,
                    expectedMinutes:
                        weekday.expectedMinutes,
                })

            return {
                date: weekday.date,
                day: weekday.day,
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