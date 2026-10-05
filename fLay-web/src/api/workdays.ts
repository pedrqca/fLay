import type {
    Workday,
    CreateWorkdayData,
    UpdateWorkdayData,
} from '../types/workday'

const API_URL =
    import.meta.env.VITE_API_URL ??
    'http://localhost:3333'

async function getResponseErrorMessage(
    response: Response,
    fallback: string,
): Promise<string> {
    try {
        const errorData =
            (await response.json()) as {
                message?: string
                error?: string
            }

        if (errorData.message) {
            return errorData.message
        }

        if (errorData.error) {
            return errorData.error
        }
    } catch {
        // Keep the operation-specific fallback when the body is not JSON.
    }

    return fallback
}

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
        throw new Error(
            await getResponseErrorMessage(
                response,
                'Não foi possível registrar a jornada.',
            ),
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
        throw new Error(
            await getResponseErrorMessage(
                response,
                'Não foi possível atualizar a jornada.',
            ),
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