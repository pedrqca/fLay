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

export interface CreateWorkdayData {
    userId: number
    expectedMinutes: number
    proofs: {
        date: string
        time: string
    }[]
}

export interface UpdateWorkdayData {
    expectedMinutes: number
    proofs: {
        date: string
        time: string
    }[]
}

const API_URL = 'http://localhost:3333'

export async function getWorkdays(
    userId: number,
): Promise<Workday[]> {
    const response = await fetch(
        `${API_URL}/users/${userId}/workdays`,
    )

    if (!response.ok) {
        throw new Error(
            'Não foi possível carregar as jornadas.',
        )
    }

    return response.json()
}

export async function createWorkday(
    data: CreateWorkdayData,
) {
    const response = await fetch(
        `${API_URL}/workdays`,
        {
            method: 'POST',
            headers: {
                'Content-Type':
                    'application/json',
            },
            body: JSON.stringify(data),
        },
    )

    if (!response.ok) {
        const error =
            await response.json()

        throw new Error(
            error.message ??
            'Não foi possível registrar a jornada.',
        )
    }

    return response.json()
}

export async function updateWorkday(
    workdayId: number,
    data: UpdateWorkdayData,
) {
    const response = await fetch(
        `${API_URL}/workdays/${workdayId}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type':
                    'application/json',
            },
            body: JSON.stringify(data),
        },
    )

    if (!response.ok) {
        const error =
            await response.json()

        throw new Error(
            error.message ??
            'Não foi possível atualizar a jornada.',
        )
    }

    return response.json()
}

export async function deleteWorkday(
    workdayId: number,
): Promise<void> {
    const response = await fetch(
        `${API_URL}/workdays/${workdayId}`,
        {
            method: 'DELETE',
        },
    )

    if (!response.ok) {
        throw new Error(
            'Não foi possível excluir a jornada.',
        )
    }
}