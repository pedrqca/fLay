import type { Weekday } from '../utils/workdayCalculator'

export const currentWeek: Weekday[] = [
    {
        date: '29/09/2026',
        day: 'Segunda',
        entry: '08:00',
        lunchExit: '12:00',
        lunchReturn: '13:00',
        exit: '18:00',
        expectedMinutes: 8 * 60,
    },
    {
        date: '30/09/2026',
        day: 'Terça',
        entry: '08:00',
        lunchExit: '12:00',
        lunchReturn: '13:00',
        exit: '18:00',
        expectedMinutes: 8 * 60,
    },
    {
        date: '01/10/2026',
        day: 'Quarta',
        entry: '08:00',
        lunchExit: '12:00',
        lunchReturn: '13:30',
        exit: '18:30',
        expectedMinutes: 8 * 60,
    },
    {
        date: '02/10/2026',
        day: 'Quinta',
        entry: '08:00',
        lunchExit: '12:00',
        lunchReturn: '13:30',
        exit: '18:30',
        expectedMinutes: 8 * 60,
    },
    {
        date: '03/10/2026',
        day: 'Sexta',
        entry: '08:00',
        lunchExit: '12:00',
        lunchReturn: '13:00',
        exit: '18:00',
        expectedMinutes: 8 * 60,
    },
]