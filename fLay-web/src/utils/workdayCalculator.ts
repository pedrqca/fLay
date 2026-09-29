interface WorkdayInput {
    entry: string
    lunchExit: string
    lunchReturn: string
    exit: string
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
    entry: string
    lunchExit: string
    lunchReturn: string
    exit: string
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

function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)

    return hours * 60 + minutes
}

export function calculateWorkday({
    entry,
    lunchExit,
    lunchReturn,
    exit,
    expectedMinutes,
}: WorkdayInput): WorkdayResult {
    const entryMinutes = timeToMinutes(entry)
    const lunchExitMinutes = timeToMinutes(lunchExit)
    const lunchReturnMinutes = timeToMinutes(lunchReturn)
    const exitMinutes = timeToMinutes(exit)

    const lunchMinutes =
        lunchReturnMinutes - lunchExitMinutes

    const morningMinutes =
        lunchExitMinutes - entryMinutes

    const afternoonMinutes =
        exitMinutes - lunchReturnMinutes

    const workedMinutes =
        morningMinutes + afternoonMinutes

    const balanceMinutes =
        workedMinutes - expectedMinutes

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
    const days = weekdays.map((weekday) => {
        const result = calculateWorkday({
            entry: weekday.entry,
            lunchExit: weekday.lunchExit,
            lunchReturn: weekday.lunchReturn,
            exit: weekday.exit,
            expectedMinutes: weekday.expectedMinutes,
        })

        return {
            date: weekday.date,
            day: weekday.day,
            result,
        }
    })

    const totalWorkedMinutes = days.reduce(
        (total, day) =>
            total + day.result.workedMinutes,
        0,
    )

    const totalExpectedMinutes = days.reduce(
        (total, day) =>
            total + day.result.expectedMinutes,
        0,
    )

    const totalBalanceMinutes =
        totalWorkedMinutes - totalExpectedMinutes

    return {
        totalWorkedMinutes,
        totalExpectedMinutes,
        totalBalanceMinutes,
        days,
    }
}