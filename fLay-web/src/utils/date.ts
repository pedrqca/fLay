export function parseCivilDate(
    dateStr: string,
): Date {
    const [
        datePart,
    ] = dateStr.split('T')

    const [
        year,
        month,
        day,
    ] = datePart.split('-').map(Number)

    return new Date(
        Date.UTC(
            year,
            month - 1,
            day,
            12,
            0,
            0,
        ),
    )
}

export function formatDateKey(date: Date): string {
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

export function getWeekStart(date: Date): Date {
    const weekStart = new Date(date)
    const dayOfWeek = weekStart.getUTCDay()
    const daysFromMonday =
        dayOfWeek === 0
            ? -6
            : 1 - dayOfWeek

    weekStart.setUTCDate(
        weekStart.getUTCDate() +
        daysFromMonday,
    )

    return weekStart
}

export function getWeekEnd(date: Date): Date {
    const weekEnd = getWeekStart(date)

    weekEnd.setUTCDate(
        weekEnd.getUTCDate() + 6,
    )

    return weekEnd
}

export function getCurrentWeekRange() {
    const today = new Date()

    const todayAsCivilDate = new Date(
        Date.UTC(
            today.getFullYear(),
            today.getMonth(),
            today.getDate(),
            12,
            0,
            0,
        ),
    )

    const startOfWeek =
        getWeekStart(todayAsCivilDate)
    const endOfWeek =
        getWeekEnd(todayAsCivilDate)

    return {
        start: formatDateKey(
            startOfWeek,
        ),
        end: formatDateKey(
            endOfWeek,
        ),
    }
}

export function getDateKey(
    date: string,
): string {
    return date.split('T')[0]
}

export function normalizeDate(
    date: string,
): string {
    return date.split('T')[0]
}

export function formatDate(
    date: string,
): string {
    const dateObject =
        parseCivilDate(date)

    const day = String(
        dateObject.getUTCDate(),
    ).padStart(2, '0')
    const month = String(
        dateObject.getUTCMonth() + 1,
    ).padStart(2, '0')
    const year =
        dateObject.getUTCFullYear()

    return `${day}/${month}/${year}`
}

export function getExpectedMinutes(
    date: string,
): number {
    const dayOfWeek =
        parseCivilDate(date).getUTCDay()

    if (dayOfWeek === 0) {
        return 0
    }

    if (dayOfWeek === 6) {
        return 240
    }

    return 480
}