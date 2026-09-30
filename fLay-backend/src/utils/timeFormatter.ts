export function formatMinutes(minutes: number): string {
    const sign = minutes < 0 ? '-' : '+'
    const absoluteMinutes = Math.abs(minutes)

    const hours = Math.floor(absoluteMinutes / 60)
    const remainingMinutes = absoluteMinutes % 60

    if (remainingMinutes === 0) {
        return `${sign}${hours}h`
    }

    return `${sign}${hours}h ${remainingMinutes}min`
}