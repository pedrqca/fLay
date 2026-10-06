export function formatMinutes(
    minutes: number,
): string {
    const absoluteMinutes =
        Math.abs(minutes)

    const hours =
        Math.floor(
            absoluteMinutes / 60,
        )

    const remainingMinutes =
        absoluteMinutes % 60

    const sign =
        minutes < 0
            ? '-'
            : '+'

    return `${sign}${hours}h${String(
        remainingMinutes,
    ).padStart(2, '0')}`
}

export function formatMinutesLong(
    minutes: number,
): string {
    const absoluteMinutes =
        Math.abs(minutes)

    const hours =
        Math.floor(
            absoluteMinutes / 60,
        )

    const remainingMinutes =
        absoluteMinutes % 60

    return `${hours
        .toString()
        .padStart(
            2,
            '0',
        )}h ${remainingMinutes
            .toString()
            .padStart(
                2,
                '0',
            )}min`
}

export function convertHoursToMinutes(
    hours: string,
): number {
    if (!hours) {
        return 0
    }

    const [
        hoursPart,
        minutesPart,
    ] = hours
        .split(':')
        .map(Number)

    if (
        !Number.isFinite(
            hoursPart,
        ) ||
        !Number.isFinite(
            minutesPart,
        )
    ) {
        return 0
    }

    return (
        hoursPart * 60 +
        minutesPart
    )
}