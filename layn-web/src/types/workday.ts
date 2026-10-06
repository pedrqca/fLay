export interface WorkdayTimeEntry {
    id: number
    workdayId: number
    time: string
    createdAt: string
}

export interface Workday {
    id: number
    userId: number
    date: string
    createdAt: string
    timeEntries: WorkdayTimeEntry[]
}

export interface WorkdayProof {
    date: string
    time: string
}

export interface CreateWorkdayData {
    userId: number
    expectedMinutes: number
    proofs: WorkdayProof[]
}

export interface UpdateWorkdayData {
    expectedMinutes: number
    proofs: WorkdayProof[]
}

export interface Weekday {
    date: string
    day: string
    times: string[]
    expectedMinutes: number
}

export interface WorkdayResult {
    lunchMinutes: number
    workedMinutes: number
    expectedMinutes: number
    balanceMinutes: number
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